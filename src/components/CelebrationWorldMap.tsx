import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ArrowRight,
  Search,
  MessageSquare,
  Users,
  X,
  MapPin,
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { playPopSound } from '../utils/audio';
import { openFestiAIChat } from './FestiChatbot';
import type { EventPlanningContext } from '../data/globalCelebrations';

export interface WorldCelebrationPin {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  region: 'Americas' | 'Europe' | 'Asia & Pacific' | 'Middle East & Africa';
  dates: string;
  month: string;
  daysUntil: number;
  estBudgetUSD: number;
  guestRange: string;
  categoryKey: string;
  categoryLabel: string;
  tagline: string;
  logisticsHighlight: string;
  lat: number;
  lon: number;
  color: string;
  aiPrompt: string;
  image?: string;
}

export const WORLD_CELEBRATION_PINS: WorldCelebrationPin[] = [
  {
    id: 'rio_carnival',
    name: 'Rio Carnival Spectacular',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    dates: 'Feb 12 – Feb 17, 2027',
    month: 'February 2027',
    daysUntil: 108,
    estBudgetUSD: 24000,
    guestRange: '150–500 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music & Street Festivals',
    tagline: 'Samba pavilions, feijoada banquets & sunset seaside parades',
    logisticsHighlight: 'Acoustic containment barriers needed for live batucada percussion bands past 2:00 AM.',
    lat: -22.9,
    lon: -43.1,
    color: '#FF5E1E',
    aiPrompt: 'Plan a vibrant Rio Carnival celebration with Brazilian churrasco catering, samba band timelines, and costume staging lounges.',
    image: '/festivals/rio-carnival.webp',
  },
  {
    id: 'diwali_delhi',
    name: 'Diwali Festival of Lights',
    location: 'New Delhi & Jaipur',
    country: 'India',
    flag: '🇮🇳',
    region: 'Asia & Pacific',
    dates: 'Oct 31 – Nov 4, 2026',
    month: 'November 2026',
    daysUntil: 18,
    estBudgetUSD: 18500,
    guestRange: '250–600 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Illuminated Diya courtyards, floral rangoli & royal sweets banquets',
    logisticsHighlight: 'Requires certified fire marshal review for outdoor sparklers and 48-hr ghee lamp vendor permits.',
    lat: 28.6,
    lon: 77.2,
    color: '#E04E15',
    aiPrompt: 'Generate a royal Diwali gala blueprint with courtyard lighting layouts, 5-course artisanal vegetarian menus, and sparkler safety protocols.',
    image: '/festivals/holi-festival.webp',
  },
  {
    id: 'hanami_kyoto',
    name: 'Hanami Cherry Blossom Gala',
    location: 'Kyoto & Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    region: 'Asia & Pacific',
    dates: 'Mar 25 – Apr 2, 2027',
    month: 'March 2027',
    daysUntil: 148,
    estBudgetUSD: 14500,
    guestRange: '80–200 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Night Sakura canopy, wagashi dessert tasting & sake sommelier flights',
    logisticsHighlight: 'Park picnic zoning permits must be booked 90 days ahead; requires zero-waste pack-out protocol.',
    lat: 35.0,
    lon: 135.7,
    color: '#E11D48',
    aiPrompt: 'Design a serene Hanami cherry blossom event with illuminated night Sakura trees, sake tasting flights, and zero-waste bento catering.',
    image: '/festivals/kyoto-lanterns.webp',
  },
  {
    id: 'venice_carnival',
    name: 'Carnival & Historical Regatta',
    location: 'Venice',
    country: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    dates: 'Feb 20 – Mar 2, 2027',
    month: 'February 2027',
    daysUntil: 115,
    estBudgetUSD: 22000,
    guestRange: '100–300 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Grand Canal gondola processions & candlelit palazzo masquerade balls',
    logisticsHighlight: 'Water taxi charter permits and tidal surge (Acqua Alta) emergency gangways required for palazzo entrances.',
    lat: 45.4,
    lon: 12.3,
    color: '#5B42F3',
    aiPrompt: 'Architect an authentic Venetian masquerade ball inside a historic palazzo with chamber music, wine pairings, and gondola arrival schedules.',
    image: '/festivals/venice-masquerade.webp',
  },
  {
    id: 'midsummer_uk',
    name: 'Midsummer Solstice Gathering',
    location: 'Somerset & Wiltshire',
    country: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    dates: 'Jun 18 – Jun 22, 2027',
    month: 'June 2027',
    daysUntil: 234,
    estBudgetUSD: 16800,
    guestRange: '150–400 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music Festivals',
    tagline: 'Wildflower meadows, solar acoustic stages & artisanal cider bars',
    logisticsHighlight: 'Temporary field power generators must comply with eco-friendly biodiesel noise dampening guidelines.',
    lat: 51.1,
    lon: -2.7,
    color: '#10B981',
    aiPrompt: 'Build a 4-day Midsummer Solstice celebration with wildflower crown workshops, organic cider bars, and sunset acoustic timelines.',
  },
  {
    id: 'sydney_nye',
    name: 'Harbour Midnight Gala',
    location: 'Sydney Harbour',
    country: 'Australia',
    flag: '🇦🇺',
    region: 'Asia & Pacific',
    dates: 'Dec 31, 2026 – Jan 3, 2027',
    month: 'December 2026',
    daysUntil: 65,
    estBudgetUSD: 29500,
    guestRange: '200–800 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Rooftop champagne, synchronized pyrotechnics & midnight countdowns',
    logisticsHighlight: 'Harbour waterfront maritime authority permits and load-in freight elevator bookings required 60 days prior.',
    lat: -33.8,
    lon: 151.2,
    color: '#F59E0B',
    aiPrompt: 'Design an ultra-luxurious New Year rooftop ball overlooking Sydney Harbour with synchronized countdown lighting and seafood bar logistics.',
  },
  {
    id: 'oaxaca_dead',
    name: 'Día de los Muertos & Mezcal Tastings',
    location: 'Oaxaca & Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    region: 'Americas',
    dates: 'Oct 31 – Nov 3, 2026',
    month: 'November 2026',
    daysUntil: 18,
    estBudgetUSD: 12500,
    guestRange: '80–250 Guests',
    categoryKey: 'wine_tasting',
    categoryLabel: 'Private Tastings',
    tagline: 'Cempasúchil marigold arches, copal incense, mole tasting flights & artisanal mezcal',
    logisticsHighlight: 'Secure local culinary masters for traditional slow-cooked moles 30 days ahead; open flame candle zoning permits.',
    lat: 17.0,
    lon: -96.7,
    color: '#EA580C',
    aiPrompt: 'Create a heartfelt Día de los Muertos culinary gathering with 7-mole tasting flights, marigold table runners, and artisanal mezcal sommelier pairings.',
  },
  {
    id: 'nola_mardi_gras',
    name: 'Mardi Gras & Brass Heritage Gala',
    location: 'New Orleans',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    dates: 'Feb 5 – Feb 9, 2027',
    month: 'February 2027',
    daysUntil: 100,
    estBudgetUSD: 15000,
    guestRange: '120–350 Guests',
    categoryKey: 'festival',
    categoryLabel: 'Music Festivals',
    tagline: 'French Quarter second-line brass, crawfish boils & beignet brunches',
    logisticsHighlight: 'Second-line parade police escort permits must be registered with the New Orleans Police Department 45 days prior.',
    lat: 29.9,
    lon: -90.0,
    color: '#8B5CF6',
    aiPrompt: 'Plan an electric New Orleans Mardi Gras weekend with private balcony access, authentic brass band parade pacing, and Cajun seafood catering.',
  },
  {
    id: 'vienna_ball',
    name: 'Imperial Opera Ball & Banquet',
    location: 'Vienna',
    country: 'Austria',
    flag: '🇦🇹',
    region: 'Europe',
    dates: 'Feb 11 – Feb 14, 2027',
    month: 'February 2027',
    daysUntil: 107,
    estBudgetUSD: 26000,
    guestRange: '150–400 Guests',
    categoryKey: 'wedding',
    categoryLabel: 'Luxury Weddings',
    tagline: 'Habsburg state rooms, white-tie waltzes, Sachertorte banquets & midnight quadrilles',
    logisticsHighlight: 'White-tie dress code verification concierge and antique parquet dance floor protection insurance mandatory.',
    lat: 48.2,
    lon: 16.3,
    color: '#6366F1',
    aiPrompt: 'Generate a royal Viennese waltz celebration master plan with string orchestra riders, white-tie protocols, and multi-course Austrian pastry stations.',
  },
  {
    id: 'songkran_thai',
    name: 'Songkran Water Blessing Festival',
    location: 'Chiang Mai & Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    region: 'Asia & Pacific',
    dates: 'Apr 13 – Apr 16, 2027',
    month: 'April 2027',
    daysUntil: 168,
    estBudgetUSD: 13200,
    guestRange: '100–350 Guests',
    categoryKey: 'cultural_fest',
    categoryLabel: 'Heritage Festivals',
    tagline: 'Jasmine scented water blessing ceremonies, night markets & tropical DJ stages',
    logisticsHighlight: 'IP68 waterproof cabling for all electrical equipment and high-flow clean water storage bowsers.',
    lat: 18.7,
    lon: 98.9,
    color: '#06B6D4',
    aiPrompt: 'Design a Songkran tropical holiday celebration balancing traditional water blessing rituals with energetic poolside evening music festivals.',
  },
  {
    id: 'thanksgiving_ny',
    name: 'Thanksgiving Starlight Harvest Banquet',
    location: 'Hudson Valley & New York',
    country: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    dates: 'Nov 26 – Nov 29, 2026',
    month: 'November 2026',
    daysUntil: 29,
    estBudgetUSD: 11000,
    guestRange: '60–180 Guests',
    categoryKey: 'birthday',
    categoryLabel: 'Milestone Birthdays',
    tagline: 'Farm-to-table roast feasts, artisanal mulled cider & starlight heated marquees',
    logisticsHighlight: 'Lock heritage turkey and roast orders 45 days prior; arrange heated outdoor dining marquee with thermal windbreakers.',
    lat: 41.7,
    lon: -73.9,
    color: '#D97706',
    aiPrompt: 'Plan an unforgettable 4-day Thanksgiving family and alumni reunion with harvest menus, cozy seating layouts, and run-of-show schedule.',
  },
  {
    id: 'seville_feria',
    name: 'Feria de Abril & Flamenco Fiesta',
    location: 'Seville',
    country: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    dates: 'Apr 20 – Apr 25, 2027',
    month: 'April 2027',
    daysUntil: 174,
    estBudgetUSD: 19000,
    guestRange: '100–300 Guests',
    categoryKey: 'wedding',
    categoryLabel: 'Luxury Weddings',
    tagline: 'Striped caseta pavilions, Manzanilla sherry, flamenco guitars & paper lanterns',
    logisticsHighlight: 'Municipal fairground caseta access badges and private equestrian carriage permits require 90-day booking lead.',
    lat: 37.3,
    lon: -5.9,
    color: '#EF4444',
    aiPrompt: 'Architect a Spanish Feria celebration with authentic private caseta layouts, tapas catering, flamenco performers, and late-night churros.',
  },
];

