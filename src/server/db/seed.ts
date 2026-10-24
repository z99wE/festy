/**
 * Festiya Demo Data Seeder
 * Populates realistic synthetic sample data for personal and professional workspaces.
 * Strictly adheres to PRD rules (no prohibited terms, realistic currency and guest constraints).
 */

import { DatabaseAdapter } from "./database.ts";
import {
  seedUsers,
  seedWorkspaces,
  seedWeddingEvent,
  weddingPlanContent,
  seedCorporateEvent,
  corporatePlanContent,
} from "./seedData.ts";

export async function seedDemoData(db: DatabaseAdapter): Promise<void> {
  const existingUser = await db.getUser("usr_souvik");
  if (existingUser) return; // Already seeded!

  const now = new Date().toISOString();

  // 1. Users
  await Promise.all([
    db.createUser({ ...seedUsers.souvik, createdAt: now, updatedAt: now }),
    db.createUser({ ...seedUsers.elena, createdAt: now, updatedAt: now }),
  ]);

  // 2. Workspaces
  await Promise.all([
    db.createWorkspace({ ...seedWorkspaces.personal, createdAt: now, updatedAt: now }),
    db.createWorkspace({ ...seedWorkspaces.agency, createdAt: now, updatedAt: now }),
  ]);

  await Promise.all([
    db.addWorkspaceMember({ id: "wsm_1", workspaceId: "ws_personal", userId: "usr_souvik", role: "owner", status: "active", createdAt: now }),
    db.addWorkspaceMember({ id: "wsm_2", workspaceId: "ws_agency", userId: "usr_souvik", role: "owner", status: "active", createdAt: now }),
    db.addWorkspaceMember({ id: "wsm_3", workspaceId: "ws_agency", userId: "usr_elena", role: "planner", status: "active", createdAt: now }),
  ]);

  // 3. Subscriptions
  await Promise.all([
    db.saveSubscription({
      id: "sub_1",
      workspaceId: "ws_personal",
      tier: "plus",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(),
      paymentProvider: "stripe",
      createdAt: now,
      updatedAt: now,
    }),
    db.saveSubscription({
      id: "sub_2",
      workspaceId: "ws_agency",
      tier: "pro",
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 365 * 86400000).toISOString(),
      paymentProvider: "stripe",
      createdAt: now,
      updatedAt: now,
    }),
  ]);

  // 4. Wedding Event
  await db.createEvent({ ...seedWeddingEvent, createdAt: now, updatedAt: now });

  await db.createPlan({
    id: "pln_wedding_1",
    eventId: seedWeddingEvent.id,
    version: 1,
    schemaVersion: "1",
    status: "active",
    summary: weddingPlanContent.summary,
    assumptions: weddingPlanContent.assumptions,
    openQuestions: weddingPlanContent.openQuestions,
    content: weddingPlanContent,
    createdAt: now,
    updatedAt: now,
  });

  // Bulk seed wedding tasks, budget, ideas, risks, run of show concurrently
  await Promise.all([
    ...weddingPlanContent.tasks.map((t, idx) =>
      db.createTask({
        id: t.id,
        eventId: seedWeddingEvent.id,
        title: t.title,
        status: idx === 0 ? "done" : "todo",
        priority: t.priority,
        ownerName: idx % 2 === 0 ? "Souvik Chakraborty" : "Elena Rostova",
        dueDate: t.dueDate,
        dependsOn: t.dependsOn,
        createdAt: now,
        updatedAt: now,
      })
    ),
    ...weddingPlanContent.budget.items.map((b) =>
      db.createBudgetItem({
        id: b.id,
        eventId: seedWeddingEvent.id,
        category: b.category,
        label: b.label,
        lowEstimate: b.lowEstimate,
        likelyEstimate: b.likelyEstimate,
        highEstimate: b.highEstimate,
        quotedAmount: b.likelyEstimate,
        committedAmount: b.id === "b_1" ? b.likelyEstimate : undefined,
        actualAmount: b.id === "b_1" ? 500000 : undefined,
        currency: "INR",
        status: b.id === "b_1" ? "committed" : "estimated",
        isEstimate: b.id !== "b_1",
        createdAt: now,
        updatedAt: now,
      })
    ),
    ...weddingPlanContent.ideas.map((idea, idx) =>
      db.createIdea({
        id: `idea_${idx + 1}`,
        eventId: seedWeddingEvent.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        estimatedCostImpact: idea.estimatedCostImpact || "unknown",
        isAccepted: idx === 0,
        createdAt: now,
      })
    ),
    ...weddingPlanContent.risks.map((r, idx) =>
      db.createRisk({
        id: `risk_${idx + 1}`,
        eventId: seedWeddingEvent.id,
        risk: r.risk,
        mitigation: r.mitigation,
        severity: idx === 0 ? "medium" : "high",
        isResolved: false,
        createdAt: now,
      })
    ),
    ...(weddingPlanContent.runOfShow || []).map((ros, idx) =>
      db.createRunOfShow({
        id: `ros_${idx + 1}`,
        eventId: seedWeddingEvent.id,
        timeLabel: ros.time || "18:00",
        activity: ros.activity,
        ownerName: ros.owner,
        sortOrder: idx,
        createdAt: now,
      })
    ),
    db.createShare({
      id: "shr_wedding_client",
      eventId: seedWeddingEvent.id,
      shareToken: "festiya-demo-jaipur-wedding-link",
      role: "client",
      allowedSections: ["summary", "budget", "timeline", "vendors", "ideas", "runOfShow"],
      isRevoked: false,
      viewCount: 14,
      createdAt: now,
    }),
  ]);

  // 5. Corporate Event (Apex Summit)
  await db.createEvent({ ...seedCorporateEvent, createdAt: now, updatedAt: now });

  await db.createPlan({
    id: "pln_apex_1",
    eventId: seedCorporateEvent.id,
    version: 1,
    schemaVersion: "1",
    status: "active",
    summary: corporatePlanContent.summary,
    assumptions: corporatePlanContent.assumptions,
    openQuestions: corporatePlanContent.openQuestions,
    content: corporatePlanContent,
    createdAt: now,
    updatedAt: now,
  });

  await Promise.all([
    ...corporatePlanContent.tasks.map((t) =>
      db.createTask({
        id: t.id,
        eventId: seedCorporateEvent.id,
        title: t.title,
        status: "todo",
        priority: t.priority,
        ownerName: "Elena Rostova",
        dueDate: t.dueDate,
        dependsOn: t.dependsOn,
        createdAt: now,
        updatedAt: now,
      })
    ),
    db.createBudgetItem({
      id: "cbi_1",
      eventId: seedCorporateEvent.id,
      category: "Venue & Production",
      label: "The Glasshouse Rental",
      lowEstimate: 22000,
      likelyEstimate: 25000,
      highEstimate: 28000,
      quotedAmount: 24500,
      committedAmount: 24500,
      actualAmount: 10000,
      currency: "USD",
      status: "committed",
      isEstimate: false,
      createdAt: now,
      updatedAt: now,
    }),
    db.recordUsage({
      id: "usg_1",
      workspaceId: "ws_personal",
      feature: "plan_generate",
      quantity: 1,
      providerModel: "workers-ai/@cf/meta/llama-3.3-70b-instruct",
      estimatedCost: 0.004,
      requestId: "req_demo_01",
      createdAt: now,
    }),
    db.recordUsage({
      id: "usg_2",
      workspaceId: "ws_agency",
      feature: "plan_generate",
      quantity: 1,
      providerModel: "groq/llama-3.3-70b-versatile",
      estimatedCost: 0.005,
      requestId: "req_demo_02",
      createdAt: now,
    }),
    db.logActivity({
      id: "act_1",
      workspaceId: "ws_personal",
      eventId: seedWeddingEvent.id,
      actorId: "usr_souvik",
      actorName: "Souvik Chakraborty",
      action: "event.created",
      entityType: "event",
      entityId: seedWeddingEvent.id,
      createdAt: now,
    }),
  ]);
}
