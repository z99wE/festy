import { Hono } from "hono";
import { db } from "../db/database.ts";

export const itemRouter = new Hono<{ Variables: { userId: string } }>();

// Tasks
itemRouter.get("/api/events/:eventId/tasks", async (c) => {
  const eventId = c.req.param("eventId");
  const tasks = await db.listTasks(eventId);
  return c.json({ tasks });
});

itemRouter.post("/api/events/:eventId/tasks", async (c) => {
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

itemRouter.patch("/api/events/:eventId/tasks/:taskId", async (c) => {
  const taskId = c.req.param("taskId");
  const body = await c.req.json();
  const updated = await db.updateTask(taskId, body);
  return c.json({ task: updated });
});

itemRouter.delete("/api/events/:eventId/tasks/:taskId", async (c) => {
  const taskId = c.req.param("taskId");
  await db.deleteTask(taskId);
  return c.json({ success: true });
});

// Budget Items
itemRouter.get("/api/events/:eventId/budget-items", async (c) => {
  const eventId = c.req.param("eventId");
  const items = await db.listBudgetItems(eventId);
  return c.json({ items });
});

itemRouter.post("/api/events/:eventId/budget-items", async (c) => {
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

itemRouter.patch("/api/events/:eventId/budget-items/:itemId", async (c) => {
  const itemId = c.req.param("itemId");
  const body = await c.req.json();
  const updated = await db.updateBudgetItem(itemId, body);
  return c.json({ item: updated });
});

itemRouter.delete("/api/events/:eventId/budget-items/:itemId", async (c) => {
  const itemId = c.req.param("itemId");
  await db.deleteBudgetItem(itemId);
  return c.json({ success: true });
});

// Vendors
itemRouter.get("/api/events/:eventId/vendors", async (c) => {
  const eventId = c.req.param("eventId");
  const vendors = await db.listVendors(eventId);
  return c.json({ vendors });
});

itemRouter.post("/api/events/:eventId/vendors", async (c) => {
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

itemRouter.patch("/api/events/:eventId/vendors/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  const body = await c.req.json();
  const updated = await db.updateVendor(vendorId, body);
  return c.json({ vendor: updated });
});

itemRouter.delete("/api/events/:eventId/vendors/:vendorId", async (c) => {
  const vendorId = c.req.param("vendorId");
  await db.deleteVendor(vendorId);
  return c.json({ success: true });
});

// Ideas, Risks, Run of Show
itemRouter.get("/api/events/:eventId/ideas", async (c) => {
  const eventId = c.req.param("eventId");
  const ideas = await db.listIdeas(eventId);
  return c.json({ ideas });
});

itemRouter.patch("/api/events/:eventId/ideas/:ideaId", async (c) => {
  const ideaId = c.req.param("ideaId");
  const body = await c.req.json();
  const updated = await db.updateIdea(ideaId, body);
  return c.json({ idea: updated });
});

itemRouter.get("/api/events/:eventId/risks", async (c) => {
  const eventId = c.req.param("eventId");
  const risks = await db.listRisks(eventId);
  return c.json({ risks });
});

itemRouter.get("/api/events/:eventId/run-of-show", async (c) => {
  const eventId = c.req.param("eventId");
  const items = await db.listRunOfShow(eventId);
  return c.json({ items });
});

itemRouter.post("/api/events/:eventId/run-of-show", async (c) => {
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

// Shares
itemRouter.post("/api/events/:eventId/share", async (c) => {
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

itemRouter.get("/api/shares/:shareToken", async (c) => {
  const token = c.req.param("shareToken");
  const share = await db.getShareByToken(token);
  if (!share) return c.json({ error: "Share link not found or expired" }, 404);

  await db.incrementShareViews(token);
  const event = await db.getEvent(share.eventId);
  if (!event) return c.json({ error: "Event no longer exists" }, 404);

  const [plan, budgetItems, tasks, vendors, ideas, runOfShow] = await Promise.all([
    db.getLatestPlan(share.eventId),
    share.allowedSections.includes("budget") ? db.listBudgetItems(share.eventId) : Promise.resolve([]),
    share.allowedSections.includes("timeline") ? db.listTasks(share.eventId) : Promise.resolve([]),
    share.allowedSections.includes("vendors") ? db.listVendors(share.eventId) : Promise.resolve([]),
    share.allowedSections.includes("ideas") ? db.listIdeas(share.eventId) : Promise.resolve([]),
    share.allowedSections.includes("runOfShow") ? db.listRunOfShow(share.eventId) : Promise.resolve([]),
  ]);

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

itemRouter.delete("/api/shares/:shareId", async (c) => {
  const shareId = c.req.param("shareId");
  await db.revokeShare(shareId);
  return c.json({ success: true });
});
