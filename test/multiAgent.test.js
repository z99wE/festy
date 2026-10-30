import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

/**
 * MultiAgent Swarm Core Engine Invariants
 */
function synthesizeBudget(totalBudget, guestCount, currency = '$') {
  const safeGuests = Math.max(1, guestCount || 50);
  const safeBudget = Math.max(500, totalBudget || 5000);

  const conservative = Math.round(safeBudget * 0.75);
  const realistic = safeBudget;
  const luxury = Math.round(safeBudget * 1.45);

  const categories = [
    { category: 'Venue Hire & Staging', percentage: 38 },
    { category: 'Catering & Hospitality', percentage: 28 },
    { category: 'Acoustics & Entertainment', percentage: 14 },
    { category: 'Photo & Cinematography', percentage: 10 },
    { category: 'Floral & Scenography', percentage: 6 },
    { category: 'Escrow & Contingency', percentage: 4 },
  ];

  const allocations = categories.map((cat) => ({
    category: cat.category,
    amount: Math.round((safeBudget * cat.percentage) / 100),
    percentage: cat.percentage,
    notes: `${cat.percentage}% allocation based on regional benchmarks`,
  }));

  const allocatedSum = allocations.reduce((sum, item) => sum + item.amount, 0);

  return {
    currency,
    totalBudget: safeBudget,
    guestCount: safeGuests,
    costPerGuest: Math.round(safeBudget / safeGuests),
    tiers: {
      conservative,
      realistic,
      luxury,
    },
    categories: allocations,
    allocatedSum,
  };
}

function synthesizeTimeline(_occasionTitle = 'Celebration') {
  return [
    { time: '14:00', title: 'Vendor Load-In & Site Prep', detail: 'Audio/lighting load-in and catering prep' },
    { time: '15:30', title: 'Buffer & Acoustic Soundcheck', detail: 'Mandatory 45-min buffer window' },
    { time: '16:30', title: 'Guest Arrival & Welcome Drinks', detail: 'Ambient background music' },
    { time: '18:00', title: 'Main Program & Dinner Service', detail: 'Dining service and celebratory remarks' },
    { time: '20:00', title: 'Evening High-Energy Floor', detail: 'Curated dance set & signature toast' },
    { time: '22:30', title: 'Fond Farewell & Departure', detail: 'Late night snack and guest egress' },
  ];
}

function synthesizeGameTheory(totalBudget, currency = '$') {
  const batnaDiscount = 0.82;
  const ceilingMultiplier = 1.15;

  return {
    batnaAnchor: `${currency}${Math.round(totalBudget * batnaDiscount).toLocaleString()} (Secondary market baseline with self-sourced catering)`,
    reservationCeiling: `${currency}${Math.round(totalBudget * ceilingMultiplier).toLocaleString()} (Ceiling beyond which host is mathematically incentivized to walk away)`,
    paretoTradeoffs: [
      {
        concessionGiven: 'Early Tuesday load-in setup (Zero cost to host)',
        concessionExtracted: 'Waiver of $650 standard sound engineer fee (High value to host)',
        payoffRationale: 'Fills supplier idle weekday capacity while eliminating cash outlay for host',
      },
    ],
    minimaxScenarios: [
      {
        riskScenario: 'Late guest drop of 20% below catering minimum',
        minimaxOptimalStrategy: 'Pre-negotiate per-head fee transfer to premium bar top-shelf upgrades rather than forfeiture',
        estimatedProtectedMargin: '100% of minimum spend value recovered',
      },
    ],
  };
}

describe('Autonomous Multi-Agent Swarm Logic & Invariants', () => {
  describe('Financial Synthesizer Agent', () => {
    test('enforces strict tier hierarchy: Conservative <= Realistic <= Luxury', () => {
      const budget = synthesizeBudget(12000, 80, '$');
      assert.ok(budget.tiers.conservative < budget.tiers.realistic);
      assert.ok(budget.tiers.realistic < budget.tiers.luxury);
      assert.strictEqual(budget.tiers.realistic, 12000);
      assert.strictEqual(budget.tiers.conservative, 9000);
      assert.strictEqual(budget.tiers.luxury, 17400);
    });

    test('calculates accurate unit economics (cost per guest)', () => {
      const budget = synthesizeBudget(10000, 50, '$');
      assert.strictEqual(budget.costPerGuest, 200);

      const smallEvent = synthesizeBudget(5000, 25, '$');
      assert.strictEqual(smallEvent.costPerGuest, 200);
    });

    test('recovers from degenerate boundaries (0 guests, negative or zero budget)', () => {
      const edgeBudget = synthesizeBudget(0, 0, '$');
      assert.ok(edgeBudget.guestCount >= 1);
      assert.ok(edgeBudget.totalBudget >= 500);
      assert.ok(edgeBudget.costPerGuest > 0);
    });

    test('category allocations equal 100% of realistic budget ceiling', () => {
      const budget = synthesizeBudget(50000, 200, '$');
      const totalPct = budget.categories.reduce((acc, cat) => acc + cat.percentage, 0);
      assert.strictEqual(totalPct, 100);
      assert.strictEqual(budget.allocatedSum, 50000);
    });
  });

  describe('Logistics & Run-of-Show Architect', () => {
    test('produces chronologically ordered timeline milestones', () => {
      const timeline = synthesizeTimeline('Wedding');
      assert.ok(timeline.length >= 5);

      for (let i = 0; i < timeline.length - 1; i++) {
        const t1 = timeline[i].time;
        const t2 = timeline[i + 1].time;
        assert.ok(t1 < t2, `Milestone ${t1} should precede ${t2}`);
      }
    });

    test('contains mandatory pre-event safety buffer window', () => {
      const timeline = synthesizeTimeline('Gala');
      const hasBuffer = timeline.some((item) =>
        item.title.toLowerCase().includes('buffer') || item.detail.toLowerCase().includes('buffer')
      );
      assert.ok(hasBuffer, 'Run of show must include contingency buffer window');
    });
  });

  describe('Game-Theoretic Bargaining Agent', () => {
    test('establishes BATNA below budget and Reservation Ceiling above budget', () => {
      const gt = synthesizeGameTheory(20000, '$');
      assert.ok(gt.batnaAnchor.includes('$16,400'));
      assert.ok(gt.reservationCeiling.includes('$23,000'));
      assert.ok(gt.paretoTradeoffs.length > 0);
      assert.ok(gt.minimaxScenarios.length > 0);
    });

    test('validates Pareto utility asymmetric exchange structure', () => {
      const gt = synthesizeGameTheory(15000, '$');
      const trade = gt.paretoTradeoffs[0];
      assert.ok(trade.concessionGiven.length > 0);
      assert.ok(trade.concessionExtracted.length > 0);
      assert.ok(trade.payoffRationale.length > 0);
    });
  });
});
