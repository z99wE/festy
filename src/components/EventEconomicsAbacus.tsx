import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  MapPin,
  Users,
  Sparkles,
  Camera,
  Info,
} from 'lucide-react';
import { SUPPORTED_CURRENCIES, getExchangeRate, useLiveRates } from '../utils/currency';
import { REGIONAL_MARKETS } from '../data/marketEconomicsData';
import type { RegionalMarketProfile } from '../data/marketEconomicsData';
import { AbacusRailsPanel } from './AbacusRailsPanel';
import type { AbacusDisplayCalculations } from './AbacusRailsPanel';

export { REGIONAL_MARKETS };
export type { RegionalMarketProfile };

export interface PillarProration {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  weight: number;
  description: string;
}

const TIER_FACTORS: Record<string, number> = {
  pragmatic: 0.75,
  curated: 1.0,
  opulent: 1.65,
};

const BEAD_FACTORS: Record<number, number> = {
  1: 0.65,
  2: 0.85,
  3: 1.0,
  4: 1.35,
  5: 1.8,
};

function formatAmount(val: number, symbol: string, code: string): string {
  if (code === 'INR') {
    return `${symbol}${val.toLocaleString('en-IN')}`;
  }
  if (code === 'JPY') {
    return `${symbol}${val.toLocaleString('ja-JP')}`;
  }
  return `${symbol}${val.toLocaleString('en-US')}`;
}

