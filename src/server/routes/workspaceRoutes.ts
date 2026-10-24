import { Hono } from "hono";
import { db } from "../db/database.ts";
import { getWorkspaceEntitlements, canCreateEvent } from "../services/billing.ts";

export const workspaceRouter = new Hono<{ Variables: { userId: string } }>();

workspaceRouter.get("/api/me", async (c) => {
  const userId = c.get("userId");
  const user = await db.getUser(userId);
  if (!user) return c.json({ error: "User not found" }, 404);
  return c.json({ user });
});

workspaceRouter.get("/api/workspaces", async (c) => {
  const userId = c.get("userId");
  const workspaces = await db.listWorkspacesForUser(userId);
  return c.json({ workspaces });
});

workspaceRouter.post("/api/workspaces", async (c) => {
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

workspaceRouter.get("/api/workspaces/:workspaceId/events", async (c) => {
  const userId = c.get("userId");
  const workspaceId = c.req.param("workspaceId");

  const member = await db.getWorkspaceMember(workspaceId, userId);
  if (!member) return c.json({ error: "Access denied to workspace" }, 403);

  const events = await db.listEvents(workspaceId);
  return c.json({ events });
});

workspaceRouter.post("/api/workspaces/:workspaceId/events", async (c) => {
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
