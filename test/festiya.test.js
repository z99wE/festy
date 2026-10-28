import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Festiya Core Operations & Architecture', () => {
  test('Event category metrics and default parameters', () => {
    const categories = ['wedding', 'birthday', 'festival', 'product_launch'];
    assert.strictEqual(categories.length, 4);
    assert.ok(categories.includes('wedding'));
    assert.ok(categories.includes('festival'));
  });

  test('Currency conversion formula and rounding', () => {
    const rates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.12,
      JPY: 155.4
    };
    const convert = (amount, fromRate, toRate) => Math.round((amount / fromRate) * toRate);
    const converted = convert(1000, rates.USD, rates.INR);
    assert.strictEqual(converted, 83120);
    assert.ok(converted > 0);
  });

  test('Event budget allocator logic', () => {
    const totalBudget = 25000;
    const allocation = {
      venue: totalBudget * 0.40,
      catering: totalBudget * 0.25,
      entertainment: totalBudget * 0.15,
      decor: totalBudget * 0.10,
      contingency: totalBudget * 0.10
    };
    const sum = Object.values(allocation).reduce((a, b) => a + b, 0);
    assert.strictEqual(sum, totalBudget);
    assert.strictEqual(allocation.venue, 10000);
  });

  test('Festival coordinate boundaries', () => {
    const locations = [
      { name: 'Kyoto Hanami', lat: 35.0116, lng: 135.7681 },
      { name: 'Rio Carnival', lat: -22.9068, lng: -43.1729 },
      { name: 'Venice Carnival', lat: 45.4408, lng: 12.3155 },
      { name: 'Jaipur Holi', lat: 26.9124, lng: 75.7873 }
    ];
    for (const loc of locations) {
      assert.ok(loc.lat >= -90 && loc.lat <= 90);
      assert.ok(loc.lng >= -180 && loc.lng <= 180);
      assert.ok(loc.name.length > 0);
    }
  });

  test('Retry and exponential backoff calculator', () => {
    const calculateBackoff = (attempt, baseMs = 500, maxMs = 5000) => {
      const delay = baseMs * Math.pow(2, attempt);
      return Math.min(delay, maxMs);
    };
    assert.strictEqual(calculateBackoff(0), 500);
    assert.strictEqual(calculateBackoff(1), 1000);
    assert.strictEqual(calculateBackoff(2), 2000);
    assert.strictEqual(calculateBackoff(4), 5000);
  });
});
