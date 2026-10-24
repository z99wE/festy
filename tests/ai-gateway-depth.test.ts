import { describe, it, expect } from "vitest";
import { aiGateway } from "../src/server/ai/gateway.ts";
import { Event } from "../src/types/index.ts";

describe("Festiya AI Gateway & Plan Synthesis Deep Unit Tests", () => {
  const sampleEvent: Event = {
    id: "evt_deep_test_1",
    workspaceId: "ws_agency",
    name: "NeoPOP Tech Summit & Design Keynote",
    occasion: "Product Keynote",
    category: "work_event",
    dateMode: "decided",
    startDate: "2026-12-15",
    timezone: "UTC",
    locationMode: "in_person",
    locationAddress: "San Francisco Palace of Fine Arts",
    guestCount: 650,
    targetBudget: 180000,
    currency: "USD",
    createdBy: "usr_souvik",
    status: "planning",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("synthesizes complete structured event plan with all required domains", async () => {
    const result = await aiGateway.generatePlan(sampleEvent);
    expect(result.plan).toBeDefined();
    expect(result.providerUsed).toBeDefined();
    expect(typeof result.isFallback).toBe("boolean");

    const { plan } = result;
    expect(plan.schemaVersion).toBe("1");
    expect(plan.summary).toBeDefined();
    expect(plan.summary.length).toBeGreaterThan(20);

    // Budget Domain
    expect(plan.budget).toBeDefined();
    expect(plan.budget.currency).toBe("USD");
    expect(Array.isArray(plan.budget.items)).toBe(true);
    expect(plan.budget.items.length).toBeGreaterThan(0);

    const firstBudgetItem = plan.budget.items[0];
    expect(firstBudgetItem.category).toBeDefined();
    expect(firstBudgetItem.isEstimate).toBe(true);

    // Tasks Domain
    expect(Array.isArray(plan.tasks)).toBe(true);
    expect(plan.tasks.length).toBeGreaterThan(0);
    expect(["low", "medium", "high", "critical"]).toContain(plan.tasks[0].priority);

    // Vendor Categories
    expect(Array.isArray(plan.vendorCategories)).toBe(true);
    expect(plan.vendorCategories.length).toBeGreaterThan(0);
    expect(plan.vendorCategories[0].selectionCriteria.length).toBeGreaterThan(0);
    expect(plan.vendorCategories[0].questionsToAsk.length).toBeGreaterThan(0);

    // Ideas & Risks
    expect(Array.isArray(plan.ideas)).toBe(true);
    expect(Array.isArray(plan.risks)).toBe(true);
    expect(plan.risks.length).toBeGreaterThan(0);
  });

  it("executes askAssistant with contextual awareness and suggestion chips", async () => {
    const { plan } = await aiGateway.generatePlan(sampleEvent);
    const result = await aiGateway.askAssistant(
      sampleEvent,
      plan,
      "What is our strategy for AV recording and keynote live streaming?",
      "timeline"
    );

    expect(result.answer).toBeDefined();
    expect(result.answer.length).toBeGreaterThan(20);
    expect(Array.isArray(result.suggestions)).toBe(true);
    expect(result.providerUsed).toBeDefined();
  });

  it("handles plan revisions and emits updated plan state", async () => {
    const { plan } = await aiGateway.generatePlan(sampleEvent);
    const revisedResult = await aiGateway.revisePlan(
      plan,
      "Increase AV budget by 15% and add an overflow livestream lounge in the foyer"
    );

    expect(revisedResult.plan).toBeDefined();
    expect(revisedResult.plan.schemaVersion).toBe("1");
    expect(revisedResult.plan.summary).toBeDefined();
    expect(revisedResult.plan.budget.items.length).toBeGreaterThan(0);
  });
});
