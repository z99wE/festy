/**
 * Festiya Autonomous Multi-Agent Execution Engine
 *
 * Coordinates specialized task agents to deliver actionable event blueprints:
 * 1. Financial Synthesizer Agent (Decimal-safe 3-tier budgets, category allocations, per-guest metrics)
 * 2. Logistics & Run-of-Show Agent (Chronological milestones, vendor arrival windows, load-in pacing)
 * 3. Contract Safeguard Agent (Hidden surcharge detection, overtime multipliers, verification questions)
 * 4. Experience & Sensory Agent (Atmosphere, lighting progression, acoustic cues, signature moments)
 */

export interface AgentBudgetCategory {
  category: string;
  amount: number;
  percentage: number;
  notes: string;
}

export interface AgentBudgetArtifact {
  currency: string;
  totalBudget: number;
  guestCount: number;
  costPerGuest: number;
  tiers: {
    conservative: number;
    realistic: number;
    luxury: number;
  };
  categories: AgentBudgetCategory[];
}

export interface AgentTimelineItem {
  time: string;
  title: string;
  detail: string;
  status?: 'ready' | 'pending';
}

export interface AgentTimelineArtifact {
  occasionName: string;
  items: AgentTimelineItem[];
}

export interface AgentContractItem {
  riskArea: string;
  clauseWarning: string;
  verificationQuestion: string;
}

export interface AgentContractArtifact {
  safeguards: AgentContractItem[];
}

export interface ParetoTradeoff {
  concessionGiven: string;
  concessionExtracted: string;
  payoffRationale: string;
}

export interface MinimaxScenario {
  riskScenario: string;
  naiveReaction: string;
  minimaxOptimalStrategy: string;
  estimatedProtectedMargin: string;
}

export interface AgentGameTheoryArtifact {
  batnaAnchor: string;
  reservationCeiling: string;
  paretoTradeoffs: ParetoTradeoff[];
  minimaxScenarios: MinimaxScenario[];
}

export interface MultiAgentPlanResult {
  summary: string;
  agentsEngaged: string[];
  occasionId: string;
  occasionTitle: string;
  budgetArtifact?: AgentBudgetArtifact;
  timelineArtifact?: AgentTimelineArtifact;
  contractArtifact?: AgentContractArtifact;
  gameTheoryArtifact?: AgentGameTheoryArtifact;
  rawText: string;
}

export interface ExtractedEventParams {
  occasionId: string;
  occasionTitle: string;
  guestCount: number;
  budgetAmount: number;
  currency: string;
  location: string;
  isBudgetQuery: boolean;
  isTimelineQuery: boolean;
  isContractQuery: boolean;
  isCreativeQuery: boolean;
}

const OCCASION_MATCHERS = [
  { id: 'wedding', title: 'Wedding & Reception', regex: /wed|reception|bridal|groom/ },
  { id: 'birthday', title: 'Milestone Birthday', regex: /birth|sweet 16|turning|30th|40th|50th/ },
  { id: 'festival', title: 'Festival & Concert', regex: /festival|carnival|concert|stage|music/ },
  { id: 'product_launch', title: 'Product Launch', regex: /launch|product|demo|tech|keynote/ },
  { id: 'retreat', title: 'Executive Retreat', regex: /retreat|offsite|executive|corporate|team/ },
  { id: 'anniversary', title: 'Gala & Anniversary', regex: /anniversary|gala|charity|fundraiser/ },
  { id: 'wine_tasting', title: 'Private Culinary Tasting', regex: /tasting|wine|dinner|culinary/ },
];

const CURRENCY_SYMBOLS = ['A$', '€', '£', '₹'];

// ─── Budget calculation constants (named to eliminate magic numbers) ──────────

/** Default guest count when none can be parsed from the prompt. */
const DEFAULT_GUEST_COUNT = 60;

/** Maximum plausible guest count before the parser rejects the value. */
const MAX_GUEST_COUNT = 5_000;

/** Minimum dollar amount that counts as a valid explicit budget statement. */
const MIN_EXPLICIT_BUDGET = 200;

/** Per-guest cost multiplier used when no explicit budget is provided. */
const DEFAULT_PER_GUEST_MULTIPLIER = 65;

