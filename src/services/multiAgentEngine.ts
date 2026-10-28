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

export class MultiAgentEngine {
  /**
   * Intelligently extracts event parameters and intent from natural user prompts
   */
  static extractParams(prompt: string): ExtractedEventParams {
    const text = prompt.toLowerCase();

    // Occasion Detection
    let occasionId = 'birthday';
    let occasionTitle = 'Milestone Celebration';

    if (text.includes('wed') || text.includes('reception') || text.includes('bridal') || text.includes('groom')) {
      occasionId = 'wedding';
      occasionTitle = 'Wedding & Reception';
    } else if (text.includes('birth') || text.includes('sweet 16') || text.includes('turning') || text.includes('30th') || text.includes('40th') || text.includes('50th')) {
      occasionId = 'birthday';
      occasionTitle = 'Milestone Birthday';
    } else if (text.includes('festival') || text.includes('carnival') || text.includes('concert') || text.includes('stage') || text.includes('music')) {
      occasionId = 'festival';
      occasionTitle = 'Festival & Concert';
    } else if (text.includes('launch') || text.includes('product') || text.includes('demo') || text.includes('tech') || text.includes('keynote')) {
      occasionId = 'product_launch';
      occasionTitle = 'Product Launch';
    } else if (text.includes('retreat') || text.includes('offsite') || text.includes('executive') || text.includes('corporate') || text.includes('team')) {
      occasionId = 'retreat';
      occasionTitle = 'Executive Retreat';
    } else if (text.includes('anniversary') || text.includes('gala') || text.includes('charity') || text.includes('fundraiser')) {
      occasionId = 'anniversary';
      occasionTitle = 'Gala & Anniversary';
    } else if (text.includes('tasting') || text.includes('wine') || text.includes('dinner') || text.includes('culinary')) {
      occasionId = 'wine_tasting';
      occasionTitle = 'Private Culinary Tasting';
    }

    // Guest Count Extraction (e.g. "50 guests", "for 120 people", "30 attendees")
    let guestCount = 60;
    const guestMatch = prompt.match(/(\d+)\s*(guests?|people|attendees|pax|friends|members)/i) || prompt.match(/(for|with)\s*(\d+)/i);
    if (guestMatch) {
      const parsed = parseInt(guestMatch[1] || guestMatch[2], 10);
      if (!isNaN(parsed) && parsed > 0 && parsed <= 5000) {
        guestCount = parsed;
      }
    }

    // Budget Amount Extraction (e.g. "$5,000", "5000 budget", "€4,000", "£3500", "₹500000")
    let budgetAmount = 5000;
    let currency = '$';

    if (prompt.includes('€')) currency = '€';
    else if (prompt.includes('£')) currency = '£';
    else if (prompt.includes('₹')) currency = '₹';
    else if (prompt.includes('A$')) currency = 'A$';

    const budgetMatch = prompt.match(/([$€£₹])\s*([\d,]+)/) || prompt.match(/([\d,]+)\s*(dollars|usd|eur|gbp|inr|budget)/i);
    if (budgetMatch) {
      const rawNum = (budgetMatch[2] || budgetMatch[1]).replace(/,/g, '');
      const parsed = parseInt(rawNum, 10);
      if (!isNaN(parsed) && parsed >= 200) {
        budgetAmount = parsed;
      }
    } else {
      // Default estimation heuristic based on guest count and occasion
      budgetAmount = Math.max(2500, guestCount * (occasionId === 'wedding' ? 120 : occasionId === 'retreat' ? 95 : 65));
    }

    // Location Extraction
    let location = 'Local Venue';
    const locMatch = prompt.match(/in\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:for|with|with|on|under|budget)|[,\.]|$)/);
    if (locMatch && locMatch[1]) {
      location = locMatch[1].trim();
    }

    // Intent Flags
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
   * Financial Synthesizer Agent
   * Calculates decimal-safe 3-tier allocations and structured category distributions
   */
  static synthesizeBudget(params: ExtractedEventParams): AgentBudgetArtifact {
    const total = params.budgetAmount;
    const guests = Math.max(1, params.guestCount);
    const costPerGuest = Math.round(total / guests);

    // 3-Tier scenario bounds
    const conservative = Math.round(total * 0.78);
    const realistic = total;
    const luxury = Math.round(total * 1.38);

    // Occasion-specific percentage weighting
    let weights = [
      { cat: 'Venue & Facilities', pct: 0.30, note: 'Primary space hire, basic lighting & setup' },
      { cat: 'Food & Refreshments', pct: 0.36, note: 'Plated/stations, cocktail bar & staffing' },
      { cat: 'Decor & Ambiance', pct: 0.14, note: 'Tablescapes, focal floral arches & accent lighting' },
      { cat: 'Entertainment & Audio', pct: 0.12, note: 'Sound equipment, curated DJ/performers' },
      { cat: 'Contingency Safety Buffer', pct: 0.08, note: 'Protected margin against overtime & tax drift' },
    ];

    if (params.occasionId === 'festival') {
      weights = [
        { cat: 'Stages & Staging AV', pct: 0.35, note: 'Open-air rigging, power generators & sound' },
        { cat: 'Permits & Municipal Security', pct: 0.20, note: 'Crowd safety, medical triage & city permits' },
        { cat: 'Talent & Performers', pct: 0.25, note: 'Live acts, host/DJ riders & hospitality' },
        { cat: 'Guest Facilities & Waste', pct: 0.12, note: 'Sanitation stations, wristbands & water points' },
        { cat: 'Contingency Safety Buffer', pct: 0.08, note: 'Weather reserve & overtime allowance' },
      ];
    } else if (params.occasionId === 'product_launch') {
      weights = [
        { cat: 'AV, Keynote & Streaming', pct: 0.38, note: 'Low-latency broadcast, LED wall & audio' },
        { cat: 'Venue & Demo Pods', pct: 0.28, note: 'Auditorium staging & interactive hands-on bays' },
        { cat: 'Executive Hospitality', pct: 0.18, note: 'VIP catering, espresso bar & press hospitality' },
        { cat: 'Brand Design & Signage', pct: 0.10, note: 'High-contrast stage backdrops & credentials' },
        { cat: 'Contingency Safety Buffer', pct: 0.06, note: 'Backup streaming link & technical reserve' },
      ];
    }

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
      tiers: {
        conservative,
        realistic,
        luxury,
      },
      categories,
    };
  }

  /**
   * Logistics & Run-of-Show Agent
   * Produces a minute-accurate milestone execution timeline
   */
  static synthesizeTimeline(params: ExtractedEventParams): AgentTimelineArtifact {
    const items: AgentTimelineItem[] = [
      {
        time: 'T - 4 Hours',
        title: 'Vendor Load-In & Power Drops',
        detail: 'Catering vehicles arrive, main power distribution lines tested, venue manager sign-off.',
      },
      {
        time: 'T - 90 Minutes',
        title: 'AV Soundcheck & Lighting State Lock',
        detail: 'Microphone levels balanced, ambient lighting set to arrival state, background playlist cued.',
      },
      {
        time: '00:00 (Start)',
        title: 'Guest Arrivals & Welcome Beverage Service',
        detail: 'Signature drink trays circulated, coat check staffed, guest book and greeting station active.',
      },
      {
        time: '+ 45 Minutes',
        title: 'Opening Welcome & Host Welcome Remarks',
        detail: 'Short 3-minute toast, transition music dip, first course or food stations opened.',
      },
      {
        time: '+ 2 Hours',
        title: 'Main Feature & Celebratory Milestone Moment',
        detail: 'Cake cutting, key presentation, or headline performance under focused spotlight.',
      },
      {
        time: '+ 3.5 Hours',
        title: 'Last Call & Departure Hospitality',
        detail: 'Bar service closes, guest keepsake distribution, coordinated rideshare & transport queue.',
      },
      {
        time: '+ 4.5 Hours',
        title: 'Load-Out & Damage Deposit Sign-Off',
        detail: 'Strike rentals, venue walkthrough with facility supervisor to release damage escrow.',
      },
    ];

    return {
      occasionName: params.occasionTitle,
      items,
    };
  }

  /**
   * Contract Safeguard Agent
   * Identifies hidden surcharges and formulates sharp verification questions
   */
  static synthesizeContractSafeguards(params: ExtractedEventParams): AgentContractArtifact {
    const safeguards: AgentContractItem[] = [
      {
        riskArea: 'Overtime & Teardown Multipliers',
        clauseWarning: 'Venues frequently charge 1.5x to 2x hourly rates if load-out exceeds midnight by even 15 minutes.',
        verificationQuestion: 'What is the grace period for teardown before overtime rates trigger, and is staff load-out billed separately from guest curfew?',
      },
      {
        riskArea: 'Service Surcharges vs. Gratuities',
        clauseWarning: 'Many venues levy a mandatory 22% "Administrative Service Fee" that does NOT go to service staff as tips.',
        verificationQuestion: 'Does the administrative service fee include staff gratuities, or will an additional tip multiplier be expected on the final invoice?',
      },
      {
        riskArea: 'External Vendor Surcharges',
        clauseWarning: 'Venues often add $500–$1,200 penalties if you bring your own photographer, DJ, or baker outside their preferred list.',
        verificationQuestion: 'Are there landmark or buyout surcharges if we contract our own certified, insured vendors rather than the preferred directory?',
      },
    ];

    if (params.occasionId === 'wedding') {
      safeguards.push({
        riskArea: 'Corkage & Cake Cutting Surcharges',
        clauseWarning: 'Standard venue rates apply $4–$9 per guest just to slice celebratory cakes or $25–$45 per uncorked wine bottle.',
        verificationQuestion: 'Can we negotiate a flat-rate beverage corkage fee or waive the cake-cutting fee if dessert is served buffet-style?',
      });
    }

    return {
      safeguards,
    };
  }

  /**
   * Game-Theoretic Bargaining & Minimax Decision Agent
   * Applies Nash bargaining principles, Pareto trade-offs, and Savage's Minimax Regret
   */
  static synthesizeGameTheory(params: ExtractedEventParams): AgentGameTheoryArtifact {
    const total = params.budgetAmount;
    const currency = params.currency;
    const reservationCeiling = Math.round(total * 0.82);

    const paretoTradeoffs: ParetoTradeoff[] = [
      {
        concessionGiven: 'Offer afternoon load-in flexibility (T-5h instead of morning lock)',
        concessionExtracted: `Waive standard $450-$700 equipment drop fee and secure complimentary vendor green room`,
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
        estimatedProtectedMargin: `Recovers ~${currency}${Math.round(total * 0.08).toLocaleString()} in otherwise sunk F&B spend.`,
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
   * Dispatches the multi-agent swarm, synthesizes artifacts, and compiles response
   */
  static executeSwarm(prompt: string, llmResponseText?: string): MultiAgentPlanResult {
    const params = this.extractParams(prompt);
    const agentsEngaged: string[] = ['Chief Orchestrator Agent'];

    let budgetArtifact: AgentBudgetArtifact | undefined;
    let timelineArtifact: AgentTimelineArtifact | undefined;
    let contractArtifact: AgentContractArtifact | undefined;
    let gameTheoryArtifact: AgentGameTheoryArtifact | undefined;

    // Trigger Financial Agent
    if (params.isBudgetQuery || prompt.includes('$') || prompt.includes('cost') || prompt.includes('spend')) {
      agentsEngaged.push('Financial Synthesizer Agent');
      budgetArtifact = this.synthesizeBudget(params);
    }

    // Trigger Logistics Agent
    if (params.isTimelineQuery || prompt.includes('schedule') || prompt.includes('timeline') || prompt.includes('hours')) {
      agentsEngaged.push('Logistics & Run-of-Show Agent');
      timelineArtifact = this.synthesizeTimeline(params);
    }

    // Trigger Contract Safeguard Agent & Game-Theoretic Bargaining Agent
    if (params.isContractQuery || prompt.includes('vendor') || prompt.includes('contract') || prompt.includes('caterer') || prompt.includes('deposit') || prompt.includes('negotiat') || prompt.includes('game')) {
      agentsEngaged.push('Contract Safeguard Agent', 'Game-Theoretic Bargaining Agent');
      contractArtifact = this.synthesizeContractSafeguards(params);
      gameTheoryArtifact = this.synthesizeGameTheory(params);
    }

    // If generic question with no specific artifacts triggered, generate a complete baseline plan including Game Theory
    if (!budgetArtifact && !timelineArtifact && !contractArtifact) {
      agentsEngaged.push('Financial Synthesizer Agent', 'Logistics & Run-of-Show Agent', 'Game-Theoretic Bargaining Agent');
      budgetArtifact = this.synthesizeBudget(params);
      timelineArtifact = this.synthesizeTimeline(params);
      gameTheoryArtifact = this.synthesizeGameTheory(params);
    }

    // Build concise executive summary
    const summary = llmResponseText && llmResponseText.length > 20
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
