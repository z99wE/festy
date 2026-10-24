/**
 * Festiya Deterministic AI Plan Generator
 * Used as a dependable fallback when external AI providers are offline,
 * and as an instant deterministic baseline for test suites and offline development.
 * Produces 100% compliant EventPlan objects matching EventPlanSchema (schemaVersion "1").
 */

import { EventPlan, Event } from "../../types/index.ts";

export function generateDeterministicPlan(event: Partial<Event>): EventPlan {
  const occasion = event.occasion || event.name || "Celebration";
  const category = event.category || "custom";
  const guestCount = event.guestCount || 50;
  const currency = event.currency || "USD";
  const targetBudget = event.targetBudget || (guestCount * 120);
  const location = event.locationAddress || "Selected Venue";
  const style = event.style || "Warm, memorable, and effortlessly organized";
  const constraints = event.constraints || "No strict constraints specified";
  const hasDate = Boolean(event.startDate);

  // Generate budget breakdown with realistic proportions
  const venueProportion = 0.35;
  const cateringProportion = 0.30;
  const decorProportion = 0.15;
  const photoAudioProportion = 0.12;
  const bufferProportion = 0.08;

  const budgetItems = [
    {
      id: "gen_b_1",
      category: "Venue & Hospitality",
      label: `${occasion} Space & Hospitality`,
      lowEstimate: Math.round(targetBudget * (venueProportion * 0.9)),
      likelyEstimate: Math.round(targetBudget * venueProportion),
      highEstimate: Math.round(targetBudget * (venueProportion * 1.15)),
      rationale: `Includes rental hours, basic facilities, and permits for ${guestCount} guests.`,
      isEstimate: true as const,
    },
    {
      id: "gen_b_2",
      category: "Catering & Beverage",
      label: "Artisanal Food & Beverage Service",
      lowEstimate: Math.round(targetBudget * (cateringProportion * 0.9)),
      likelyEstimate: Math.round(targetBudget * cateringProportion),
      highEstimate: Math.round(targetBudget * (cateringProportion * 1.15)),
      rationale: `Covers passed appetizers, plated or buffet dining, and beverages for ${guestCount} guests.`,
      isEstimate: true as const,
    },
    {
      id: "gen_b_3",
      category: "Decor & Atmosphere",
      label: "Ambient Design & Floral Accents",
      lowEstimate: Math.round(targetBudget * (decorProportion * 0.85)),
      likelyEstimate: Math.round(targetBudget * decorProportion),
      highEstimate: Math.round(targetBudget * (decorProportion * 1.2)),
      rationale: `Tailored to "${style}" aesthetic with focal points and ambient lighting.`,
      isEstimate: true as const,
    },
    {
      id: "gen_b_4",
      category: "Photo & Sound",
      label: "Photography & Audio System",
      lowEstimate: Math.round(targetBudget * (photoAudioProportion * 0.9)),
      likelyEstimate: Math.round(targetBudget * photoAudioProportion),
      highEstimate: Math.round(targetBudget * (photoAudioProportion * 1.15)),
      rationale: "Professional event documentation and curated sound reinforcement.",
      isEstimate: true as const,
    },
    {
      id: "gen_b_5",
      category: "Contingency & Experience",
      label: "Surprise Touch & Operational Cushion",
      lowEstimate: Math.round(targetBudget * (bufferProportion * 0.8)),
      likelyEstimate: Math.round(targetBudget * bufferProportion),
      highEstimate: Math.round(targetBudget * (bufferProportion * 1.25)),
      rationale: "Unforeseen expenses, gratuities, and guest keepsake details.",
      isEstimate: true as const,
    },
  ];

  // Generate actionable tasks with chronological relative offsets
  const tasks = [
    {
      id: "gen_t_1",
      title: "Confirm venue availability and deposit policy",
      description: `Validate capacity for ${guestCount} guests, access hours, and sound policies at ${location}.`,
      priority: "critical" as const,
      dueOffsetDays: hasDate ? -60 : 7,
      dependsOn: [],
    },
    {
      id: "gen_t_2",
      title: "Curate menu options and schedule tasting",
      description: `Ensure selections accommodate dietary considerations under "${constraints}".`,
      priority: "high" as const,
      dueOffsetDays: hasDate ? -45 : 14,
      dependsOn: ["gen_t_1"],
    },
    {
      id: "gen_t_3",
      title: "Send digital save-the-dates & collect guest preferences",
      description: `Collect confirmed RSVPs, travel schedules, and accessibility needs for ${guestCount} guests.`,
      priority: "high" as const,
      dueOffsetDays: hasDate ? -35 : 21,
      dependsOn: ["gen_t_1"],
    },
    {
      id: "gen_t_4",
      title: "Finalize visual styling & rental specifications",
      description: `Align linens, table settings, and lighting with the "${style}" vision.`,
      priority: "medium" as const,
      dueOffsetDays: hasDate ? -20 : 30,
      dependsOn: ["gen_t_2"],
    },
    {
      id: "gen_t_5",
      title: "Consolidate master timeline & vendor contact sheet",
      description: "Distribute load-in times, contact numbers, and day-of cues to all partners.",
      priority: "high" as const,
      dueOffsetDays: hasDate ? -5 : 40,
      dependsOn: ["gen_t_4"],
    },
  ];

  // Specific vendor categories based on event category
  const vendorCategories = [
    {
      category: "Event Space & Facilities",
      selectionCriteria: [
        `Comfortable circulation and seated capacity for ${guestCount} attendees`,
        "Clear loading dock access and dedicated refrigeration/prep area",
        "Valid insurance coverage and noise curfew alignment",
      ],
      questionsToAsk: [
        "What is the earliest vendor load-in time without incurring overtime fees?",
        "Are table, chair, and basic audio rentals included in the base fee?",
      ],
    },
    {
      category: "Bespoke Catering & Hospitality",
      selectionCriteria: [
        "Specialization in tailored seasonal menus with dietary accommodations",
        "Adequate service staff ratio (recommended 1 server per 12-15 guests)",
      ],
      questionsToAsk: [
        "Do you provide barware, ice, and disposal as part of the package?",
        "What is the final headcount cutoff date?",
      ],
    },
    {
      category: "Creative Styling & Florals",
      selectionCriteria: [
        `Portfolio demonstrating "${style}" aesthetics`,
        "Sustainable or reusable vessel and zero-foam floral practices",
      ],
      questionsToAsk: [
        "Can centerpieces be repurposed from daytime to evening spaces?",
        "Do you handle complete breakdown and removal at closing?",
      ],
    },
  ];

  // Tailored ideas
  const ideas = [
    {
      title: "Curated Welcome Signature Sip & Note",
      description: `Greet each of the ${guestCount} arrivals with a chilled botanical tonic and a personalized greeting card.`,
      category: "Guest Experience",
      estimatedCostImpact: "low" as const,
    },
    {
      title: "Ambient Micro-Lighting Transition",
      description: "Dim ceiling lighting at twilight and introduce warm amber hurricane lamps for an intimate transformation.",
      category: "Atmosphere",
      estimatedCostImpact: "low" as const,
    },
    {
      title: "Audio Guestbook / Memory Capture Capsule",
      description: "A vintage rotary phone or audio station where guests leave uncensored voice messages and memories throughout the night.",
      category: "Entertainment",
      estimatedCostImpact: "medium" as const,
    },
  ];

  // Practical risks
  const risks = [
    {
      risk: "RSVP fluctuations causing catering minimum or space variance",
      mitigation: `Set the catering guarantee 10% below peak estimates (${Math.round(guestCount * 0.9)} guests) and confirm final count 7 days prior.`,
    },
    {
      risk: "Load-in traffic or vendor delivery bottleneck",
      mitigation: "Assign staggered 30-minute delivery windows for floral, rental, and catering arrivals.",
    },
    {
      risk: "Weather or temperature variation affecting guest comfort",
      mitigation: "Ensure shaded areas or supplemental patio heating is secured with flexible 48-hour cancellation.",
    },
  ];

  // Run of show
  const runOfShow = [
    { time: "16:00", activity: "Vendor load-in, decor installation & audio check", owner: "Lead Planner" },
    { time: "17:30", activity: "Guest arrivals, coat check & welcome aperitif", owner: "Hospitality Lead" },
    { time: "18:45", activity: `${occasion} Welcome Remarks & Key Moment`, owner: "Host" },
    { time: "19:15", activity: "Dinner or Reception Service Commences", owner: "Catering Captain" },
    { time: "21:00", activity: "Dessert, toasts & social celebration", owner: "Host & DJ" },
    { time: "22:30", activity: "Event conclusion & scheduled transport departure", owner: "Lead Planner" },
  ];

  return {
    schemaVersion: "1",
    summary: `Tailored plan for ${occasion} celebrating with ~${guestCount} guests in ${location}. Designed with a focus on "${style}" while maintaining balanced budget execution in ${currency}.`,
    assumptions: [
      `Estimated guest count is ${guestCount} with target budget of ${currency} ${targetBudget.toLocaleString()}.`,
      `Style direction: "${style}".`,
      `Constraints considered: "${constraints}".`,
      "All cost estimates are non-binding planning guides to be verified with vendor contracts.",
    ],
    openQuestions: [
      `Confirm final guest list RSVP cut-off date.`,
      `Determine whether transportation or shuttle service is required for ${guestCount} attendees.`,
      `Confirm specific music or playlist licensing preferences.`,
    ],
    budget: {
      currency,
      target: targetBudget,
      items: budgetItems,
    },
    tasks,
    vendorCategories,
    ideas,
    risks,
    runOfShow,
  };
}