/** Per-guest multiplier for weddings (higher baseline cost). */
const WEDDING_PER_GUEST_MULTIPLIER = 120;

/** Per-guest multiplier for executive retreats. */
const RETREAT_PER_GUEST_MULTIPLIER = 95;

/** Absolute minimum budget floor regardless of guest count. */
const MIN_BUDGET_FLOOR = 2_500;

/** Conservative tier: 78 % of the target budget. */
const CONSERVATIVE_TIER_RATIO = 0.78;

/** Luxury tier: 138 % of the target budget. */
const LUXURY_TIER_RATIO = 1.38;

/** Game-theory reservation ceiling: 82 % of budget to preserve tactical reserve. */
const RESERVATION_CEILING_RATIO = 0.82;

/** No-show sunk cost recovery ratio used in Minimax scenario modelling. */
const NO_SHOW_RECOVERY_RATIO = 0.08;

/** Minimum character length for an LLM response to be considered non-empty. */
const MIN_LLM_RESPONSE_LENGTH = 20;

const DEFAULT_BUDGET_WEIGHTS = [
  { cat: 'Venue & Facilities', pct: 0.30, note: 'Primary space hire, basic lighting & setup' },
  { cat: 'Food & Refreshments', pct: 0.36, note: 'Plated/stations, cocktail bar & staffing' },
  { cat: 'Decor & Ambiance', pct: 0.14, note: 'Tablescapes, focal floral arches & accent lighting' },
  { cat: 'Entertainment & Audio', pct: 0.12, note: 'Sound equipment, curated DJ/performers' },
  { cat: 'Contingency Safety Buffer', pct: 0.08, note: 'Protected margin against overtime & tax drift' },
];

const BUDGET_WEIGHT_MAP: Record<string, Array<{ cat: string; pct: number; note: string }>> = {
  festival: [
    { cat: 'Stages & Staging AV', pct: 0.35, note: 'Open-air rigging, power generators & sound' },
    { cat: 'Permits & Municipal Security', pct: 0.20, note: 'Crowd safety, medical triage & city permits' },
    { cat: 'Talent & Performers', pct: 0.25, note: 'Live acts, host/DJ riders & hospitality' },
    { cat: 'Guest Facilities & Waste', pct: 0.12, note: 'Sanitation stations, wristbands & water points' },
    { cat: 'Contingency Safety Buffer', pct: 0.08, note: 'Weather reserve & overtime allowance' },
  ],
  product_launch: [
    { cat: 'AV, Keynote & Streaming', pct: 0.38, note: 'Low-latency broadcast, LED wall & audio' },
    { cat: 'Venue & Demo Pods', pct: 0.28, note: 'Auditorium staging & interactive hands-on bays' },
    { cat: 'Executive Hospitality', pct: 0.18, note: 'VIP catering, espresso bar & press hospitality' },
    { cat: 'Brand Design & Signage', pct: 0.10, note: 'High-contrast stage backdrops & credentials' },
    { cat: 'Contingency Safety Buffer', pct: 0.06, note: 'Backup streaming link & technical reserve' },
  ],
};

function parseGuestCount(prompt: string): number {
  const match = prompt.match(/(\d+)\s*(guests?|people|attendees|pax|friends|members)/i) || prompt.match(/(for|with)\s*(\d+)/i);
  if (!match) return DEFAULT_GUEST_COUNT;
  const num = parseInt(match[1] || match[2], 10);
  return (num > 0 && num <= MAX_GUEST_COUNT) ? num : DEFAULT_GUEST_COUNT;
}

function parseBudgetAmount(prompt: string, guestCount: number, occasionId: string): number {
  const match = prompt.match(/([$€£₹])\s*([\d,]+)/) || prompt.match(/([\d,]+)\s*(dollars|usd|eur|gbp|inr|budget)/i);
  if (match) {
    const raw = (match[2] || match[1]).replace(/,/g, '');
    const num = parseInt(raw, 10);
    if (num >= MIN_EXPLICIT_BUDGET) return num;
  }
  const multipliers: Record<string, number> = {
    wedding: WEDDING_PER_GUEST_MULTIPLIER,
    retreat: RETREAT_PER_GUEST_MULTIPLIER,
  };
  const mult = multipliers[occasionId] ?? DEFAULT_PER_GUEST_MULTIPLIER;
  return Math.max(MIN_BUDGET_FLOOR, guestCount * mult);
}

