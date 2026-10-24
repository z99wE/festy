import { describe, it, expect } from "vitest";
import { EventPlanSchema } from "../src/types/index.ts";
import { generateDeterministicPlan } from "../src/server/ai/fallback-generator.ts";

describe("AI Plan Schema & Generator Validation", () => {
  it("validates compliant plan according to EventPlanSchema (v1)", () => {
    const rawPlan = {
      schemaVersion: "1",
      summary: "An elegant rooftop celebration for 60 guests.",
      assumptions: ["Outdoor terrace reserved", "Weather clear"],
      openQuestions: ["Need valet parking?"],
      budget: {
        currency: "USD",
        target: 12000,
        items: [
          {
            id: "b1",
            category: "Venue",
            label: "Terrace rental",
            lowEstimate: 3000,
            likelyEstimate: 3500,
            highEstimate: 4000,
            rationale: "4 hours rental",
            isEstimate: true,
          },
        ],
      },
      tasks: [
        {
          id: "t1",
          title: "Book terrace",
          priority: "critical",
          dueOffsetDays: 14,
          dependsOn: [],
        },
      ],
      vendorCategories: [
        {
          category: "Catering",
          selectionCriteria: ["Finger food specialist"],
          questionsToAsk: ["Do you supply napkins?"],
        },
      ],
      ideas: [
        {
          title: "Saxophone sunset set",
          description: "Live acoustic sax performance during sunset hour",
          category: "Music",
          estimatedCostImpact: "medium",
        },
      ],
      risks: [
        {
          risk: "Sudden rain",
          mitigation: "Deploy retractable glass awning",
        },
      ],
      runOfShow: [
        {
          time: "17:00",
          activity: "Guest arrival",
          owner: "Host",
        },
      ],
    };

    const parsed = EventPlanSchema.safeParse(rawPlan);
    expect(parsed.success).toBe(true);
  });

  it("deterministic fallback generator produces 100% valid schema output for wedding", () => {
    const plan = generateDeterministicPlan({
      name: "Heritage Wedding",
      occasion: "Traditional Palace Wedding",
      category: "wedding",
      guestCount: 150,
      targetBudget: 3500000,
      currency: "INR",
      locationAddress: "Udaipur, Rajasthan",
      style: "Grand royal heritage with marigold and warm candlelight",
      constraints: "Vegetarian only",
    });

    const parsed = EventPlanSchema.safeParse(plan);
    expect(parsed.success).toBe(true);
    expect(plan.schemaVersion).toBe("1");
    expect(plan.budget.items.length).toBeGreaterThan(0);
    expect(plan.tasks.length).toBeGreaterThan(0);
    expect(plan.vendorCategories.length).toBeGreaterThan(0);
    expect(plan.ideas.length).toBeGreaterThan(0);
    expect(plan.risks.length).toBeGreaterThan(0);
  });

  it("rejects invalid plans with missing required keys", () => {
    const invalid = {
      schemaVersion: "2", // invalid version
      summary: "Missing fields",
    };
    const parsed = EventPlanSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});
