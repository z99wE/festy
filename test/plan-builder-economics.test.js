import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const OCCASIONS = [
  { id: 'birthday', label: 'Milestone Birthday', subtitle: 'Fun, energetic, personal memories' },
  { id: 'wedding', label: 'Joyful Wedding', subtitle: 'Heartfelt, elegant, multi-generational' },
  { id: 'family_reunion', label: 'Family Reunion', subtitle: 'Multi-day, garden feasts & keepsakes' },
  { id: 'cultural_fest', label: 'Cultural Festival', subtitle: 'Heritage, banquets & lantern spectacles' },
  { id: 'community', label: 'Community Carnival', subtitle: 'Street festival, vibrant, open-air' },
  { id: 'retreat', label: 'Offsite & Retreat', subtitle: 'Luxury lodges, strategy & nature breaks' },
  { id: 'festival', label: 'Music & Street Fest', subtitle: 'Live stages, street food & high vibe' },
  { id: 'work', label: 'Gala & Showcase', subtitle: 'Impactful, polished, team celebration' },
];

const BUDGET_CATEGORIES = [
  {
    id: 'b1',
    category: 'Venue & Staging',
    label: 'Main space rental, festive lighting & setup',
    percentage: 0.32,
    lowRatio: 0.28,
    highRatio: 0.36,
  },
  {
    id: 'b2',
    category: 'Food & Refreshments',
    label: 'Interactive food stations, drinks & custom cake/bites',
    percentage: 0.38,
    lowRatio: 0.34,
    highRatio: 0.42,
  },
  {
    id: 'b3',
    category: 'Sound & Entertainment',
    label: 'Live performers, microphones, DJ & ambiance',
    percentage: 0.14,
    lowRatio: 0.12,
    highRatio: 0.18,
  },
  {
    id: 'b4',
    category: 'Decor & Atmosphere',
    label: 'Warm festoon lighting, florals, signage & photo backdrops',
    percentage: 0.10,
    lowRatio: 0.08,
    highRatio: 0.12,
  },
  {
    id: 'b5',
    category: 'Safety & Contingency Buffer',
    label: 'Weather backup, extra supplies & emergency fund',
    percentage: 0.06,
    lowRatio: 0.05,
    highRatio: 0.08,
  },
];

const INITIAL_TASKS = [
  { id: 't1', title: 'Lock down date & send save-the-dates', offset: '8 weeks out', priority: 'critical', order: 1 },
  { id: 't2', title: 'Confirm venue contract & deposit', offset: '6 weeks out', priority: 'high', order: 2 },
  { id: 't3', title: 'Review caterer menu tastings & dietary counts', offset: '4 weeks out', priority: 'high', order: 3 },
  { id: 't4', title: 'Finalize music playlist & speaker cues', offset: '2 weeks out', priority: 'medium', order: 4 },
  { id: 't5', title: 'Distribute run-of-show to key volunteers / vendors', offset: '3 days out', priority: 'critical', order: 5 },
  { id: 't6', title: 'Festival day kickoff & welcoming the crowd', offset: 'Day of event', priority: 'high', order: 6 },
];

function calculate3TierBudget(totalAmount, categories = BUDGET_CATEGORIES) {
  const safeTotal = Math.max(0, totalAmount);
  return categories.map((cat) => {
    const target = Math.round(safeTotal * cat.percentage);
    const low = Math.round(safeTotal * cat.lowRatio);
    const high = Math.round(safeTotal * cat.highRatio);
    return {
      id: cat.id,
      category: cat.category,
      conservative: low,
      realistic: target,
      luxury: high,
    };
  });
}

