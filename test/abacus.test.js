import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Event Economics Abacus Math & Invariant Engine', () => {
  const TIER_FACTORS = {
    pragmatic: 0.75,
    curated: 1.0,
    opulent: 1.65,
  };

  const BEAD_FACTORS = {
    1: 0.65,
    2: 0.85,
    3: 1.0,
    4: 1.35,
    5: 1.8,
  };

  const SAMPLE_MARKET = {
    id: 'us_metro',
    name: 'US Major Metro (NYC / SF / LA)',
    baseCurrencyCode: 'USD',
    venueRentalBase: 6500,
    caterCostPerHeadBase: 125,
    photoVideoBase: 3800,
    entertainmentBase: 2500,
    decorFloralBase: 3200,
    logisticsBase: 1500,
  };

  const calculateAbacus = (market, guestCount, tier, beads) => {
    const tierMultiplier = TIER_FACTORS[tier] ?? 1.0;
    const g = Math.max(1, guestCount || 1);

    const venue = market.venueRentalBase * tierMultiplier * (BEAD_FACTORS[beads.venue] ?? 1.0);
    const catering = market.caterCostPerHeadBase * g * tierMultiplier * (BEAD_FACTORS[beads.catering] ?? 1.0);
    const photo = market.photoVideoBase * tierMultiplier * (BEAD_FACTORS[beads.photo] ?? 1.0);
    const entertainment = market.entertainmentBase * tierMultiplier * (BEAD_FACTORS[beads.entertainment] ?? 1.0);
    const decor = market.decorFloralBase * tierMultiplier * (BEAD_FACTORS[beads.decor] ?? 1.0);
    const logistics = market.logisticsBase * tierMultiplier * (BEAD_FACTORS[beads.logistics] ?? 1.0);

    const totalLocal = venue + catering + photo + entertainment + decor + logistics;
    const perGuestLocal = totalLocal / g;

    return {
      venue: Math.round(venue),
      catering: Math.round(catering),
      photo: Math.round(photo),
      entertainment: Math.round(entertainment),
      decor: Math.round(decor),
      logistics: Math.round(logistics),
      totalLocal: Math.round(totalLocal),
      perGuestLocal: Math.round(perGuestLocal),
    };
  };

  test('Curated tier at neutral bead levels (3) produces baseline totals', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const res = calculateAbacus(SAMPLE_MARKET, 100, 'curated', beads);

    assert.strictEqual(res.venue, 6500);
    assert.strictEqual(res.catering, 125 * 100); // 12500
    assert.strictEqual(res.photo, 3800);
    assert.strictEqual(res.entertainment, 2500);
    assert.strictEqual(res.decor, 3200);
    assert.strictEqual(res.logistics, 1500);

    const sumPillars = res.venue + res.catering + res.photo + res.entertainment + res.decor + res.logistics;
    assert.strictEqual(res.totalLocal, sumPillars);
    assert.strictEqual(res.perGuestLocal, Math.round(sumPillars / 100));
  });

  test('Pragmatic tier applies strict 0.75x deflation factor across all components', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const curated = calculateAbacus(SAMPLE_MARKET, 50, 'curated', beads);
    const pragmatic = calculateAbacus(SAMPLE_MARKET, 50, 'pragmatic', beads);

    assert.strictEqual(pragmatic.venue, Math.round(curated.venue * 0.75));
    assert.strictEqual(pragmatic.catering, Math.round(curated.catering * 0.75));
    assert.ok(pragmatic.totalLocal < curated.totalLocal);
  });

  test('Opulent tier scales by 1.65x for luxury tier requirements', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const curated = calculateAbacus(SAMPLE_MARKET, 50, 'curated', beads);
    const opulent = calculateAbacus(SAMPLE_MARKET, 50, 'opulent', beads);

    assert.strictEqual(opulent.venue, Math.round(curated.venue * 1.65));
    assert.ok(opulent.totalLocal > curated.totalLocal);
  });

  test('Bead level extremes (1 vs 5) correctly scale component from 0.65x to 1.80x', () => {
    const beadsLow = { venue: 1, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const beadsHigh = { venue: 5, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };

    const lowRes = calculateAbacus(SAMPLE_MARKET, 50, 'curated', beadsLow);
    const highRes = calculateAbacus(SAMPLE_MARKET, 50, 'curated', beadsHigh);

    assert.strictEqual(lowRes.venue, Math.round(SAMPLE_MARKET.venueRentalBase * 0.65));
    assert.strictEqual(highRes.venue, Math.round(SAMPLE_MARKET.venueRentalBase * 1.80));
    assert.ok(highRes.venue > lowRes.venue * 2.5);
  });

  test('Guest count sensitivity strictly prorates catering while venue base remains fixed', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const res50 = calculateAbacus(SAMPLE_MARKET, 50, 'curated', beads);
    const res150 = calculateAbacus(SAMPLE_MARKET, 150, 'curated', beads);

    // Venue does not change with guest count
    assert.strictEqual(res50.venue, res150.venue);
    // Catering scales exactly 3x (150 / 50)
    assert.strictEqual(res150.catering, res50.catering * 3);
  });

  test('Per-guest economy of scale diminishes per-head fixed overhead', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const smallEvent = calculateAbacus(SAMPLE_MARKET, 20, 'curated', beads);
    const largeEvent = calculateAbacus(SAMPLE_MARKET, 200, 'curated', beads);

    assert.ok(
      smallEvent.perGuestLocal > largeEvent.perGuestLocal,
      `Expected large event per-guest (${largeEvent.perGuestLocal}) to be less than small event (${smallEvent.perGuestLocal})`
    );
  });

  test('Zero and negative guest counts are safely guarded against division by zero', () => {
    const beads = { venue: 3, catering: 3, photo: 3, entertainment: 3, decor: 3, logistics: 3 };
    const zeroGuest = calculateAbacus(SAMPLE_MARKET, 0, 'curated', beads);
    const negGuest = calculateAbacus(SAMPLE_MARKET, -10, 'curated', beads);

    assert.ok(Number.isFinite(zeroGuest.perGuestLocal));
    assert.ok(Number.isFinite(negGuest.perGuestLocal));
    assert.ok(zeroGuest.perGuestLocal > 0);
  });
});
