import { describe, it, expect, beforeEach } from "vitest";
import { MemoryDatabaseAdapter } from "../src/server/db/memoryDb.ts";
import { seedDemoData } from "../src/server/db/seed.ts";

describe("Database Storage Layer & Isolation Invariants", () => {
  let db: MemoryDatabaseAdapter;

  beforeEach(async () => {
    db = new MemoryDatabaseAdapter();
    await seedDemoData(db);
  });

  it("manages user records and email lookups", async () => {
    const user = await db.getUserByEmail("souvik@example.com");
    expect(user).toBeDefined();
    expect(user?.name).toBe("Souvik Chakraborty");

    const fetchedUser = await db.getUser("usr_souvik");
    expect(fetchedUser?.id).toBe("usr_souvik");

    const nonExistent = await db.getUserByEmail("unknown@nowhere.com");
    expect(nonExistent).toBeNull();
  });

  it("manages workspace memberships and isolates tenants", async () => {
    const member = await db.getWorkspaceMember("ws_agency", "usr_souvik");
    expect(member).toBeDefined();
    expect(member?.role).toBe("owner");

    const notMember = await db.getWorkspaceMember("ws_agency", "stranger_id");
    expect(notMember).toBeNull();

    await db.addWorkspaceMember({
      id: "mem_new_1",
      workspaceId: "ws_agency",
      userId: "stranger_id",
      role: "viewer",
      status: "active",
      createdAt: new Date().toISOString(),
    });

    const nowMember = await db.getWorkspaceMember("ws_agency", "stranger_id");
    expect(nowMember?.role).toBe("viewer");
  });

  it("handles event versioned plan state correctly", async () => {
    const plan = await db.getLatestPlan("evt_wedding_jaipur");
    expect(plan).toBeDefined();
    expect(plan?.schemaVersion).toBe("1");

    const newPlan = {
      id: "pln_revised_test",
      eventId: "evt_wedding_jaipur",
      version: (plan?.version || 1) + 1,
      schemaVersion: "1" as const,
      status: "active" as const,
      summary: "Updated revised wedding plan with cold fireworks",
      assumptions: ["Outdoor venue permitted", "Generator approved"],
      openQuestions: ["Curfew extension confirmed?"],
      content: {
        schemaVersion: "1" as const,
        summary: "Updated revised wedding plan with cold fireworks",
        assumptions: ["Outdoor venue permitted", "Generator approved"],
        openQuestions: ["Curfew extension confirmed?"],
        budget: { currency: "INR", items: [] },
        tasks: [],
        vendorCategories: [],
        ideas: [],
        risks: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.createPlan(newPlan);
    const updatedPlan = await db.getLatestPlan("evt_wedding_jaipur");
    expect(updatedPlan?.id).toBe("pln_revised_test");
    expect(updatedPlan?.version).toBe(2);

    const allPlans = await db.listPlans("evt_wedding_jaipur");
    expect(allPlans.length).toBeGreaterThanOrEqual(2);
  });

  it("supports public share token lifecycle", async () => {
    const share = await db.createShare({
      id: "shr_test_lifecycle",
      eventId: "evt_wedding_jaipur",
      shareToken: "token_abc123xyz",
      role: "client",
      allowedSections: ["summary", "timeline"],
      createdAt: new Date().toISOString(),
      isRevoked: false,
      viewCount: 0,
    });

    expect(share.shareToken).toBe("token_abc123xyz");

    const retrieved = await db.getShareByToken("token_abc123xyz");
    expect(retrieved?.id).toBe("shr_test_lifecycle");

    await db.revokeShare("shr_test_lifecycle");
    const afterRevoke = await db.getShareByToken("token_abc123xyz");
    expect(afterRevoke).toBeNull();
  });
});
