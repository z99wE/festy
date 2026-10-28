import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  MapPin, 
  Users, 
  Sparkles, 
  TrendingUp, 
  Camera, 
  Utensils, 
  Building, 
  Music, 
  Palette, 
  ShieldCheck, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { SUPPORTED_CURRENCIES } from '../utils/currency';

export interface RegionalMarketProfile {
  id: string;
  name: string;
  country: string;
  baseCurrencyCode: string;
  baseCurrencySymbol: string;
  flag: string;
  pppMultiplier: number; // Purchasing Power relative to US baseline
  caterCostPerHeadBase: number; // In local currency
  photoVideoBase: number; // In local currency
  venueRentalBase: number; // In local currency
  entertainmentBase: number; // In local currency
  decorFloralBase: number; // In local currency
  logisticsBase: number; // In local currency
  marketInsight: string;
  photoInsight: string;
  taxServiceNotes: string;
}

export const REGIONAL_MARKETS: RegionalMarketProfile[] = [
  {
    id: 'us_metro',
    name: 'US Tier-1 Metro (NYC, SF, LA, Miami)',
    country: 'United States',
    baseCurrencyCode: 'USD',
    baseCurrencySymbol: '$',
    flag: '🇺🇸',
    pppMultiplier: 1.0,
    caterCostPerHeadBase: 165,
    photoVideoBase: 4800,
    venueRentalBase: 6500,
    entertainmentBase: 2800,
    decorFloralBase: 4200,
    logisticsBase: 1500,
    marketInsight: 'High real estate overhead and mandatory 22-25% administrative service fees on hospitality lines.',
    photoInsight: 'Solo lead photographer + secondary shooter (8-10 hours coverage, digital proofs, licensing included).',
    taxServiceNotes: 'Expect 8.875% sales tax plus 22% venue service gratuity billed on all food & beverage.',
  },
  {
    id: 'us_regional',
    name: 'US Regional (Austin, Denver, Atlanta, Chicago Suburb)',
    country: 'United States',
    baseCurrencyCode: 'USD',
    baseCurrencySymbol: '$',
    flag: '🇺🇸',
    pppMultiplier: 0.82,
    caterCostPerHeadBase: 110,
    photoVideoBase: 3400,
    venueRentalBase: 4200,
    entertainmentBase: 1900,
    decorFloralBase: 2800,
    logisticsBase: 1100,
    marketInsight: 'Balanced vendor marketplace with competitive rental packages and independent artisanal catering.',
    photoInsight: 'Professional photographer (8 hours coverage with highlight gallery and high-res print rights).',
    taxServiceNotes: 'Standard 7-9% local tax plus 18-20% standard caterer service staffing fee.',
  },
  {
    id: 'uk_london',
    name: 'United Kingdom (London & Home Counties)',
    country: 'United Kingdom',
    baseCurrencyCode: 'GBP',
    baseCurrencySymbol: '£',
    flag: '🇬🇧',
    pppMultiplier: 0.95,
    caterCostPerHeadBase: 95,
    photoVideoBase: 2600,
    venueRentalBase: 4200,
    entertainmentBase: 1600,
    decorFloralBase: 2400,
    logisticsBase: 900,
    marketInsight: 'Heritage country estates, strict municipal sound limits at 23:00, and mandatory 20% VAT accounting.',
    photoInsight: 'Documentary style photographer (all-day digital delivery, online guest portal).',
    taxServiceNotes: 'All quotes must clarify if 20% VAT is inclusive or added at billing.',
  },
  {
    id: 'eu_west',
    name: 'Western Europe (France, Italy, Spain Destination)',
    country: 'European Union',
    baseCurrencyCode: 'EUR',
    baseCurrencySymbol: '€',
    flag: '🇪🇺',
    pppMultiplier: 0.88,
    caterCostPerHeadBase: 120,
    photoVideoBase: 3200,
    venueRentalBase: 5500,
    entertainmentBase: 2100,
    decorFloralBase: 3100,
    logisticsBase: 1200,
    marketInsight: 'Exquisite multi-day villa buyouts, estate wine pricing advantage, and destination vendor travel riders.',
    photoInsight: 'Fine art destination photographer with drone aerial captures of villa grounds.',
    taxServiceNotes: 'TVA/IVA ranges from 10% (catering) to 22% (production rentals); tourist occupancy tax per guest night.',
  },
  {
    id: 'india_metro',
    name: 'India Tier-1 Metro (Delhi-NCR, Mumbai, Bengaluru)',
    country: 'India',
    baseCurrencyCode: 'INR',
    baseCurrencySymbol: '₹',
    flag: '🇮🇳',
    pppMultiplier: 0.28,
    caterCostPerHeadBase: 2600,
    photoVideoBase: 180000,
    venueRentalBase: 320000,
    entertainmentBase: 95000,
    decorFloralBase: 250000,
    logisticsBase: 65000,
    marketInsight: 'Grand-scale hospitality with multi-course live counters; labor-intensive custom scenography and drapery.',
    photoInsight: '4-person cinematic crew (2 candid photographers + 2 cinematographers, crane/drone footage, 4K teaser reel).',
    taxServiceNotes: '18% GST applicable on production & hospitality services; input tax credit recoverable on corporate invoices.',
  },
  {
    id: 'india_destination',
    name: 'India Heritage Destination (Udaipur, Jaipur, Goa)',
    country: 'India',
    baseCurrencyCode: 'INR',
    baseCurrencySymbol: '₹',
    flag: '🇮🇳',
    pppMultiplier: 0.35,
    caterCostPerHeadBase: 3800,
    photoVideoBase: 260000,
    venueRentalBase: 650000,
    entertainmentBase: 140000,
    decorFloralBase: 420000,
    logisticsBase: 110000,
    marketInsight: 'Palace or beachfront exclusivity buyouts with live traditional instrumentalists and sunset heritage lawns.',
    photoInsight: 'Full multi-day wedding production house with same-day-edit video reel and pre-event concept shoot.',
    taxServiceNotes: 'Heritage cess plus 18% GST; mandatory sound licenses (PPL & IPRS) for commercial tracks.',
  },
  {
    id: 'japan_tokyo',
    name: 'Japan (Tokyo & Kyoto)',
    country: 'Japan',
    baseCurrencyCode: 'JPY',
    baseCurrencySymbol: '¥',
    flag: '🇯🇵',
    pppMultiplier: 0.72,
    caterCostPerHeadBase: 24000,
    photoVideoBase: 380000,
    venueRentalBase: 550000,
    entertainmentBase: 220000,
    decorFloralBase: 320000,
    logisticsBase: 140000,
    marketInsight: 'Meticulous Japanese banquet precision, all-inclusive ceremonial packages, and zero tipping culture.',
    photoInsight: 'Studio-trained photographer adhering to formal Japanese framing, photobook binding included.',
    taxServiceNotes: '10% consumption tax included; zero service tip expected or accepted.',
  },
  {
    id: 'southeast_asia',
    name: 'Southeast Asia Destination (Bali, Phuket)',
    country: 'Indonesia / Thailand',
    baseCurrencyCode: 'USD',
    baseCurrencySymbol: '$',
    flag: '🇮🇩',
    pppMultiplier: 0.55,
    caterCostPerHeadBase: 68,
    photoVideoBase: 2100,
    venueRentalBase: 3500,
    entertainmentBase: 1100,
    decorFloralBase: 1900,
    logisticsBase: 800,
    marketInsight: 'Private clifftop villa buyouts with tropical flora installations; high excise tariff on imported champagne.',
    photoInsight: 'Boutique lifestyle and drone photographer capturing golden-hour tropical lighting.',
    taxServiceNotes: 'Government tax & service charge (often 21% "++" in Bali hotels/villas).',
  },
  {
    id: 'australia_syd',
    name: 'Australia (Sydney, Melbourne)',
    country: 'Australia',
    baseCurrencyCode: 'AUD',
    baseCurrencySymbol: 'A$',
    flag: '🇦🇺',
    pppMultiplier: 0.90,
    caterCostPerHeadBase: 155,
    photoVideoBase: 4200,
    venueRentalBase: 5800,
    entertainmentBase: 2500,
    decorFloralBase: 3600,
    logisticsBase: 1400,
    marketInsight: 'Strict weekend penalty rates for hospitality staff; outstanding local cool-climate wine portfolios.',
    photoInsight: 'Candid photojournalist with high-res digital gallery, no watermark, print license.',
    taxServiceNotes: '10% GST is legally required to be included in all domestic quotations.',
  },
  {
    id: 'uae_dubai',
    name: 'United Arab Emirates (Dubai & Abu Dhabi)',
    country: 'United Arab Emirates',
    baseCurrencyCode: 'AED',
    baseCurrencySymbol: 'AED ',
    flag: '🇦🇪',
    pppMultiplier: 0.98,
    caterCostPerHeadBase: 480,
    photoVideoBase: 15000,
    venueRentalBase: 28000,
    entertainmentBase: 9500,
    decorFloralBase: 18000,
    logisticsBase: 6000,
    marketInsight: 'High-production luxury staging with indoor climate-controlled ballrooms and grand floral architecture.',
    photoInsight: 'High-fashion editorial photographer with studio lighting setup and highlight cinema clip.',
    taxServiceNotes: '5% VAT plus mandatory municipal hotel tourism fee per ballroom booking.',
  },
];

