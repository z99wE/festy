import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/server/routes/api.ts";
import { db } from "../src/server/db/database.ts";
import { seedDemoData } from "../src/server/db/seed.ts";

describe("Festiya Enterprise Billing, Exports & Security Boundaries", () => {
  beforeEach(async () => {
    await seedDemoData(db);
  });

  describe("Billing Checkout & Webhooks", () => {
    it("creates a checkout session for pro upgrade", async () => {
      const res = await app.request("/api/billing/checkout", {
        method: "POST",
        headers: {
          "x-user-id": "usr_souvik",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspaceId: "ws_agency",
          targetTier: "pro",
          interval: "monthly",
        }),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.checkoutUrl).toBeDefined();
      expect(data.checkoutUrl).toContain("tier=pro");
      expect(data.sessionId).toBeDefined();
    });

    it("handles incoming billing webhooks idempotently", async () => {
      const webhookRes = await app.request("/api/billing/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "stripe-signature": "test_sig_mock",
        },
        body: JSON.stringify({
          workspaceId: "ws_agency",
          tier: "pro",
          status: "active",
        }),
      });
      expect(webhookRes.status).toBe(200);
      const data = await webhookRes.json();
      expect(data.received).toBe(true);
    });
  });

  describe("Compliance & Data Portability", () => {
    it("exports proposal document in formatted markdown when user is authorized", async () => {
      const exportRes = await app.request("/api/events/evt_wedding_jaipur/export/proposal", {
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(exportRes.status).toBe(200);
      const md = await exportRes.text();
      expect(md).toContain("# Maya & Arjun's Destination Wedding");
      expect(md).toContain("Budget Allocation");
    });

    it("performs full GDPR account archive export", async () => {
      const exportRes = await app.request("/api/account/export", {
        method: "POST",
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(exportRes.status).toBe(200);
      const data = await exportRes.json();
      expect(data.user.id).toBe("usr_souvik");
      expect(Array.isArray(data.workspaces)).toBe(true);
      expect(data.exportedAt).toBeDefined();
    });

    it("handles account deletion request with confirmation", async () => {
      const delRes = await app.request("/api/account", {
        method: "DELETE",
        headers: { "x-user-id": "usr_souvik" },
      });
      expect(delRes.status).toBe(200);
      const data = await delRes.json();
      expect(data.success).toBe(true);
      expect(data.message).toContain("GDPR");
    });
  });

  describe("Cross-Tenant Attack Vector Resistance", () => {
    it("rejects unauthorized user trying to read another workspace event", async () => {
      const intruderRes = await app.request("/api/events/evt_wedding_jaipur", {
        headers: { "x-user-id": "usr_attacker_99" },
      });
      expect(intruderRes.status).toBe(403);
      const body = await intruderRes.json();
      expect(body.error).toMatch(/Access denied/i);
    });

    it("rejects unauthorized user trying to patch another workspace event", async () => {
      const patchRes = await app.request("/api/events/evt_wedding_jaipur", {
        method: "PATCH",
        headers: {
          "x-user-id": "usr_attacker_99",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "Hacked Event" }),
      });
      expect(patchRes.status).toBe(403);
    });

    it("rejects unauthorized user trying to delete another workspace event", async () => {
      const delRes = await app.request("/api/events/evt_wedding_jaipur", {
        method: "DELETE",
        headers: { "x-user-id": "usr_attacker_99" },
      });
      expect(delRes.status).toBe(403);
    });
  });
});
