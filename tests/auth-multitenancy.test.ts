import { describe, it, expect, beforeEach } from "vitest";
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../src/server/services/auth.ts";
import { db } from "../src/server/db/database.ts";
import { enforceTenantIsolation } from "../src/server/middleware/tenantIsolation.ts";
import { Hono } from "hono";

describe("Cloudflare-Native WebCrypto Authentication", () => {
  it("generates distinct salts and validates correct PBKDF2 password hashes", async () => {
    const password = "super-secret-festiya-pass";
    const res1 = await hashPassword(password);
    const res2 = await hashPassword(password);

    // Unique salts per hashing invocation
    expect(res1.salt).not.toBe(res2.salt);
    expect(res1.hash).not.toBe(res2.hash);

    // Verify correct password
    const valid = await verifyPassword(password, res1.hash, res1.salt);
    expect(valid).toBe(true);

    // Verify incorrect password fails
    const invalid = await verifyPassword("wrong-password", res1.hash, res1.salt);
    expect(invalid).toBe(false);
  });

  it("creates and verifies HS256 JWT session tokens", async () => {
    const payload = { userId: "usr_tenant_alpha", email: "alpha@festiya.app" };
    const token = await createSessionToken(payload);

    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3);

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("usr_tenant_alpha");
    expect(decoded?.email).toBe("alpha@festiya.app");
  });

  it("rejects tampered or forged JWT tokens", async () => {
    const token = await createSessionToken({ userId: "usr_alice", email: "alice@festiya.app" });
    const parts = token.split(".");
    // Tamper with payload
    const tamperedPayload = btoa(JSON.stringify({ userId: "usr_attacker", exp: Date.now() + 100000 }));
    const forgedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const verified = await verifySessionToken(forgedToken);
    expect(verified).toBeNull();
  });
});

describe("Strict Multi-Tenant Isolation Middleware", () => {
  beforeEach(async () => {
    // Setup two isolated tenants in database
    await db.createUser({
      id: "usr_tenant_1",
      email: "tenant1@domain.com",
      name: "Tenant One",
      locale: "en-US",
      timezone: "UTC",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.createUser({
      id: "usr_tenant_2",
      email: "tenant2@domain.com",
      name: "Tenant Two",
      locale: "en-US",
      timezone: "UTC",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.createWorkspace({
      id: "ws_tenant_1",
      name: "Tenant 1 Workspace",
      type: "personal",
      ownerId: "usr_tenant_1",
      subscriptionTier: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.createWorkspace({
      id: "ws_tenant_2",
      name: "Tenant 2 Workspace",
      type: "personal",
      ownerId: "usr_tenant_2",
      subscriptionTier: "free",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await db.addWorkspaceMember({
      id: "mem_1",
      workspaceId: "ws_tenant_1",
      userId: "usr_tenant_1",
      role: "owner",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    await db.addWorkspaceMember({
      id: "mem_2",
      workspaceId: "ws_tenant_2",
      userId: "usr_tenant_2",
      role: "owner",
      status: "active",
      createdAt: new Date().toISOString(),
    });
  });

  it("permits tenant access to their own workspace and data", async () => {
    const app = new Hono<{ Variables: { userId: string } }>();
    app.use("/api/workspaces/:workspaceId/*", async (c, next) => {
      c.set("userId", "usr_tenant_1");
      await next();
    });
    app.use("/api/workspaces/*", enforceTenantIsolation);
    app.get("/api/workspaces/:workspaceId/events", (c) => c.json({ allowed: true }));

    const res = await app.request("/api/workspaces/ws_tenant_1/events");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ allowed: true });
  });

  it("strictly blocks cross-tenant contamination and returns 403 CROSS_TENANT_ACCESS_BLOCKED", async () => {
    const app = new Hono<{ Variables: { userId: string } }>();
    // User 2 trying to access User 1's workspace
    app.use("/api/workspaces/:workspaceId/*", async (c, next) => {
      c.set("userId", "usr_tenant_2");
      await next();
    });
    app.use("/api/workspaces/*", enforceTenantIsolation);
    app.get("/api/workspaces/:workspaceId/events", (c) => c.json({ allowed: true }));

    const res = await app.request("/api/workspaces/ws_tenant_1/events");
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("CROSS_TENANT_ACCESS_BLOCKED");
    expect(body.error).toContain("Access denied");
  });
});
