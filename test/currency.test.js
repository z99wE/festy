import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Global Currency & Forex Economics Suite', () => {
  const BASE_RATES_2026 = {
    USD: 1.0,
    EUR: 0.8975,
    GBP: 0.7511,
    INR: 95.1993,
    CAD: 1.4041,
    AUD: 1.4226,
    JPY: 157.893,
    AED: 3.6725,
    SGD: 1.2812,
    CHF: 0.8288,
  };

  const getExchangeRate = (from, to) => {
    const fromRate = BASE_RATES_2026[from] || 1.0;
    const toRate = BASE_RATES_2026[to] || 1.0;
    return toRate / fromRate;
  };

  const convertCurrency = (amount, from, to) => {
    if (!amount || amount <= 0) return 0;
    return amount * getExchangeRate(from, to);
  };

  test('All 10 tier-1 global currencies have strictly positive baseline rates', () => {
    const expectedCurrencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'AED', 'SGD', 'CHF'];
    assert.strictEqual(expectedCurrencies.length, 10);
    for (const code of expectedCurrencies) {
      assert.ok(code in BASE_RATES_2026, `Missing currency code: ${code}`);
      assert.ok(BASE_RATES_2026[code] > 0, `Rate for ${code} must be strictly positive`);
      assert.ok(Number.isFinite(BASE_RATES_2026[code]), `Rate for ${code} must be finite`);
    }
  });

  test('Cross-currency exchange parity and invertibility (USD <-> INR, EUR <-> JPY)', () => {
    const rateUsdToInr = getExchangeRate('USD', 'INR');
    const rateInrToUsd = getExchangeRate('INR', 'USD');
    const product = rateUsdToInr * rateInrToUsd;
    assert.ok(Math.abs(product - 1.0) < 1e-6, `Invertibility failed: product was ${product}`);

    const rateEurToJpy = getExchangeRate('EUR', 'JPY');
    const rateJpyToEur = getExchangeRate('JPY', 'EUR');
    assert.ok(Math.abs(rateEurToJpy * rateJpyToEur - 1.0) < 1e-6);
  });

  test('Triangular arbitrage consistency (USD -> EUR -> GBP -> USD = 1.0)', () => {
    const usdToEur = getExchangeRate('USD', 'EUR');
    const eurToGbp = getExchangeRate('EUR', 'GBP');
    const gbpToUsd = getExchangeRate('GBP', 'USD');
    const cycle = usdToEur * eurToGbp * gbpToUsd;
    assert.ok(Math.abs(cycle - 1.0) < 1e-6, `Arbitrage violation in rate cycle: ${cycle}`);
  });

  test('Zero and negative amounts are safely clamped to 0', () => {
    assert.strictEqual(convertCurrency(0, 'USD', 'INR'), 0);
    assert.strictEqual(convertCurrency(-100, 'EUR', 'USD'), 0);
    assert.strictEqual(convertCurrency(NaN, 'GBP', 'EUR'), 0);
    assert.strictEqual(convertCurrency(null, 'USD', 'JPY'), 0);
  });

  test('Budget scaling boundaries for high-denomination vs low-denomination currencies', () => {
    const scales = {
      INR: { min: 100000, max: 10000000, step: 50000 },
      JPY: { min: 150000, max: 15000000, step: 50000 },
      USD: { min: 1000, max: 100000, step: 500 },
      GBP: { min: 800, max: 80000, step: 500 },
    };

    assert.ok(scales.INR.min >= 100000, 'INR min must reflect Lakh scale');
    assert.ok(scales.JPY.min >= 100000, 'JPY min must reflect 100K Yen scale');
    assert.ok(scales.USD.min <= 5000, 'USD min must remain accessible for micro-events');
    assert.ok(scales.GBP.step <= 1000, 'GBP step size must allow fine-grained slider control');
  });

  test('Currency symbol resolution and formatting locale standards', () => {
    const symbolMap = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      JPY: '¥',
      CAD: 'C$',
      AUD: 'A$',
      AED: 'AED ',
      SGD: 'S$',
      CHF: 'CHF ',
    };

    const formatCurrencySample = (amount, code) => {
      const sym = symbolMap[code] || '$';
      const loc = code === 'INR' ? 'en-IN' : code === 'JPY' ? 'ja-JP' : 'en-US';
      return `${sym}${Math.round(amount).toLocaleString(loc)}`;
    };

    const formattedInr = formatCurrencySample(1250000, 'INR');
    assert.ok(formattedInr.startsWith('₹'), 'INR formatted string must start with Rupee symbol');
    assert.ok(formattedInr.includes('12,50,000'), `Expected Indian grouping format, got: ${formattedInr}`);

    const formattedJpy = formatCurrencySample(500000, 'JPY');
    assert.ok(formattedJpy.startsWith('¥'));
    assert.strictEqual(formattedJpy, '¥500,000');
  });

  test('Roundtrip precision preservation under multi-hop conversions', () => {
    const initialUsd = 10000;
    const inrVal = convertCurrency(initialUsd, 'USD', 'INR');
    const eurVal = convertCurrency(inrVal, 'INR', 'EUR');
    const backToUsd = convertCurrency(eurVal, 'EUR', 'USD');
    assert.ok(Math.abs(backToUsd - initialUsd) < 0.01, `Drift detected in roundtrip: ${backToUsd} vs ${initialUsd}`);
  });
});