interface CelebrationWorldMapProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (
    occasionId: string,
    eventName: string,
    context?: EventPlanningContext
  ) => void;
}

export const CelebrationWorldMap: React.FC<CelebrationWorldMapProps> = ({
  currentCurrency = 'USD',
  onSelectEventForPlanner,
}) => {
  const [activePinId, setActivePinId] = useState<string>(WORLD_CELEBRATION_PINS[0].id);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(true);

  const filteredPins = useMemo(() => {
    return WORLD_CELEBRATION_PINS.filter((pin) => {
      const matchRegion = selectedRegion === 'All' || pin.region === selectedRegion;
      const matchSearch =
        !searchQuery.trim() ||
        pin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pin.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [selectedRegion, searchQuery]);

  const activePin = useMemo(() => {
    return (
      WORLD_CELEBRATION_PINS.find((p) => p.id === activePinId) ||
      filteredPins[0] ||
      WORLD_CELEBRATION_PINS[0]
    );
  }, [activePinId, filteredPins]);

  // Convert (lat, lon) to SVG (x, y) on 920x460 map
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 920;
    const y = ((90 - lat) / 180) * 460;
    return { x, y };
  };

  const activeCoords = projectCoords(activePin.lat, activePin.lon);

  const handleSelectPin = (pin: WorldCelebrationPin) => {
    playPopSound(false);
    setActivePinId(pin.id);
    setIsPopupOpen(true);
  };

  const handlePlanThisEvent = () => {
    onSelectEventForPlanner(activePin.categoryKey, activePin.name, {
      id: activePin.id,
      name: activePin.name,
      category: activePin.categoryKey,
      location: activePin.location,
      dates: activePin.dates,
      budgetUSD: activePin.estBudgetUSD,
      guestRange: activePin.guestRange,
      theme: activePin.tagline,
      logisticsHighlight: activePin.logisticsHighlight,
      aiPrompt: activePin.aiPrompt,
    });
  };

  return (
    <section className="celebration-world-section" aria-labelledby="world-map-title">
      <div className="celebration-world-card">
        {/* SECTION HEADER (Clean & icon/eyebrow-free) */}
        <div className="celebration-world-header">
          <div>
            <h2 id="world-map-title" className="celebration-world-title">
              Global Celebrations &amp; Long Weekend Escapes
            </h2>
            <p className="celebration-world-subtitle">
              Explore iconic cultural festivals, solstice gatherings, and milestone long weekends mapped across the world. Tap any pin to see what's happening.
            </p>
          </div>
        </div>

        {/* REGION FILTER BAR */}
        <div className="celebration-filter-bar">
          <div className="region-pills" role="tablist" aria-label="Filter by region">
            {['All', 'Americas', 'Europe', 'Asia & Pacific'].map((r) => (
              <button
                key={r}
                type="button"
                className={`region-pill-btn ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => setSelectedRegion(r)}
                role="tab"
                aria-selected={selectedRegion === r}
              >
                <span>{r === 'All' ? 'All Regions (12)' : r}</span>
              </button>
            ))}
          </div>

          <div className="celebration-search-wrap">
            <Search size={15} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="celebration-search-input"
              placeholder="Search city, country, or celebration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search celebration destination"
            />
          </div>
        </div>

        {/* MAIN VISUAL CANVAS & DOSSIER GRID */}
        <div className="celebration-grid-body">
          {/* LEFT: CELEBRATORY INTERACTIVE SVG MAP */}
          <div className="celebration-visual-canvas">
            <div className="svg-map-wrapper">
              <svg
                viewBox="0 0 920 460"
                className="celebration-svg-map"
                role="img"
                aria-label="Interactive Celebration World Map"
              >
                <defs>
                  <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FAF6EF" />
                    <stop offset="100%" stopColor="#F5EFE3" />
                  </linearGradient>
                  <filter id="beaconGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>

                {/* Ocean Canvas */}
                <rect width="920" height="460" rx="16" fill="url(#oceanGrad)" />

                {/* Latitude / Longitude Delicate Grid Arcs */}
                <g stroke="#E7DDCD" strokeWidth="0.75" strokeDasharray="3 3">
                  <line x1="0" y1="115" x2="920" y2="115" />
                  <line x1="0" y1="230" x2="920" y2="230" stroke="#DECFA9" strokeWidth="1" strokeDasharray="none" />
                  <line x1="0" y1="345" x2="920" y2="345" />
                  <line x1="230" y1="0" x2="230" y2="460" />
                  <line x1="460" y1="0" x2="460" y2="460" stroke="#DECFA9" strokeWidth="1" strokeDasharray="none" />
                  <line x1="690" y1="0" x2="690" y2="460" />
                </g>

                {/* Stylized Warm Continent Silhouettes */}
                <g fill="#EADBC6" stroke="#DFCDAF" strokeWidth="1" opacity="0.95">
                  {/* North America */}
                  <path d="M 110,60 Q 200,50 270,70 Q 320,110 290,180 Q 230,220 180,240 Q 140,200 120,140 Z" />
                  {/* Central America & Caribbean */}
                  <path d="M 180,240 Q 220,260 250,285 Q 220,300 190,270 Z" />
                  {/* South America */}
                  <path d="M 240,290 Q 340,310 350,380 Q 310,430 270,440 Q 230,370 240,290 Z" />
                  {/* Europe & Scandinavia */}
                  <path d="M 450,70 Q 520,60 550,110 Q 510,160 460,165 Q 430,130 450,70 Z" />
                  {/* British Isles */}
                  <circle cx="445" cy="115" r="14" />
                  {/* Africa */}
                  <path d="M 455,175 Q 570,180 570,270 Q 540,380 490,390 Q 440,300 455,175 Z" />
                  {/* Asia */}
                  <path d="M 540,70 Q 750,55 830,110 Q 820,230 730,250 Q 640,220 540,150 Z" />
                  {/* Indian Subcontinent */}
                  <path d="M 660,200 Q 720,220 700,280 Q 670,280 660,200 Z" />
                  {/* Japan & East Asian Isles */}
                  <ellipse cx="800" cy="160" rx="14" ry="24" transform="rotate(25 800 160)" />
                  {/* Southeast Asia */}
                  <path d="M 720,250 Q 760,270 750,310 Q 720,310 720,250 Z" />
                  {/* Australia & New Zealand */}
                  <path d="M 740,330 Q 840,320 860,380 Q 810,420 740,390 Z" />
                  <ellipse cx="885" cy="410" rx="8" ry="18" transform="rotate(-20 885 410)" />
                </g>

                {/* Celebration Interactive Destination Pins */}
                {filteredPins.map((pin) => {
                  const { x, y } = projectCoords(pin.lat, pin.lon);
                  const isSelected = activePin.id === pin.id;
                  return (
                    <g
                      key={pin.id}
                      className="map-pin-group"
                      onClick={() => handleSelectPin(pin)}
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${pin.name} in ${pin.location}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSelectPin(pin);
                        }
                      }}
                    >
                      {/* Generous Invisible Touch Target for Easy Mobile Tapping */}
                      <circle cx={x} cy={y} r={24} fill="transparent" />

                      {/* Gentle Pulsing Ring (Zero confetti, warm celebratory glow) */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 20 : 11}
                        fill={pin.color}
                        opacity={isSelected ? 0.38 : 0.2}
                        className={isSelected ? 'pin-active-pulse' : ''}
                      />

                      {/* Outer Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 9 : 6}
                        fill="#FFFFFF"
                        stroke={pin.color}
                        strokeWidth={isSelected ? 3.5 : 2}
                        filter="url(#beaconGlow)"
                      />

                      {/* Center Dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 4.5 : 3}
                        fill={pin.color}
                      />

                      {/* Compact city tag below pin if active */}
                      {isSelected && (
                        <g transform={`translate(${x}, ${y + 16})`}>
                          <rect
                            x="-50"
                            y="0"
                            width="100"
                            height="18"
                            rx="9"
                            fill="#2B1B17"
                            opacity="0.92"
                          />
                          <text
                            x="0"
                            y="12"
                            fill="#FFFFFF"
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                            letterSpacing="-0.01em"
                          >
                            {pin.flag} {pin.location.split('&')[0].trim()}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* IN-MAP INTERACTIVE CELEBRATION POPUP CARD ("What's Up") */}
            {isPopupOpen && (
              <div
                className={`celebration-pin-popup ${activeCoords.y < 160 ? 'pos-below' : 'pos-above'}`}
                style={{
                  left: `${Math.max(22, Math.min(78, (activeCoords.x / 920) * 100))}%`,
                  top: `${(activeCoords.y / 460) * 100}%`,
                }}
                role="dialog"
                aria-label={`Celebration details for ${activePin.name}`}
              >
                <div className="popup-header-row">
                  <div className="popup-flag-location">
                    <span className="popup-flag">{activePin.flag}</span>
                    <span className="popup-location">{activePin.location}, {activePin.country}</span>
                  </div>
                  <button
                    type="button"
                    className="popup-close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPopupOpen(false);
                    }}
                    aria-label="Close celebration popup"
                  >
                    <X size={13} />
                  </button>
                </div>

                <h4 className="popup-title">{activePin.name}</h4>

                <div className="popup-meta-row">
                  <span className="popup-category-badge">{activePin.categoryLabel}</span>
                  <span className="popup-countdown-badge">
                    <Calendar size={11} aria-hidden="true" />
                    <span>In {activePin.daysUntil} days</span>
                  </span>
                </div>

                <div className="popup-highlight-box">
                  <span className="popup-highlight-label">What's Happening:</span>
                  <p className="popup-highlight-text">{activePin.tagline}</p>
                </div>

                <div className="popup-footer-row">
                  <div className="popup-budget-block">
                    <span className="popup-budget-label">3-Tier Benchmark</span>
                    <span className="popup-budget-val">
                      {formatCurrency(activePin.estBudgetUSD, currentCurrency)}
                    </span>
                  </div>
                  <div className="popup-actions-group">
                    <button
                      type="button"
                      className="popup-plan-btn"
                      onClick={handlePlanThisEvent}
                    >
                      <span>Plan</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="popup-ask-btn"
                      onClick={() => openFestiAIChat(activePin.aiPrompt)}
                      title="Ask Festi AI about this event"
                      aria-label="Ask Festi AI"
                    >
                      <MessageSquare size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CELEBRATION DOSSIER CARD */}
          <div className="celebration-dossier-card">
            <div className="dossier-header-row">
              <span className="dossier-category-pill">
                {activePin.categoryLabel}
              </span>
              <span className="dossier-countdown-pill">
                <Calendar size={13} aria-hidden="true" />
                <span>In {activePin.daysUntil} days</span>
              </span>
            </div>

            <div className="dossier-title-block">
              <div className="dossier-flag-location">
                <span className="dossier-flag">{activePin.flag}</span>
                <span className="dossier-location">{activePin.location}, {activePin.country}</span>
              </div>
              <h3 className="dossier-title">{activePin.name}</h3>
              <p className="dossier-tagline">{activePin.tagline}</p>
            </div>

            <div className="dossier-specs-grid">
              <div className="dossier-spec-item">
                <span className="spec-label">Calendar Dates</span>
                <span className="spec-val">
                  <Calendar size={14} className="spec-icon" aria-hidden="true" />
                  {activePin.dates}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="spec-label">3-Tier Benchmark</span>
                <span className="spec-val highlight-gold">
                  {formatCurrency(activePin.estBudgetUSD, currentCurrency)}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="spec-label">Expected Attendance</span>
                <span className="spec-val">
                  <Users size={14} className="spec-icon" aria-hidden="true" />
                  {activePin.guestRange}
                </span>
              </div>

              <div className="dossier-spec-item">
                <span className="spec-label">Regional Hub</span>
                <span className="spec-val">{activePin.region}</span>
              </div>
            </div>

            <div className="dossier-logistics-box">
              <div className="logistics-title-row">
                <MapPin size={14} className="logistics-icon" aria-hidden="true" />
                <span>Key Logistics Safeguard</span>
              </div>
              <p className="logistics-text">{activePin.logisticsHighlight}</p>
            </div>

            <div className="dossier-actions-row">
              <button
                type="button"
                className="btn btn-primary dossier-btn-primary"
                onClick={handlePlanThisEvent}
              >
                <span>Build plan for this celebration</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn btn-secondary dossier-btn-secondary"
                onClick={() => openFestiAIChat(activePin.aiPrompt)}
                title="Consult Festi AI about this event"
              >
                <MessageSquare size={16} aria-hidden="true" />
                <span>Ask Festi AI</span>
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM: CELEBRATION CITY QUICK SELECTOR STRIP */}
        <div className="celebration-cities-strip" role="group" aria-label="Quick celebration city selector">
          <span className="cities-strip-label">Celebration Hubs:</span>
          <div className="cities-strip-scroll">
            {WORLD_CELEBRATION_PINS.map((pin) => {
              const isActive = activePin.id === pin.id;
              return (
                <button
                  key={pin.id}
                  type="button"
                  className={`city-chip-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelectPin(pin)}
                  aria-pressed={isActive}
                >
                  <span className="city-chip-flag">{pin.flag}</span>
                  <span className="city-chip-name">{pin.location.split('&')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