export const EventEconomicsAbacus: React.FC<{
  onApplyToWorkspace?: (estimateSummary: {
    regionName: string;
    totalDisplayAmount: number;
    displayCurrency: string;
    guestCount: number;
    perGuestCost: number;
  }) => void;
}> = ({ onApplyToWorkspace }) => {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('us_metro');
  const [guestCount, setGuestCount] = useState<number>(85);
  const [selectedTier, setSelectedTier] = useState<'pragmatic' | 'curated' | 'opulent'>('curated');
  const [displayCurrencyCode, setDisplayCurrencyCode] = useState<string>('USD');
  const [showAppliedToast, setShowAppliedToast] = useState(false);

  const liveRates = useLiveRates();

  const [pillarWeights, setPillarWeights] = useState<Record<string, number>>({
    venue: 3,
    catering: 3,
    photo: 3,
    entertainment: 3,
    decor: 3,
    logistics: 2,
  });

  const currentMarket = useMemo(() => {
    return REGIONAL_MARKETS.find((m) => m.id === selectedMarketId) || REGIONAL_MARKETS[0];
  }, [selectedMarketId]);

  const tierMultiplier = TIER_FACTORS[selectedTier] ?? 1.0;

  const displayCurrencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === displayCurrencyCode) || SUPPORTED_CURRENCIES[0];
  }, [displayCurrencyCode]);

  const localCalculations = useMemo(() => {
    const venue = currentMarket.venueRentalBase * tierMultiplier * (BEAD_FACTORS[pillarWeights.venue] ?? 1.0);
    const catering = currentMarket.caterCostPerHeadBase * guestCount * tierMultiplier * (BEAD_FACTORS[pillarWeights.catering] ?? 1.0);
    const photo = currentMarket.photoVideoBase * tierMultiplier * (BEAD_FACTORS[pillarWeights.photo] ?? 1.0);
    const entertainment = currentMarket.entertainmentBase * tierMultiplier * (BEAD_FACTORS[pillarWeights.entertainment] ?? 1.0);
    const decor = currentMarket.decorFloralBase * tierMultiplier * (BEAD_FACTORS[pillarWeights.decor] ?? 1.0);
    const logistics = currentMarket.logisticsBase * tierMultiplier * (BEAD_FACTORS[pillarWeights.logistics] ?? 1.0);

    const totalLocal = venue + catering + photo + entertainment + decor + logistics;
    const perGuestLocal = totalLocal / Math.max(1, guestCount);

    return { venue, catering, photo, entertainment, decor, logistics, totalLocal, perGuestLocal };
  }, [currentMarket, guestCount, tierMultiplier, pillarWeights]);

  const conversionRate = useMemo(() => {
    return getExchangeRate(currentMarket.baseCurrencyCode, displayCurrencyCode);
  }, [currentMarket.baseCurrencyCode, displayCurrencyCode, liveRates]);

  const displayCalculations: AbacusDisplayCalculations = useMemo(() => {
    const rate = conversionRate;
    return {
      venue: Math.round(localCalculations.venue * rate),
      catering: Math.round(localCalculations.catering * rate),
      photo: Math.round(localCalculations.photo * rate),
      entertainment: Math.round(localCalculations.entertainment * rate),
      decor: Math.round(localCalculations.decor * rate),
      logistics: Math.round(localCalculations.logistics * rate),
      total: Math.round(localCalculations.totalLocal * rate),
      perGuest: Math.round(localCalculations.perGuestLocal * rate),
    };
  }, [localCalculations, conversionRate]);

  const handleBeadChange = (pillarId: string, newVal: number) => {
    setPillarWeights((prev) => ({ ...prev, [pillarId]: newVal }));
  };

  const handleApply = () => {
    if (onApplyToWorkspace) {
      onApplyToWorkspace({
        regionName: currentMarket.name,
        totalDisplayAmount: displayCalculations.total,
        displayCurrency: displayCurrencyCode,
        guestCount,
        perGuestCost: displayCalculations.perGuest,
      });
    }
    setShowAppliedToast(true);
    setTimeout(() => setShowAppliedToast(false), 4000);
  };

  return (
    <section className="abacus-container" id="event-economics-abacus" aria-labelledby="abacus-title">
      <div className="abacus-header-band">
        <h2 id="abacus-title" className="abacus-title">
          Event Economics Abacus
        </h2>
        <p className="abacus-subtitle">
          True market valuations calibrated to local labor rates, venue square-footage norms, and vendor expectations across global celebration hubs.
        </p>
      </div>

      <div className="abacus-grid">
        <div className="abacus-control-panel">
          <div className="abacus-control-group">
            <label className="abacus-control-label" htmlFor="locality-select">
              <MapPin size={16} className="abacus-icon" />
              <span>Event Destination Locality</span>
            </label>
            <select
              id="locality-select"
              className="abacus-select"
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(e.target.value)}
            >
              {REGIONAL_MARKETS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.flag} {m.name} ({m.baseCurrencyCode})
                </option>
              ))}
            </select>
          </div>

          <div className="abacus-control-group">
            <div className="abacus-slider-header">
              <label className="abacus-control-label" htmlFor="guest-slider">
                <Users size={16} className="abacus-icon" />
                <span>Guest Count</span>
              </label>
              <span className="abacus-count-pill">{guestCount} Guests</span>
            </div>
            <input
              id="guest-slider"
              type="range"
              min={15}
              max={1000}
              step={5}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
              className="abacus-range"
            />
            <div className="abacus-range-ticks">
              <span>Intimate (20)</span>
              <span>Mid-Size (150)</span>
              <span>Grand (500)</span>
              <span>Mega Festival (1,000)</span>
            </div>
          </div>

          <div className="abacus-control-group">
            <label className="abacus-control-label">
              <Sparkles size={16} className="abacus-icon" />
              <span>Production Tier</span>
            </label>
            <div className="abacus-tier-toggle-row">
              <button
                type="button"
                aria-label="Select Pragmatic Base tier"
                className={`abacus-tier-btn ${selectedTier === 'pragmatic' ? 'active' : ''}`}
                onClick={() => setSelectedTier('pragmatic')}
              >
                Pragmatic Base
              </button>
              <button
                type="button"
                aria-label="Select Curated Premium tier"
                className={`abacus-tier-btn ${selectedTier === 'curated' ? 'active' : ''}`}
                onClick={() => setSelectedTier('curated')}
              >
                Curated Premium
              </button>
              <button
                type="button"
                aria-label="Select Opulent Showcase tier"
                className={`abacus-tier-btn ${selectedTier === 'opulent' ? 'active' : ''}`}
                onClick={() => setSelectedTier('opulent')}
              >
                Opulent Showcase
              </button>
            </div>
          </div>

          <div className="abacus-control-group">
            <div className="abacus-slider-header">
              <label className="abacus-control-label" htmlFor="currency-select">
                <DollarSign size={16} className="abacus-icon" />
                <span>Display Valuation In Currency</span>
              </label>
              <span className="abacus-rate-indicator">
                {currentMarket.baseCurrencyCode !== displayCurrencyCode ? (
                  <span>
                    {conversionRate >= 1
                      ? `1 ${currentMarket.baseCurrencyCode} ≈ ${displayCurrencyConfig.symbol}${conversionRate.toFixed(2)} ${displayCurrencyCode}`
                      : `1 ${displayCurrencyCode} ≈ ${currentMarket.baseCurrencySymbol}${(1 / conversionRate).toFixed(2)} ${currentMarket.baseCurrencyCode}`}
                  </span>
                ) : (
                  <span>Local Base Match</span>
                )}
              </span>
            </div>
            <select
              id="currency-select"
              className="abacus-select"
              value={displayCurrencyCode}
              onChange={(e) => setDisplayCurrencyCode(e.target.value)}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {c.name} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="abacus-regional-intel">
            <div className="abacus-intel-header">
              <Info size={15} style={{ color: 'var(--coral-pop, #ff6b4a)' }} />
              <span className="abacus-intel-title">Regional Labor & Vendor Reality</span>
            </div>
            <p className="abacus-intel-text">{currentMarket.marketInsight}</p>
            
            <div className="abacus-intel-photo-callout">
              <Camera size={14} style={{ color: '#059669', flexShrink: 0 }} />
              <span>{currentMarket.photoInsight}</span>
            </div>

            <div className="abacus-intel-footer-note">
              <span>{currentMarket.taxServiceNotes}</span>
            </div>
          </div>
        </div>

        <AbacusRailsPanel
          pillarWeights={pillarWeights}
          onBeadChange={handleBeadChange}
          displayCalculations={displayCalculations}
          localCalculations={localCalculations}
          currentMarket={currentMarket}
          displayCurrencyConfig={displayCurrencyConfig}
          formatAmount={formatAmount}
          onApply={handleApply}
          showAppliedToast={showAppliedToast}
        />
      </div>
    </section>
  );
};