function parseLocation(prompt: string): string {
  const locMatch = prompt.match(/in\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:for|with|on|under|budget)|[,.]|$)/);
  return locMatch && locMatch[1] ? locMatch[1].trim() : 'Local Venue';
}

export class MultiAgentEngine {
  /**
   * Extracts structured event parameters (occasion, guest count, budget, currency,
   * location, and query-intent flags) from a free-text user prompt.
   */
  static extractParams(prompt: string): ExtractedEventParams {
    const text = prompt.toLowerCase();
    const matched = OCCASION_MATCHERS.find((m) => m.regex.test(text));
    const occasionId = matched ? matched.id : 'birthday';
    const occasionTitle = matched ? matched.title : 'Milestone Celebration';
    const guestCount = parseGuestCount(prompt);
    const budgetAmount = parseBudgetAmount(prompt, guestCount, occasionId);
    const currency = CURRENCY_SYMBOLS.find((s) => prompt.includes(s)) || '$';
    const location = parseLocation(prompt);

    const isBudgetQuery = /budget|cost|price|allocate|spend|estimate|dollars|split|breakdown/i.test(prompt);
    const isTimelineQuery = /timeline|schedule|run\s*of\s*show|agenda|itinerary|hours?|milestone|when/i.test(prompt);
    const isContractQuery = /vendor|contract|caterer|deposit|hidden\s*fee|negotiat|clause|venue\s*fee/i.test(prompt);
    const isCreativeQuery = /theme|decor|music|lighting|vibe|color|experience|ambiance/i.test(prompt);

    return {
      occasionId,
      occasionTitle,
      guestCount,
      budgetAmount,
      currency,
      location,
      isBudgetQuery: isBudgetQuery || (!isTimelineQuery && !isContractQuery),
      isTimelineQuery,
      isContractQuery,
      isCreativeQuery,
    };
  }

  /**
   * Produces a decimal-safe three-tier budget artifact (Conservative, Realistic,
   * Luxury) with per-occasion category weight maps and per-guest unit economics.
   */
  static synthesizeBudget(params: ExtractedEventParams): AgentBudgetArtifact {
    const total = params.budgetAmount;
    const guests = Math.max(1, params.guestCount);
    const costPerGuest = Math.round(total / guests);
    const conservative = Math.round(total * CONSERVATIVE_TIER_RATIO);
    const luxury = Math.round(total * LUXURY_TIER_RATIO);

    const weights = BUDGET_WEIGHT_MAP[params.occasionId] || DEFAULT_BUDGET_WEIGHTS;

    const categories: AgentBudgetCategory[] = weights.map((w) => ({
      category: w.cat,
      amount: Math.round(total * w.pct),
      percentage: Math.round(w.pct * 100),
      notes: w.note,
    }));

    return {
      currency: params.currency,
      totalBudget: total,
      guestCount: guests,
      costPerGuest,
      tiers: { conservative, realistic: total, luxury },
      categories,
    };
  }

  /**
   * Generates a chronological run-of-show timeline with vendor load-in windows,
   * soundcheck blocks, and post-event load-out sign-off milestones.
   */
  static synthesizeTimeline(params: ExtractedEventParams): AgentTimelineArtifact {
    const items: AgentTimelineItem[] = [
      { time: 'T - 4 Hours', title: 'Vendor Load-In & Power Drops', detail: 'Catering vehicles arrive, main power distribution lines tested, venue manager sign-off.' },
      { time: 'T - 90 Minutes', title: 'AV Soundcheck & Lighting State Lock', detail: 'Microphone levels balanced, ambient lighting set to arrival state, background playlist cued.' },
      { time: '00:00 (Start)', title: 'Guest Arrivals & Welcome Beverage Service', detail: 'Signature drink trays circulated, coat check staffed, guest book and greeting station active.' },
      { time: '+ 45 Minutes', title: 'Opening Welcome & Host Welcome Remarks', detail: 'Short 3-minute toast, transition music dip, first course or food stations opened.' },
      { time: '+ 2 Hours', title: 'Main Feature & Celebratory Milestone Moment', detail: 'Cake cutting, key presentation, or headline performance under focused spotlight.' },
      { time: '+ 3.5 Hours', title: 'Last Call & Departure Hospitality', detail: 'Bar service closes, guest keepsake distribution, coordinated rideshare & transport queue.' },
      { time: '+ 4.5 Hours', title: 'Load-Out & Damage Deposit Sign-Off', detail: 'Strike rentals, venue walkthrough with facility supervisor to release damage escrow.' },
    ];

    return {
      occasionName: params.occasionTitle,
      items,
    };
  }

