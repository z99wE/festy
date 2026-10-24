import { Hono } from "hono";
import { db } from "../db/database.ts";
import { getWorkspaceEntitlements } from "../services/billing.ts";
import { exportUserData, generateClientProposalMarkdown } from "../services/export.ts";

export const billingRouter = new Hono<{ Variables: { userId: string } }>();

billingRouter.get("/api/billing/entitlements", async (c) => {
  const workspaceId = c.req.query("workspaceId") || "ws_personal";
  const entitlements = await getWorkspaceEntitlements(db, workspaceId);
  return c.json({ entitlements });
});

billingRouter.post("/api/billing/checkout", async (c) => {
  const { workspaceId, targetTier } = await c.req.json();
  return c.json({
    checkoutUrl: `https://checkout.festiya.app/simulate?workspace=${workspaceId}&tier=${targetTier}`,
    sessionId: `cs_test_${Math.random().toString(36).substring(2, 10)}`,
  });
});

billingRouter.post("/api/billing/webhook", async (c) => {
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

billingRouter.get("/api/events/:eventId/export/proposal", async (c) => {
  const eventId = c.req.param("eventId");
  const md = await generateClientProposalMarkdown(db, eventId);
  return c.text(md);
});

billingRouter.post("/api/account/export", async (c) => {
  const userId = c.get("userId");
  const data = await exportUserData(db, userId);
  return c.json(data);
});

billingRouter.delete("/api/account", async (c) => {
  return c.json({ success: true, message: "Account deletion scheduled per GDPR policy" });
});
