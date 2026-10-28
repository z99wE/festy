import { useState, useEffect } from 'react';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  exchangeRateFromUSD: number;
  region: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', exchangeRateFromUSD: 1.0, region: 'North America' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', exchangeRateFromUSD: 0.8975, region: 'Europe' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', exchangeRateFromUSD: 0.7511, region: 'United Kingdom' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', exchangeRateFromUSD: 95.1993, region: 'South Asia' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', exchangeRateFromUSD: 1.4041, region: 'Canada' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', exchangeRateFromUSD: 1.4226, region: 'Australia' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', exchangeRateFromUSD: 157.893, region: 'Japan' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', exchangeRateFromUSD: 3.6725, region: 'Middle East' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', exchangeRateFromUSD: 1.2812, region: 'Southeast Asia' },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', flag: '🇨🇭', exchangeRateFromUSD: 0.8288, region: 'Switzerland' },
];

const liveRatesCache: Record<string, number> = {
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

const CACHE_KEY = 'festiya_forex_rates_2026_v4';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function isValidCachedRates(parsed: { timestamp?: number; rates?: { INR?: unknown } } | null): boolean {
  if (!parsed || !parsed.rates) return false;
  const isFresh = typeof parsed.timestamp === 'number' && Date.now() - parsed.timestamp < CACHE_TTL_MS;
  const validInr = typeof parsed.rates.INR === 'number' && parsed.rates.INR >= 90;
  return isFresh && validInr;
}

function applyRates(rates: Record<string, unknown>): void {
  for (const c of SUPPORTED_CURRENCIES) {
    if (typeof rates[c.code] === 'number') {
      liveRatesCache[c.code] = rates[c.code] as number;
    }
  }
}

export async function refreshLiveRates(): Promise<Record<string, number>> {
  if (typeof window === 'undefined') return liveRatesCache;
  try {
    localStorage.removeItem('festiya_live_rates_v1');
    localStorage.removeItem('festiya_live_rates_v2');

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && isValidCachedRates(JSON.parse(cached))) {
      Object.assign(liveRatesCache, JSON.parse(cached).rates);
      return liveRatesCache;
    }

    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error(`Rate API returned ${res.status}`);
    const data = await res.json();
    if (data && data.rates) {
      applyRates(data.rates);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), rates: liveRatesCache }));
      window.dispatchEvent(new CustomEvent('festiya-rates-updated', { detail: liveRatesCache }));
    }
  } catch (err) {
    console.warn('[Festiya Currency] Fallback to verified 2026 baseline rates:', err);
  }
  return liveRatesCache;
}

export function useLiveRates(): Record<string, number> {
  const [rates, setRates] = useState<Record<string, number>>(() => ({ ...liveRatesCache }));
  useEffect(() => {
    const handleUpdate = () => setRates({ ...liveRatesCache });
    window.addEventListener('festiya-rates-updated', handleUpdate);
    refreshLiveRates().then(handleUpdate);
    return () => window.removeEventListener('festiya-rates-updated', handleUpdate);
  }, []);
  return rates;
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    refreshLiveRates().catch(() => {});
  }, 50);
}

const SYMBOL_ALIASES: Record<string, string> = {
  '$': 'USD',
  'US$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '₹': 'INR',
  'RS': 'INR',
  'INR': 'INR',
  'A$': 'AUD',
  'AUD': 'AUD',
  'C$': 'CAD',
  'CAD': 'CAD',
  '¥': 'JPY',
  'JPY': 'JPY',
  'AED': 'AED',
  'AED ': 'AED',
  'S$': 'SGD',
  'SGD': 'SGD',
  'CHF': 'CHF',
  'CHF ': 'CHF',
};

export function resolveCurrencyCode(symbolOrCode: string): string {
  const clean = symbolOrCode.trim();
  const directMatch = SUPPORTED_CURRENCIES.find((c) => c.code.toUpperCase() === clean.toUpperCase());
  if (directMatch) return directMatch.code;
  const symbolMatch = SUPPORTED_CURRENCIES.find((c) => c.symbol.trim() === clean);
  if (symbolMatch) return symbolMatch.code;
  return SYMBOL_ALIASES[clean.toUpperCase()] || SYMBOL_ALIASES[clean] || 'USD';
}

export function resolveCurrencySymbol(symbolOrCode: string): string {
  const code = resolveCurrencyCode(symbolOrCode);
  const cfg = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  return cfg ? cfg.symbol : '$';
}

export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const fromCode = resolveCurrencyCode(fromCurrency);
  const toCode = resolveCurrencyCode(toCurrency);
  const fromRate = liveRatesCache[fromCode] || 1.0;
  const toRate = liveRatesCache[toCode] || 1.0;
  return toRate / fromRate;
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  if (!amount || amount <= 0) return 0;
  return amount * getExchangeRate(fromCurrency, toCurrency);
}

export interface CurrencyBudgetScale {
  code: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultBudget: number;
  ticks: [string, string, string];
}