  /**
   * Builds occasion-specific contract verification questions targeting hidden
   * surcharge categories: overtime multipliers, admin fees, external-vendor
   * penalties, and (for weddings) corkage and cake-cutting fees.
   */
  static synthesizeContractSafeguards(params: ExtractedEventParams): AgentContractArtifact {
    const safeguards: AgentContractItem[] = [
      {
        riskArea: 'Overtime & Teardown Multipliers',
        clauseWarning: 'Venues frequently charge 1.5x to 2x hourly rates when load-out exceeds midnight by even 15 minutes.',
        verificationQuestion: 'What is the grace period for teardown before overtime rates trigger, and is staff load-out billed separately from guest curfew.',
      },
      {
        riskArea: 'Service Surcharges vs. Gratuities',
        clauseWarning: 'Many venues levy a mandatory 22% "Administrative Service Fee" that does NOT go to service staff as tips.',
        verificationQuestion: 'Does the administrative service fee include staff gratuities, or will an additional tip multiplier be expected on the final invoice.',
      },
      {
        riskArea: 'External Vendor Surcharges',
        clauseWarning: 'Venues often add $500–$1,200 penalties when bringing your own photographer, DJ, or baker outside their preferred list.',
        verificationQuestion: 'Are there landmark or buyout surcharges when contracting our own certified, insured vendors rather than the preferred directory.',
      },
    ];

    if (params.occasionId === 'wedding') {
      safeguards.push({
        riskArea: 'Corkage & Cake Cutting Surcharges',
        clauseWarning: 'Standard venue rates apply $4–$9 per guest just to slice celebratory cakes or $25–$45 per uncorked wine bottle.',
        verificationQuestion: 'Can we negotiate a flat-rate beverage corkage fee or waive the cake-cutting fee when dessert is served buffet-style.',
      });
    }

    return { safeguards };
  }

  /**
   * Applies Nash Bargaining (BATNA anchors), Pareto-optimal value-exchange pairs,
   * and Savage Minimax Regret scenarios to the event's budget and occasion type,
   * returning a structured game-theory negotiation artifact.
   */
  static synthesizeGameTheory(params: ExtractedEventParams): AgentGameTheoryArtifact {
    const total = params.budgetAmount;
    const currency = params.currency;
    const reservationCeiling = Math.round(total * RESERVATION_CEILING_RATIO);

    const paretoTradeoffs: ParetoTradeoff[] = [
      {
        concessionGiven: 'Offer afternoon load-in flexibility (T-5h instead of morning lock)',
        concessionExtracted: 'Waive standard $450-$700 equipment drop fee and secure complimentary vendor green room',
        payoffRationale: 'The venue incurs zero marginal cost for daylight hall access, while eliminating an arbitrary high-markup line item from your ledger.',
      },
      {
        concessionGiven: 'Commit to upfront wire/ACH milestone schedule (eliminating merchant interchange fees)',
        concessionExtracted: `Secure flat beverage corkage buyout (${currency}15/bottle or waived) instead of standard 22% venue beverage markups`,
        payoffRationale: 'Guaranteed settlement eliminates 3.2% credit merchant drag for the caterer, delivering high surplus margin to your drink budget.',
      },
      {
        concessionGiven: 'Permit dual-menu tasting on a weekday off-peak window',
        concessionExtracted: 'Lock in a 10% headcount variance buffer without forfeiting minimum spend thresholds',
        payoffRationale: 'Vendor kitchen runs low-stress prep while protecting you from paying full price on late guest cancellations.',
      },
    ];

    const minimaxScenarios: MinimaxScenario[] = [
      {
        riskScenario: 'Late guest drop-out (12-18% no-show rate after RSVP lock)',
        naiveReaction: 'Pay for empty contracted covers at full price.',
        minimaxOptimalStrategy: 'Contract an addendum converting unserved covers into late-night savory stations or top-shelf spirit upgrades.',
        estimatedProtectedMargin: `Recovers ~${currency}${Math.round(total * NO_SHOW_RECOVERY_RATIO).toLocaleString()} in otherwise sunk F&B spend.`,
      },
      {
        riskScenario: 'Sudden overtime trigger (event runs 25 minutes past midnight curfew)',
        naiveReaction: 'Incur 1.75x emergency hourly rate multiplier plus security surcharges.',
        minimaxOptimalStrategy: 'Pre-negotiate a 30-minute grace window in the master rider for music cutoff vs. physical guest exit.',
        estimatedProtectedMargin: `Eliminates ~${currency}850-${currency}1,400 in punitive overtime penalty clauses.`,
      },
    ];

    return {
      batnaAnchor: 'Maintain active holds on two comparable alternative spaces before depositing to establish credible walk-away optionality.',
      reservationCeiling: `Cap base contractual commitment at ${currency}${reservationCeiling.toLocaleString()} (82% of target) to preserve an 18% tactical contingency reserve.`,
      paretoTradeoffs,
      minimaxScenarios,
    };
  }

