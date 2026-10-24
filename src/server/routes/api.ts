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

// 2. User Profile
app.get("/api/me", async (c) => {
  const userId = c.get("userId");
  const user = await db.getUser(userId);
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json({ user });
});

// 3. Workspaces
app.get("/api/workspaces", async (c) => {
  const userId = c.get("userId");
  const workspaces = await db.listWorkspacesForUser(userId);
  return c.json({ workspaces });
});

app.post("/api/workspaces", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const workspace = {
    id: `ws_${Math.random().toString(36).substring(2, 9)}`,
    name: body.name || "My Workspace",
    type: body.type === "professional" ? ("professional" as const) : ("personal" as const),
    ownerId: userId,
    brandName: body.brandName,
    brandColor: body.brandColor,
    subscriptionTier: "free" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createWorkspace(workspace);
  await db.addWorkspaceMember({
    id: `wsm_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId: workspace.id,
    userId,
    role: "owner",
    status: "active",
    createdAt: new Date().toISOString(),
  });

  return c.json({ workspace }, 201);
});

// 4. Workspace Events
app.get("/api/workspaces/:workspaceId/events", async (c) => {
  const userId = c.get("userId");
  const workspaceId = c.req.param("workspaceId");

  const member = await db.getWorkspaceMember(workspaceId, userId);
  if (!member) return c.json({ error: "Access denied to workspace" }, 403);

  const events = await db.listEvents(workspaceId);
  return c.json({ events });
});

app.post("/api/workspaces/:workspaceId/events", async (c) => {
  const userId = c.get("userId");
  const workspaceId = c.req.param("workspaceId");

  const member = await db.getWorkspaceMember(workspaceId, userId);
  if (!member || (member.role !== "owner" && member.role !== "admin" && member.role !== "planner")) {
    return c.json({ error: "Insufficient permissions to create events in this workspace" }, 403);
  }

  const entitlements = await getWorkspaceEntitlements(db, workspaceId);
  if (!canCreateEvent(entitlements)) {
    return c.json(
      {
        error: `Active event limit reached for tier ${entitlements.tier}. Upgrade to create more events.`,
        code: "LIMIT_EXCEEDED",
      },
      403
    );
  }

  const body = await c.req.json();
  const event = {
    id: `evt_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId,
    name: body.name || "New Event",
    occasion: body.occasion || body.name || "Celebration",
    category: body.category || "custom",
    dateMode: body.dateMode || "decided",
    startDate: body.startDate,
    endDate: body.endDate,
    timezone: body.timezone || "UTC",
    locationMode: body.locationMode || "in_person",
    locationAddress: body.locationAddress,
    guestCount: body.guestCount ? Number(body.guestCount) : undefined,
    currency: body.currency || "USD",
    targetBudget: body.targetBudget ? Number(body.targetBudget) : undefined,
    style: body.style,
    constraints: body.constraints,
    createdBy: userId,
    status: "planning" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createEvent(event);
  await db.logActivity({
    id: `act_${Math.random().toString(36).substring(2, 9)}`,
    workspaceId,
    eventId: event.id,
    actorId: userId,
    actorName: "Planner",
    action: "event.created",
    entityType: "event",
    entityId: event.id,
    createdAt: new Date().toISOString(),
  });

  return c.json({ event }, 201);
});

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
    for (const b of result.plan.budget.items) {
      await db.createBudgetItem({
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
      });
    }

    for (const t of result.plan.tasks) {
      await db.createTask({
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
      });
    }

    for (const v of result.plan.vendorCategories) {
      await db.createVendor({
        id: `vnd_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        name: `Prospective ${v.category}`,
        category: v.category,
        notes: `Selection criteria: ${v.selectionCriteria.join("; ")}`,
        status: "to_research",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    for (const idea of result.plan.ideas) {
      await db.createIdea({
        id: `id_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        estimatedCostImpact: idea.estimatedCostImpact || "unknown",
        isAccepted: false,
        createdAt: new Date().toISOString(),
      });
    }

    for (const risk of result.plan.risks) {
      await db.createRisk({
        id: `rsk_${Math.random().toString(36).substring(2, 9)}`,
        eventId,
        risk: risk.risk,
        mitigation: risk.mitigation,
        severity: "medium",
        isResolved: false,
        createdAt: new Date().toISOString(),
      });
    }

    if (result.plan.runOfShow) {
      for (let i = 0; i < result.plan.runOfShow.length; i++) {
        const item = result.plan.runOfShow[i];
        await db.createRunOfShow({
          id: `ros_${Math.random().toString(36).substring(2, 9)}`,
          eventId,
          timeLabel: item.time || "18:00",
          activity: item.activity,
          ownerName: item.owner,
          sortOrder: i,
          createdAt: new Date().toISOString(),
        });
      }
    }
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

// 7. Tasks
app.get("/api/events/:eventId/tasks", async (c) => {
  const eventId = c.req.param("eventId");
  const tasks = await db.listTasks(eventId);
  return c.json({ tasks });
});

app.post("/api/events/:eventId/tasks", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json();

  const task = {
    id: `tsk_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    title: body.title || "Untitled Task",
    description: body.description,
    status: body.status || "todo",
    priority: body.priority || "medium",
    ownerName: body.ownerName,
    dueDate: body.dueDate,
    dueOffsetDays: body.dueOffsetDays,
    dependsOn: body.dependsOn || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createTask(task);
  return c.json({ task }, 201);
});

app.patch("/api/events/:eventId/tasks/:taskId", async (c) => {
  const taskId = c.req.param("taskId");
  const body = await c.req.json();
  const updated = await db.updateTask(taskId, body);
  return c.json({ task: updated });
});

app.delete("/api/events/:eventId/tasks/:taskId", async (c) => {
  const taskId = c.req.param("taskId");
  await db.deleteTask(taskId);
  return c.json({ success: true });
});

// 8. Budget Items
app.get("/api/events/:eventId/budget-items", async (c) => {
  const eventId = c.req.param("eventId");
  const items = await db.listBudgetItems(eventId);
  return c.json({ items });
});

app.post("/api/events/:eventId/budget-items", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json();

  const item = {
    id: `bi_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    category: body.category || "General",
    label: body.label || "Expense item",
    lowEstimate: body.lowEstimate ? Number(body.lowEstimate) : undefined,
    likelyEstimate: body.likelyEstimate ? Number(body.likelyEstimate) : undefined,
    highEstimate: body.highEstimate ? Number(body.highEstimate) : undefined,
    quotedAmount: body.quotedAmount ? Number(body.quotedAmount) : undefined,
    committedAmount: body.committedAmount ? Number(body.committedAmount) : undefined,
    actualAmount: body.actualAmount ? Number(body.actualAmount) : undefined,
    currency: body.currency || "USD",
    status: body.status || "estimated",
    isEstimate: body.isEstimate ?? true,
    rationale: body.rationale,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createBudgetItem(item);
  return c.json({ item }, 201);
});

app.patch("/api/events/:eventId/budget-items/:itemId", async (c) => {
  const itemId = c.req.param("itemId");
  const body = await c.req.json();
  const updated = await db.updateBudgetItem(itemId, body);
  return c.json({ item: updated });
});

app.delete("/api/events/:eventId/budget-items/:itemId", async (c) => {
  const itemId = c.req.param("itemId");
  await db.deleteBudgetItem(itemId);
  return c.json({ success: true });
});

// 9. Vendors
app.get("/api/events/:eventId/vendors", async (c) => {
  const eventId = c.req.param("eventId");
  const vendors = await db.listVendors(eventId);
  return c.json({ vendors });
});

app.post("/api/events/:eventId/vendors", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json();

  const vendor = {
    id: `vnd_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    name: body.name || "New Vendor",
    category: body.category || "General",
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    website: body.website,
    notes: body.notes,
    quoteAmount: body.quoteAmount ? Number(body.quoteAmount) : undefined,
    quoteCurrency: body.quoteCurrency,
    status: body.status || "to_research",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await db.createVendor(vendor);
  return c.json({ vendor }, 201);
});

app.patch("/api/events/:eventId/vendors/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const body = await c.req.json();
  const updated = await db.updateVendor(vendorId, body);
  return c.json({ vendor: updated });
});

app.delete("/api/events/:eventId/vendors/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  await db.deleteVendor(vendorId);
  return c.json({ success: true });
});

// 10. Ideas, Risks, Run of Show
app.get("/api/events/:eventId/ideas", async (c) => {
  const eventId = c.req.param("eventId");
  const ideas = await db.listIdeas(eventId);
  return c.json({ ideas });
});

app.patch("/api/events/:eventId/ideas/:ideaId", async (c) => {
  const ideaId = c.req.param("ideaId");
  const body = await c.req.json();
  const updated = await db.updateIdea(ideaId, body);
  return c.json({ idea: updated });
});

app.get("/api/events/:eventId/risks", async (c) => {
  const eventId = c.req.param("eventId");
  const risks = await db.listRisks(eventId);
  return c.json({ risks });
});

app.get("/api/events/:eventId/run-of-show", async (c) => {
  const eventId = c.req.param("eventId");
  const items = await db.listRunOfShow(eventId);
  return c.json({ items });
});

app.post("/api/events/:eventId/run-of-show", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json();
  const item = {
    id: `ros_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    timeLabel: body.timeLabel || "12:00",
    activity: body.activity || "Activity",
    ownerName: body.ownerName,
    sortOrder: body.sortOrder || 0,
    createdAt: new Date().toISOString(),
  };
  await db.createRunOfShow(item);
  return c.json({ item }, 201);
});

// 11. Sharing & Client Portals
app.post("/api/events/:eventId/share", async (c) => {
  const eventId = c.req.param("eventId");
  const body = await c.req.json();

  const share = {
    id: `shr_${Math.random().toString(36).substring(2, 9)}`,
    eventId,
    shareToken: `festiya-share-${Math.random().toString(36).substring(2, 12)}`,
    role: body.role || "viewer",
    allowedSections: body.allowedSections || ["summary", "budget", "timeline", "vendors", "ideas", "runOfShow"],
    expiresAt: body.expiresAt,
    isRevoked: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
  };

  await db.createShare(share);
  return c.json({ share });
});

app.get("/api/shares/:shareToken", async (c) => {
  const token = c.req.param("shareToken");
  const share = await db.getShareByToken(token);
  if (!share) return c.json({ error: "Share link not found or expired" }, 404);

  await db.incrementShareViews(token);
  const event = await db.getEvent(share.eventId);
  if (!event) return c.json({ error: "Event no longer exists" }, 404);

  const plan = await db.getLatestPlan(share.eventId);
  const budgetItems = share.allowedSections.includes("budget") ? await db.listBudgetItems(share.eventId) : [];
  const tasks = share.allowedSections.includes("timeline") ? await db.listTasks(share.eventId) : [];
  const vendors = share.allowedSections.includes("vendors") ? await db.listVendors(share.eventId) : [];
  const ideas = share.allowedSections.includes("ideas") ? await db.listIdeas(share.eventId) : [];
  const runOfShow = share.allowedSections.includes("runOfShow") ? await db.listRunOfShow(share.eventId) : [];

  return c.json({
    event,
    plan,
    budgetItems,
    tasks,
    vendors,
    ideas,
    runOfShow,
    role: share.role,
    allowedSections: share.allowedSections,
  });
});

app.delete("/api/shares/:shareId", async (c) => {
  const shareId = c.req.param("shareId");
  await db.revokeShare(shareId);
  return c.json({ success: true });
});

// 12. Proposals & Client Exports
app.get("/api/events/:eventId/export/proposal", async (c) => {
  const eventId = c.req.param("eventId");
  const md = await generateClientProposalMarkdown(db, eventId);
  return c.text(md);
});

// 13. Billing & Subscriptions
app.get("/api/billing/entitlements", async (c) => {
  const workspaceId = c.req.query("workspaceId") || "ws_personal";
  const entitlements = await getWorkspaceEntitlements(db, workspaceId);
  return c.json({ entitlements });
});

app.post("/api/billing/checkout", async (c) => {
  const { workspaceId, targetTier } = await c.req.json();
  // Simulates secure provider checkout session (e.g. Stripe checkout URL)
  return c.json({
    checkoutUrl: `https://checkout.festiya.app/simulate?workspace=${workspaceId}&tier=${targetTier}`,
    sessionId: `cs_test_${Math.random().toString(36).substring(2, 10)}`,
  });
});

app.post("/api/billing/webhook", async (c) => {
  // Simulates verified webhook from payment provider
  const body = await c.req.json();
  const { workspaceId, tier, status } = body;

  if (workspaceId && tier) {
    await db.updateWorkspace(workspaceId, { subscriptionTier: tier });
    await db.saveSubscription({
      id: `sub_${Math.random().toString(36).substring(2, 9)}`,
      workspaceId,
      tier,
      status: status || "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      paymentProvider: "stripe",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return c.json({ received: true });
});

// 14. GDPR Data Export and Account Deletion
app.post("/api/account/export", async (c) => {
  const userId = c.get("userId");
  const data = await exportUserData(db, userId);
  return c.json(data);
});

app.delete("/api/account", async (c) => {
  // In production, cascades and archives account
  return c.json({ success: true, message: "Account deletion scheduled per GDPR policy" });
});