describe('Festiya Plan Builder & Budget Invariants Suite', () => {
  describe('Occasion Archetypes & Taxonomy', () => {
    test('contains all 8 signature celebration archetypes', () => {
      assert.equal(OCCASIONS.length, 8);
    });

    test('every occasion archetype has non-empty unique identifier, label, and subtitle', () => {
      const ids = new Set();
      for (const occ of OCCASIONS) {
        assert.ok(occ.id && occ.id.length > 2);
        assert.ok(occ.label && occ.label.length > 3);
        assert.ok(occ.subtitle && occ.subtitle.length > 5);
        assert.ok(!ids.has(occ.id), `Duplicate occasion ID: ${occ.id}`);
        ids.add(occ.id);
      }
    });

    test('supports milestone birthday, joyful wedding, and community gatherings', () => {
      const ids = OCCASIONS.map((o) => o.id);
      assert.ok(ids.includes('birthday'));
      assert.ok(ids.includes('wedding'));
      assert.ok(ids.includes('community'));
      assert.ok(ids.includes('festival'));
    });
  });

  describe('3-Tier Budget Allocation Mathematics', () => {
    test('base category percentages sum to exactly 100% (1.0)', () => {
      const totalPercentage = BUDGET_CATEGORIES.reduce((acc, cat) => acc + cat.percentage, 0);
      assert.ok(Math.abs(totalPercentage - 1.0) < 0.0001, `Expected 1.0, got ${totalPercentage}`);
    });

    test('conservative low ratio is strictly lower than realistic ratio for all categories', () => {
      for (const cat of BUDGET_CATEGORIES) {
        assert.ok(cat.lowRatio < cat.percentage, `Category ${cat.category} low ratio must be < base`);
      }
    });

    test('luxury high ratio is strictly higher than realistic ratio for all categories', () => {
      for (const cat of BUDGET_CATEGORIES) {
        assert.ok(cat.highRatio > cat.percentage, `Category ${cat.category} high ratio must be > base`);
      }
    });

    test('enforces strict tier order: Conservative <= Realistic <= Luxury for any budget amount', () => {
      const testBudgets = [1000, 5000, 25000, 150000, 500000];
      for (const amount of testBudgets) {
        const tiers = calculate3TierBudget(amount);
        for (const item of tiers) {
          assert.ok(item.conservative <= item.realistic, `${item.category}: low > realistic`);
          assert.ok(item.realistic <= item.luxury, `${item.category}: realistic > high`);
        }
      }
    });

    test('handles zero and negative budgets safely without throwing or NaN', () => {
      const zeroTiers = calculate3TierBudget(0);
      for (const item of zeroTiers) {
        assert.equal(item.conservative, 0);
        assert.equal(item.realistic, 0);
        assert.equal(item.luxury, 0);
      }

      const negTiers = calculate3TierBudget(-5000);
      for (const item of negTiers) {
        assert.equal(item.conservative, 0);
        assert.equal(item.realistic, 0);
        assert.equal(item.luxury, 0);
      }
    });

    test('food and venue together represent the primary core pillars (>= 60%)', () => {
      const venue = BUDGET_CATEGORIES.find((c) => c.category === 'Venue & Staging');
      const food = BUDGET_CATEGORIES.find((c) => c.category === 'Food & Refreshments');
      assert.ok(venue && food);
      const combined = venue.percentage + food.percentage;
      assert.ok(combined >= 0.60, `Combined venue + food should be >= 0.60, got ${combined}`);
    });

    test('contingency reserve represents at least 5% safety buffer', () => {
      const safety = BUDGET_CATEGORIES.find((c) => c.category.includes('Contingency'));
      assert.ok(safety);
      assert.ok(safety.percentage >= 0.05);
    });
  });

  describe('Timeline Milestone Sequencing', () => {
    test('tasks are strictly chronologically ordered from planning phase to event day', () => {
      for (let i = 0; i < INITIAL_TASKS.length - 1; i++) {
        assert.ok(INITIAL_TASKS[i].order < INITIAL_TASKS[i + 1].order);
      }
    });

    test('critical priorities are assigned to initial lock-in and run-of-show distribution', () => {
      const t1 = INITIAL_TASKS.find((t) => t.id === 't1');
      const t5 = INITIAL_TASKS.find((t) => t.id === 't5');
      assert.equal(t1?.priority, 'critical');
      assert.equal(t5?.priority, 'critical');
    });

    test('every milestone contains actionable title and temporal offset', () => {
      for (const task of INITIAL_TASKS) {
        assert.ok(task.title.length > 10);
        assert.ok(task.offset.length > 3);
        assert.ok(['low', 'medium', 'high', 'critical'].includes(task.priority));
      }
    });
  });
});