export interface PillarProration {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  weight: number; // Abacus bead value 1 to 5
  description: string;
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

  // Pillar Abacus Bead sliders (1 = Lean/Pragmatic, 2 = Standard, 3 = Elevated, 4 = Premium, 5 = Extravagant)
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

  // Tier multiplier
  const tierMultiplier = useMemo(() => {
    switch (selectedTier) {
      case 'pragmatic': return 0.75;
      case 'curated': return 1.0;
      case 'opulent': return 1.65;
    }
  }, [selectedTier]);

  // Exchange rates from currency utils
  const getExchangeRate = (fromCode: string, toCode: string): number => {
    const fromCfg = SUPPORTED_CURRENCIES.find((c) => c.code === fromCode) || { exchangeRateFromUSD: 1.0 };
    const toCfg = SUPPORTED_CURRENCIES.find((c) => c.code === toCode) || { exchangeRateFromUSD: 1.0 };
    // Conversion formula: (amount / fromCfg.exchangeRateFromUSD) * toCfg.exchangeRateFromUSD
    return toCfg.exchangeRateFromUSD / fromCfg.exchangeRateFromUSD;
  };

  const displayCurrencyConfig = useMemo(() => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === displayCurrencyCode) || SUPPORTED_CURRENCIES[0];
  }, [displayCurrencyCode]);

  // Calculate pillar costs in LOCAL currency of the market
  const localCalculations = useMemo(() => {
    // Bead weight factor: 1 -> 0.65, 2 -> 0.85, 3 -> 1.0, 4 -> 1.3, 5 -> 1.7
    const beadFactor = (val: number) => {
      switch (val) {
        case 1: return 0.65;
        case 2: return 0.85;
        case 3: return 1.0;
        case 4: return 1.35;
        case 5: return 1.8;
        default: return 1.0;
      }
    };

    const venue = currentMarket.venueRentalBase * tierMultiplier * beadFactor(pillarWeights.venue);
    const catering = (currentMarket.caterCostPerHeadBase * guestCount) * tierMultiplier * beadFactor(pillarWeights.catering);
    const photo = currentMarket.photoVideoBase * tierMultiplier * beadFactor(pillarWeights.photo);
    const entertainment = currentMarket.entertainmentBase * tierMultiplier * beadFactor(pillarWeights.entertainment);
    const decor = currentMarket.decorFloralBase * tierMultiplier * beadFactor(pillarWeights.decor);
    const logistics = currentMarket.logisticsBase * tierMultiplier * beadFactor(pillarWeights.logistics);

    const totalLocal = venue + catering + photo + entertainment + decor + logistics;
    const perGuestLocal = totalLocal / Math.max(1, guestCount);

    return {
      venue,
      catering,
      photo,
      entertainment,
      decor,
      logistics,
      totalLocal,
      perGuestLocal,
    };
  }, [currentMarket, guestCount, tierMultiplier, pillarWeights]);

  // Convert to DISPLAY currency
  const conversionRate = useMemo(() => {
    return getExchangeRate(currentMarket.baseCurrencyCode, displayCurrencyCode);
  }, [currentMarket.baseCurrencyCode, displayCurrencyCode]);

  const displayCalculations = useMemo(() => {
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

  const formatAmount = (val: number, symbol: string, code: string) => {
    if (code === 'INR') {
      return `${symbol}${val.toLocaleString('en-IN')}`;
    }
    if (code === 'JPY') {
      return `${symbol}${val.toLocaleString('ja-JP')}`;
    }
    return `${symbol}${val.toLocaleString('en-US')}`;
  };

  const handleBeadChange = (pillarId: string, newVal: number) => {
    setPillarWeights((prev) => ({
      ...prev,
      [pillarId]: newVal,
    }));
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
      {/* Header Banner */}
      <div className="abacus-header-band">
        <div className="abacus-badge">
          <TrendingUp size={14} className="abacus-badge-icon" />
          <span>Regional Market Dynamics & Economic Abacus</span>
        </div>
        <h2 id="abacus-title" className="abacus-title">
          Event Economics Abacus
        </h2>
        <p className="abacus-subtitle">
          True market valuations calibrated to local labor rates, venue square-footage norms, and vendor expectations across global celebration hubs.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="abacus-grid">
        {/* Left Column: Regional Controls & Locality Parameters */}
        <div className="abacus-control-panel">
          {/* Locality Selector */}
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

          {/* Guest Count Slider */}
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
              max={350}
              step={5}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
              className="abacus-range"
            />
            <div className="abacus-range-ticks">
              <span>Intimate (20)</span>
              <span>Mid-Size (80)</span>
              <span>Grand (200+)</span>
            </div>
          </div>

          {/* Production Tier Buttons */}
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

          {/* Target Valuation Currency Selector */}
          <div className="abacus-control-group">
            <div className="abacus-slider-header">
              <label className="abacus-control-label" htmlFor="currency-select">
                <DollarSign size={16} className="abacus-icon" />
                <span>Display Valuation In Currency</span>
              </label>
              <span className="abacus-rate-indicator">
                {currentMarket.baseCurrencyCode !== displayCurrencyCode ? (
                  <span>
                    1 {currentMarket.baseCurrencyCode} ≈ {(conversionRate).toFixed(3)} {displayCurrencyCode}
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

          {/* Regional Real-World Insights Card */}
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

        {/* Right Column: Visual Abacus Rails & Bead Sliders */}
        <div className="abacus-rails-panel">
          <div className="abacus-rails-header">
            <div>
              <h3 className="abacus-rails-title">Interactive Expense Allocation Rails</h3>
              <p className="abacus-rails-sub">
                Slide the abacus beads to weight different components of your gathering.
              </p>
            </div>
            <div className="abacus-total-snapshot">
              <span className="abacus-snapshot-label">Synthesized Valuation</span>
              <span className="abacus-snapshot-number">
                {formatAmount(displayCalculations.total, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
              </span>
              <span className="abacus-snapshot-per-head">
                {formatAmount(displayCalculations.perGuest, displayCurrencyConfig.symbol, displayCurrencyConfig.code)} / guest
              </span>
            </div>
          </div>

          {/* Abacus Rails */}
          <div className="abacus-bead-matrix">
            {/* 1. Photography & Videography */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <Camera size={16} className="abacus-pillar-icon photo" />
                  <span className="abacus-pillar-title">Photography & Cinematography</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.photo, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.photo / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Photography weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.photo >= level ? 'filled' : ''} ${pillarWeights.photo === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('photo', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Solo Shooter</span>
                <span>Dual Crew</span>
                <span>Cinema & Drone</span>
              </div>
            </div>

            {/* 2. Catering & Bar Hospitality */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <Utensils size={16} className="abacus-pillar-icon catering" />
                  <span className="abacus-pillar-title">Catering, Bar & Hospitality</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.catering, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.catering / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Catering weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.catering >= level ? 'filled' : ''} ${pillarWeights.catering === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('catering', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Buffet / Cocktail</span>
                <span>Plated 3-Course</span>
                <span>Live Chef Stations & Top-Shelf</span>
              </div>
            </div>

            {/* 3. Venue & Staging */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <Building size={16} className="abacus-pillar-icon venue" />
                  <span className="abacus-pillar-title">Venue Hire & Structural Staging</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.venue, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.venue / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Venue weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.venue >= level ? 'filled' : ''} ${pillarWeights.venue === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('venue', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Hall / Loft</span>
                <span>Private Estate / Garden</span>
                <span>Full Historic Buyout</span>
              </div>
            </div>

            {/* 4. Entertainment & Sound */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <Music size={16} className="abacus-pillar-icon entertainment" />
                  <span className="abacus-pillar-title">Acoustics, Sound & Entertainment</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.entertainment, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.entertainment / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Entertainment weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.entertainment >= level ? 'filled' : ''} ${pillarWeights.entertainment === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('entertainment', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Curated DJ & PA</span>
                <span>Live Quartet / Trio</span>
                <span>Headline Band & Show Lighting</span>
              </div>
            </div>

            {/* 5. Decor & Scenography */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <Palette size={16} className="abacus-pillar-icon decor" />
                  <span className="abacus-pillar-title">Floral, Scenography & Custom Decor</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.decor, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.decor / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Decor weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.decor >= level ? 'filled' : ''} ${pillarWeights.decor === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('decor', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Minimalist Greenery</span>
                <span>Floral Centerpieces</span>
                <span>Full Immersive Fabrication</span>
              </div>
            </div>

            {/* 6. Contingency, Permits & Security */}
            <div className="abacus-rail-item">
              <div className="abacus-rail-meta">
                <div className="abacus-rail-name-group">
                  <ShieldCheck size={16} className="abacus-pillar-icon logistics" />
                  <span className="abacus-pillar-title">Permits, Sound Escrow & Contingency</span>
                </div>
                <div className="abacus-rail-valuation">
                  <span className="abacus-rail-figure">
                    {formatAmount(displayCalculations.logistics, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}
                  </span>
                  <span className="abacus-rail-pct">
                    {Math.round((displayCalculations.logistics / displayCalculations.total) * 100)}%
                  </span>
                </div>
              </div>
              <div className="abacus-rail-track">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`Set Logistics weight to ${level}`}
                    className={`abacus-bead ${pillarWeights.logistics >= level ? 'filled' : ''} ${pillarWeights.logistics === level ? 'active-bead' : ''}`}
                    onClick={() => handleBeadChange('logistics', level)}
                  >
                    <span className="abacus-bead-core" />
                  </button>
                ))}
              </div>
              <div className="abacus-rail-legend">
                <span>Standard Escrow (5%)</span>
                <span>Permits & Insurance (10%)</span>
                <span>Full Safety Buffer (18%)</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="abacus-actions-row">
            <div className="abacus-local-reference">
              <span className="abacus-local-ref-label">Local Origin Equivalent:</span>
              <span className="abacus-local-ref-value">
                {formatAmount(localCalculations.totalLocal, currentMarket.baseCurrencySymbol, currentMarket.baseCurrencyCode)}
                {' '}in {currentMarket.country}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary abacus-apply-btn"
              aria-label="Apply valuation to event workspace"
              onClick={handleApply}
            >
              <span>Apply Valuation to Event Workspace</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Applied Confirmation Toast */}
          {showAppliedToast && (
            <div className="abacus-toast-alert" role="status">
              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
              <span>
                Valuation for <strong>{currentMarket.name}</strong> ({formatAmount(displayCalculations.total, displayCurrencyConfig.symbol, displayCurrencyConfig.code)}) transferred to active workspace!
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
