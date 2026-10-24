/**
 * Festiya Cloudflare Workers Hono API Router
 * Implements full REST API endpoints with authentication, object-level authorization,
 * AI gateway orchestration, D1 database persistence, and billing webhooks.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "../db/database.ts";
import { aiGateway } from "../ai/gateway.ts";
import { getWorkspaceEntitlements, canCreateEvent, canGeneratePlan } from "../services/billing.ts";
import { generateClientProposalMarkdown, exportUserData } from "../services/export.ts";
import { seedDemoData } from "../db/seed.ts";
import { billingRouter } from "./billingRoutes.ts";
import { itemRouter } from "./itemRoutes.ts";
import { workspaceRouter } from "./workspaceRoutes.ts";

type AppVariables = {
  userId: string;
};

export const app = new Hono<{ Variables: AppVariables }>();

app.use("*", cors());

// Initialize demo data if empty
let isSeeded = false;
async function ensureSeeded() {
  if (!isSeeded) {
    const user = await db.getUser("usr_souvik");
    if (!user) {
      await seedDemoData(db);
    }
    isSeeded = true;
  }
}

// Authentication & Context Simulation
// In a full Cloudflare deployment, session cookies or JWT tokens authenticate the user.
// Here we support custom 'x-user-id' header or fallback to default session user.
app.use("*", async (c, next) => {
  await ensureSeeded();
  const userId = c.req.header("x-user-id") || "usr_souvik";
  c.set("userId", userId);
  await next();
});

// 1. Health Check
app.get("/api/health", (c) => {
  return c.json({ status: "healthy", service: "festiya-api", version: "1.0.0" });
});

// Mount Workspace & User routes
app.route("/", workspaceRouter);

// 5. Single Event Object
app.get("/api/events/:eventId", async (c) => {
  const userId = c.get("userId");
  const eventId = c.req.param("eventId");

  const event = await db.getEvent(eventId);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const member = await db.getWorkspaceMember(event.workspaceId, userId);
  if (!member) return c.json({ error: "Access denied" }, 403);

  const plan = await db.getLatestPlan(eventId);
  return c.json({ event, plan });
});

app.patch("/api/events/:eventId", async (c) => {
  const userId = c.get("userId");
  const eventId = c.req.param("eventId");

  const event = await db.getEvent(eventId);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const member = await db.getWorkspaceMember(event.workspaceId, userId);
  if (!member || member.role === "viewer" || member.role === "client") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const body = await c.req.json();
  const updated = await db.updateEvent(eventId, body);
  return c.json({ event: updated });
});

app.delete("/api/events/:eventId", async (c) => {
  const userId = c.get("userId");
  const eventId = c.req.param("eventId");

  const event = await db.getEvent(eventId);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const member = await db.getWorkspaceMember(event.workspaceId, userId);
  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    return c.json({ error: "Forbidden: only owners and admins can delete events" }, 403);
  }

  await db.deleteEvent(eventId);
  return c.json({ success: true });
});

// 6. Plan Generation & Revision
app.post("/api/events/:eventId/plan/generate", async (c) => {
  const userId = c.get("userId");
  const eventId = c.req.param("eventId");

  const event = await db.getEvent(eventId);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const member = await db.getWorkspaceMember(event.workspaceId, userId);
  if (!member || member.role === "viewer") {
    return c.json({ error: "Insufficient permissions" }, 403);
  }

  const entitlements = await getWorkspaceEntitlements(db, event.workspaceId);
  if (!canGeneratePlan(entitlements)) {
    return c.json(
      {
        error: `Monthly AI plan generation quota reached for tier ${entitlements.tier}. Upgrade to continue.`,
        code: "QUOTA_EXCEEDED",
      },
      403
    );
  }

  // Generate structured plan
  const result = await aiGateway.generatePlan(event);

  // Persist plan version
  const latestPlan = await db.getLatestPlan(eventId);
  const nextVersion = latestPlan ? latestPlan.version + 1 : 1;

  const newPlan = {
    id: `pln_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    version: nextVersion,
    schemaVersion: "1" as const,
    status: "active" as const,
    summary: result.plan.summary,
    assumptions: result.plan.assumptions,
    openQuestions: result.plan.openQuestions,
    content: result.plan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createPlan(newPlan);

  // Automatically populate initial tasks and budget items if first version
  if (nextVersion === 1) {
    const budgetPromises = result.plan.budget.items.map((b) =>
      db.createBudgetItem({
        id: `bi_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        category: b.category,
        label: b.label,
        lowEstimate: b.lowEstimate,
        likelyEstimate: b.likelyEstimate,
        highEstimate: b.highEstimate,
        currency: result.plan.budget.currency,
        status: "estimated",
        isEstimate: true,
        rationale: b.rationale,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    const taskPromises = result.plan.tasks.map((t) =>
      db.createTask({
        id: `tsk_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        title: t.title,
        description: t.description,
        status: "todo",
        priority: t.priority,
        dueDate: t.dueDate,
        dueOffsetDays: t.dueOffsetDays,
        dependsOn: t.dependsOn || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    const vendorPromises = result.plan.vendorCategories.map((v) =>
      db.createVendor({
        id: `vnd_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        name: `Prospective ${v.category}`,
        category: v.category,
        notes: `Selection criteria: ${v.selectionCriteria.join("; ")}`,
        status: "to_research",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );

    const ideaPromises = result.plan.ideas.map((idea) =>
      db.createIdea({
        id: `id_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        estimatedCostImpact: idea.estimatedCostImpact || "unknown",
        isAccepted: false,
        createdAt: new Date().toISOString(),
      })
    );

    const riskPromises = result.plan.risks.map((risk) =>
      db.createRisk({
        id: `rsk_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        risk: risk.risk,
        mitigation: risk.mitigation,
        severity: "medium",
        isResolved: false,
        createdAt: new Date().toISOString(),
      })
    );

    const rosPromises = (result.plan.runOfShow || []).map((item, i) =>
      db.createRunOfShow({
        id: `ros_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        timeLabel: item.time || "18:00",
        activity: item.activity,
        ownerName: item.owner,
        sortOrder: i,
        createdAt: new Date().toISOString(),
      })
    );

    await Promise.all([
      ...budgetPromises,
      ...taskPromises,
      ...vendorPromises,
      ...ideaPromises,
      ...riskPromises,
      ...rosPromises,
    ]);
  }

  // Record metered usage in ledger
  await db.recordUsage({
    id: `usg_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId: event.workspaceId,
    feature: "plan_generate",
    quantity: 1,
    providerModel: result.providerUsed,
    estimatedCost: result.estimatedCost,
    requestId: `req_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  return c.json({ plan: newPlan, metadata: result });
});

app.post("/api/events/:eventId/plan/revise", async (c) => {
  const userId = c.get("userId");
  const eventId = c.req.param("eventId");

  const event = await db.getEvent(eventId);
  if (!event) return c.json({ error: "Event not found" }, 404);

  const member = await db.getWorkspaceMember(event.workspaceId, userId);
  if (!member || member.role === "viewer") {
    return c.json({ error: "Forbidden" }, 403);
  }

  const latestPlan = await db.getLatestPlan(eventId);
  if (!latestPlan) return c.json({ error: "No base plan to revise" }, 400);

  const { instruction } = await c.req.json();
  if (!instruction) return c.json({ error: "Instruction required" }, 400);

  const result = await aiGateway.revisePlan(latestPlan.content, instruction);

  const nextVersion = latestPlan.version + 1;
  const revisedPlan = {
    id: `pln_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    version: nextVersion,
    schemaVersion: "1" as const,
    status: "active" as const,
    summary: result.plan.summary,
    assumptions: result.plan.assumptions,
    openQuestions: result.plan.openQuestions,
    content: result.plan,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createPlan(revisedPlan);

  await db.recordUsage({
    id: `usg_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId: event.workspaceId,
    feature: "plan_revise",
    quantity: 1,
    providerModel: result.providerUsed,
    estimatedCost: result.estimatedCost,
    requestId: `req_${Date.now()}`,
    createdAt: new Date().toISOString(),
  });

  return c.json({ plan: revisedPlan, metadata: result });
});

app.get("/api/events/:eventId/plans", async (c) => {
  const eventId = c.req.param("eventId");
  const plans = await db.listPlans(eventId);
  return c.json({ plans });
});



// Mount modular sub-routers
app.route("/", itemRouter);
app.route("/", billingRouter);