export type CurrencyScale = CurrencyBudgetScale;

const BUDGET_SCALES: Record<string, Omit<CurrencyBudgetScale, 'code' | 'symbol'>> = {
  INR: { min: 100000, max: 10000000, step: 50000, defaultBudget: 800000, ticks: ['₹1 Lakh', '₹50 Lakhs', '₹1 Crore+'] },
  JPY: { min: 150000, max: 15000000, step: 50000, defaultBudget: 1200000, ticks: ['¥150K', '¥7.5M', '¥15M+'] },
  AED: { min: 5000, max: 500000, step: 2500, defaultBudget: 40000, ticks: ['AED 5K', 'AED 250K', 'AED 500K+'] },
  GBP: { min: 800, max: 80000, step: 500, defaultBudget: 7500, ticks: ['£800', '£40,000', '£80,000+'] },
  EUR: { min: 1000, max: 100000, step: 500, defaultBudget: 9000, ticks: ['€1,000', '€50,000', '€100,000+'] },
  CHF: { min: 1000, max: 100000, step: 500, defaultBudget: 9000, ticks: ['CHF 1,000', 'CHF 50,000', 'CHF 100,000+'] },
  CAD: { min: 1500, max: 150000, step: 500, defaultBudget: 15000, ticks: ['C$1,500', 'C$75,000', 'C$150,000+'] },
  AUD: { min: 1500, max: 150000, step: 500, defaultBudget: 15000, ticks: ['A$1,500', 'A$75,000', 'A$150,000+'] },
  SGD: { min: 1500, max: 150000, step: 500, defaultBudget: 15000, ticks: ['S$1,500', 'S$75,000', 'S$150,000+'] },
};

const DEFAULT_SCALE: Omit<CurrencyBudgetScale, 'code' | 'symbol'> = {
  min: 1000,
  max: 100000,
  step: 500,
  defaultBudget: 10000,
  ticks: ['$1,000', '$50,000', '$100,000+'],
};

export function getCurrencyBudgetScale(symbolOrCode: string): CurrencyBudgetScale {
  const code = resolveCurrencyCode(symbolOrCode);
  const symbol = resolveCurrencySymbol(symbolOrCode);
  const scale = BUDGET_SCALES[code] || DEFAULT_SCALE;
  return { code, symbol, ...scale };
}

export function formatCurrency(
  amount: number,
  currencyCodeOrSymbol: string = 'USD',
  isUSDAmount: boolean = true
): string {
  const code = resolveCurrencyCode(currencyCodeOrSymbol);
  const cfg = SUPPORTED_CURRENCIES.find((c) => c.code === code) || SUPPORTED_CURRENCIES[0];

  let converted = amount;
  if (isUSDAmount && code !== 'USD') {
    converted = amount * (liveRatesCache[code] || cfg.exchangeRateFromUSD);
  }

  const rounded = Math.round(converted);
  const localeMap: Record<string, string> = { INR: 'en-IN', JPY: 'ja-JP' };
  return `${cfg.symbol}${rounded.toLocaleString(localeMap[code] || 'en-US')}`;
}

export {
  type LongWeekend,
  type RegionLongWeekends,
  REGIONAL_LONG_WEEKENDS,
} from '../data/regionalWeekends';

const REGION_TZ_RULES = [
  { match: /Calcutta|Kolkata|India/, info: { currencyCode: 'INR', regionCode: 'IN', countryName: 'India' } },
  { match: /London/, info: { currencyCode: 'GBP', regionCode: 'EU', countryName: 'United Kingdom' } },
  { match: /Berlin|Paris|Rome|Madrid|Amsterdam/, info: { currencyCode: 'EUR', regionCode: 'EU', countryName: 'European Union' } },
  { match: /Tokyo/, info: { currencyCode: 'JPY', regionCode: 'GLOBAL', countryName: 'Japan' } },
  { match: /Sydney|Melbourne/, info: { currencyCode: 'AUD', regionCode: 'GLOBAL', countryName: 'Australia' } },
  { match: /Toronto|Vancouver/, info: { currencyCode: 'CAD', regionCode: 'US', countryName: 'Canada' } },
  { match: /Dubai/, info: { currencyCode: 'AED', regionCode: 'GLOBAL', countryName: 'United Arab Emirates' } },
  { match: /Singapore/, info: { currencyCode: 'SGD', regionCode: 'GLOBAL', countryName: 'Singapore' } },
  { match: /Zurich|Geneva/, info: { currencyCode: 'CHF', regionCode: 'EU', countryName: 'Switzerland' } },
];

export function detectUserRegion(): { currencyCode: string; regionCode: string; countryName: string } {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const found = REGION_TZ_RULES.find((r) => r.match.test(tz));
    return found ? found.info : { currencyCode: 'USD', regionCode: 'US', countryName: 'United States' };
  } catch {
    return { currencyCode: 'USD', regionCode: 'US', countryName: 'United States' };
  }
}
