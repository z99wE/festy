import { describe, it, expect, beforeEach } from "vitest";
import { app } from "../src/server/routes/api.ts";
import { db } from "../src/server/db/database.ts";
import { seedDemoData } from "../src/server/db/seed.ts";

describe("Festiya API & Tenant Boundary Integration Tests", () => {
  beforeEach(async () => {
    await seedDemoData(db);
  });

  it("GET /api/health returns healthy status", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
    expect(body.service).toBe("festiya-api");
  });

  it("GET /api/workspaces returns authorized workspaces for user", async () => {
    const res = await app.request("/api/workspaces", {
      headers: { "x-user-id": "usr_souvik" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.workspaces.length).toBeGreaterThanOrEqual(2);
  });

  it("enforces tenant boundary: denies event access to non-member", async () => {
    const res = await app.request("/api/workspaces/ws_agency/events", {
      headers: { "x-user-id": "usr_unauthorized_stranger" },
    });
    expect(res.status).toBe(403);
  });

  it("POST /api/events/:eventId/plan/generate generates structured plan and tasks", async () => {
    const res = await app.request("/api/events/evt_wedding_jaipur/plan/generate", {
      method: "POST",
      headers: { "x-user-id": "usr_souvik" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.plan).toBeDefined();
    expect(body.plan.schemaVersion).toBe("1");
    expect(body.plan.summary).toBeDefined();
  });

  it("GET /api/billing/entitlements returns subscription limits and current usage", async () => {
    const res = await app.request("/api/billing/entitlements?workspaceId=ws_agency", {
      headers: { "x-user-id": "usr_souvik" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.entitlements.tier).toBe("pro");
    expect(body.entitlements.canExportProposals).toBe(true);
    expect(body.entitlements.maxActiveEvents).toBe(50);
  });

  it("creates and retrieves public share links", async () => {
    const shareRes = await app.request("/api/events/evt_wedding_jaipur/share", {
      method: "POST",
      headers: {
        "x-user-id": "usr_souvik",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "client",
        allowedSections: ["summary", "budget", "timeline", "vendors"],
      }),
    });
    expect(shareRes.status).toBe(200);
    const { share } = await shareRes.json();
    expect(share.shareToken).toBeDefined();

    // Query via public endpoint
    const publicRes = await app.request(`/api/shares/${share.shareToken}`);
    expect(publicRes.status).toBe(200);
    const publicData = await publicRes.json();
    expect(publicData.event.name).toBe("Maya & Arjun's Destination Wedding");
    expect(publicData.role).toBe("client");
  });
});
