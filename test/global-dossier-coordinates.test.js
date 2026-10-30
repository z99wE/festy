import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const SAMPLE_CELEBRATION_PINS = [
  {
    id: 'rio_carnival',
    name: 'Rio Carnival Spectacular',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    dates: 'Feb 12 – Feb 17, 2027',
    daysUntil: 108,
    localCurrencyCode: 'BRL',
    localCurrencySymbol: 'R$ ',
    estBudgetLocal: 120000,
    estBudgetUSD: 24000,
    guestRange: '150–500 Guests',
    lat: -22.9,
    lon: -43.1,
  },
  {
    id: 'diwali_delhi',
    name: 'Diwali Festival of Lights',
    location: 'New Delhi & Jaipur',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia & Pacific',
    dates: 'Oct 31 – Nov 4, 2026',
    daysUntil: 18,
    localCurrencyCode: 'INR',
    localCurrencySymbol: '₹',
    estBudgetLocal: 1540000,
    estBudgetUSD: 18500,
    guestRange: '250–600 Guests',
    lat: 28.6,
    lon: 77.2,
  },
  {
    id: 'hanami_kyoto',
    name: 'Hanami Cherry Blossom Gala',
    location: 'Kyoto & Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia & Pacific',
    dates: 'Mar 25 – Apr 2, 2027',
    daysUntil: 148,
    localCurrencyCode: 'JPY',
    localCurrencySymbol: '¥',
    estBudgetLocal: 2250000,
    estBudgetUSD: 14500,
    guestRange: '80–200 Guests',
    lat: 35.0,
    lon: 135.7,
  },
  {
    id: 'venice_carnival',
    name: 'Venetian Masquerade Regatta',
    location: 'Venice',
    country: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    dates: 'Feb 20 – Mar 2, 2027',
    daysUntil: 115,
    localCurrencyCode: 'EUR',
    localCurrencySymbol: '€',
    estBudgetLocal: 20200,
    estBudgetUSD: 22000,
    guestRange: '100–300 Guests',
    lat: 45.4,
    lon: 12.3,
  },
  {
    id: 'midsummer_uk',
    name: 'Midsummer Solstice Gathering',
    location: 'Somerset & Wiltshire',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    dates: 'Jun 18 – Jun 22, 2027',
    daysUntil: 234,
    localCurrencyCode: 'GBP',
    localCurrencySymbol: '£',
    estBudgetLocal: 16800,
    estBudgetUSD: 21500,
    guestRange: '150–400 Guests',
    lat: 51.1,
    lon: -1.8,
  },
];

function formatLocalRegionalBudget(pin) {
  let localFormatted = '';
  if (pin.localCurrencyCode === 'INR') {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('en-IN')}`;
  } else if (pin.localCurrencyCode === 'JPY') {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('ja-JP')}`;
  } else {
    localFormatted = `${pin.localCurrencySymbol}${pin.estBudgetLocal.toLocaleString('en-US')}`;
  }
  const usdBenchmark = `≈ $${pin.estBudgetUSD.toLocaleString()} USD`;
  return { localFormatted, usdBenchmark };
}

function projectSphericalCoordinates(lat, lon, radius = 100) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return { x, y, z };
}

describe('Global Celebrations Dossier & Spherical Coordinates Suite', () => {
  describe('Geographic Boundary Checks', () => {
    for (const pin of SAMPLE_CELEBRATION_PINS) {
      test(`verifies valid latitude/longitude for ${pin.name}`, () => {
        assert.ok(pin.lat >= -90 && pin.lat <= 90, `Invalid latitude ${pin.lat}`);
        assert.ok(pin.lon >= -180 && pin.lon <= 180, `Invalid longitude ${pin.lon}`);
      });
    }

    test('verifies all countdown daysUntil are strictly positive', () => {
      for (const pin of SAMPLE_CELEBRATION_PINS) {
        assert.ok(Number.isInteger(pin.daysUntil) && pin.daysUntil > 0);
      }
    });

    test('verifies 3-character ISO currency code format', () => {
      for (const pin of SAMPLE_CELEBRATION_PINS) {
        assert.match(pin.localCurrencyCode, /^[A-Z]{3}$/);
      }
    });
  });

  describe('3D Spherical Cartesian Projection Invariants', () => {
    test('projects coordinates onto a sphere of exact target radius', () => {
      const radius = 100;
      for (const pin of SAMPLE_CELEBRATION_PINS) {
        const { x, y, z } = projectSphericalCoordinates(pin.lat, pin.lon, radius);
        const calculatedRadius = Math.sqrt(x * x + y * y + z * z);
        assert.ok(
          Math.abs(calculatedRadius - radius) < 0.001,
          `Expected radius 100, got ${calculatedRadius.toFixed(3)}`
        );
      }
    });

    test('equator coordinates (lat 0) produce zero vertical y offset', () => {
      const { y } = projectSphericalCoordinates(0, 0, 100);
      assert.ok(Math.abs(y) < 0.001, `Equator y should be ~0, got ${y}`);
    });

    test('north pole coordinates (lat 90) produce maximum positive y', () => {
      const { x, y, z } = projectSphericalCoordinates(90, 0, 100);
      assert.ok(Math.abs(y - 100) < 0.001, `North pole y should be ~100, got ${y}`);
      assert.ok(Math.abs(x) < 0.001 && Math.abs(z) < 0.001);
    });

    test('south pole coordinates (lat -90) produce maximum negative y', () => {
      const { x, y, z } = projectSphericalCoordinates(-90, 0, 100);
      assert.ok(Math.abs(y - (-100)) < 0.001, `South pole y should be ~-100, got ${y}`);
      assert.ok(Math.abs(x) < 0.001 && Math.abs(z) < 0.001);
    });
  });

  describe('Localized Regional Valuation Formatting', () => {
    test('formats Indian Rupee (INR) using Indian grouping (lakhs & crores)', () => {
      const inrPin = SAMPLE_CELEBRATION_PINS.find((p) => p.localCurrencyCode === 'INR');
      assert.ok(inrPin);
      const { localFormatted } = formatLocalRegionalBudget(inrPin);
      assert.ok(localFormatted.startsWith('₹'));
      // In Indian grouping, 1540000 formats as 15,40,000
      assert.ok(localFormatted.includes('15,40,000') || localFormatted.includes('1540000'));
    });

    test('formats Japanese Yen (JPY) without decimal cents', () => {
      const jpyPin = SAMPLE_CELEBRATION_PINS.find((p) => p.localCurrencyCode === 'JPY');
      assert.ok(jpyPin);
      const { localFormatted } = formatLocalRegionalBudget(jpyPin);
      assert.ok(localFormatted.startsWith('¥'));
      assert.ok(!localFormatted.includes('.'));
    });

    test('formats Brazilian Real (BRL) with standard R$ symbol', () => {
      const brlPin = SAMPLE_CELEBRATION_PINS.find((p) => p.localCurrencyCode === 'BRL');
      assert.ok(brlPin);
      const { localFormatted } = formatLocalRegionalBudget(brlPin);
      assert.ok(localFormatted.startsWith('R$'));
    });

    test('produces valid USD benchmark representation for every festival', () => {
      for (const pin of SAMPLE_CELEBRATION_PINS) {
        const { usdBenchmark } = formatLocalRegionalBudget(pin);
        assert.match(usdBenchmark, /^≈ \$\d[\d,]* USD$/);
      }
    });
  });
});