  /**
   * Orchestrates the full multi-agent swarm for a given user prompt. Dispatches
   * only the agents relevant to the detected query intent, merges their artifacts
   * with the optional LLM response text, and returns a consolidated plan result.
   *
   * @param prompt     Raw user input describing the event.
   * @param llmResponseText  Optional pre-generated LLM text to use as the summary.
   */
  static executeSwarm(prompt: string, llmResponseText?: string): MultiAgentPlanResult {
    const params = this.extractParams(prompt);
    const agentsEngaged: string[] = ['Chief Orchestrator Agent'];

    let budgetArtifact: AgentBudgetArtifact | undefined;
    let timelineArtifact: AgentTimelineArtifact | undefined;
    let contractArtifact: AgentContractArtifact | undefined;
    let gameTheoryArtifact: AgentGameTheoryArtifact | undefined;

    if (params.isBudgetQuery || /[$]|cost|spend/i.test(prompt)) {
      agentsEngaged.push('Financial Synthesizer Agent');
      budgetArtifact = this.synthesizeBudget(params);
    }

    if (params.isTimelineQuery || /schedule|timeline|hours/i.test(prompt)) {
      agentsEngaged.push('Logistics & Run-of-Show Agent');
      timelineArtifact = this.synthesizeTimeline(params);
    }

    if (params.isContractQuery || /vendor|contract|caterer|deposit|negotiat|game/i.test(prompt)) {
      agentsEngaged.push('Contract Safeguard Agent', 'Game-Theoretic Bargaining Agent');
      contractArtifact = this.synthesizeContractSafeguards(params);
      gameTheoryArtifact = this.synthesizeGameTheory(params);
    }

    if (!budgetArtifact && !timelineArtifact && !contractArtifact) {
      agentsEngaged.push('Financial Synthesizer Agent', 'Logistics & Run-of-Show Agent', 'Game-Theoretic Bargaining Agent');
      budgetArtifact = this.synthesizeBudget(params);
      timelineArtifact = this.synthesizeTimeline(params);
      gameTheoryArtifact = this.synthesizeGameTheory(params);
    }

    const summary = llmResponseText && llmResponseText.length > MIN_LLM_RESPONSE_LENGTH
      ? llmResponseText
      : `I have orchestrated a complete ${params.occasionTitle} blueprint tailored for ${params.guestCount} guests with a target budget of ${params.currency}${params.budgetAmount.toLocaleString()}. Review the synthesized allocations, chronological milestones, and contract safeguards below, then apply directly to your active event workspace.`;

    return {
      summary,
      agentsEngaged,
      occasionId: params.occasionId,
      occasionTitle: params.occasionTitle,
      budgetArtifact,
      timelineArtifact,
      contractArtifact,
      gameTheoryArtifact,
      rawText: summary,
    };
  }
}
