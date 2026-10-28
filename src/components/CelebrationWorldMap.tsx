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
  {
    id: 'marrakech_solstice',
    name: 'Marrakech Oasis Lantern Gala',
    location: 'Marrakech',
    country: 'Morocco',
    flag: '🇲🇦',
    region: 'Middle East & Africa',
    dates: 'Dec 18 – Dec 22, 2026',
    month: 'December 2026',
    daysUntil: 51,
    estBudgetUSD: 16500,
    guestRange: '80–220 Guests',
    categoryKey: 'anniversary',
    categoryLabel: 'Galas & Anniversaries',
    tagline: 'Illuminated riad courtyards, Berber acoustic lutes, tagine banquets & starlight desert camps',
    logisticsHighlight: 'Agafay desert luxury transport 4x4 permits and fire lantern safety clearances required.',
    lat: 31.6,
    lon: -8.0,
    color: '#F59E0B',
    aiPrompt: 'Design an opulent Marrakech riad anniversary gala with Berber acoustic musicians, traditional Moroccan banquets, and desert stargazing logistics.',
    image: '/festivals/holi-festival.webp',
  },
];

// Precise Vector Continents Geometrically Projected for 960x500 Equirectangular Canvas
const PATH_NORTH_AMERICA = "M 32,69.4 L 53.3,52.8 L 80,55.6 L 133.3,55.6 L 173.3,61.1 L 226.7,55.6 L 266.7,77.8 L 280,88.9 L 320,111.1 L 333.3,116.7 L 320,122.2 L 304,127.8 L 293.3,133.3 L 282.7,144.4 L 277.3,155.6 L 266.7,180.6 L 261.3,172.2 L 245.3,166.7 L 226.7,169.4 L 221.3,177.8 L 240,191.7 L 245.3,205.6 L 258.7,222.2 L 274.7,227.8 L 266.7,225 L 253.3,216.7 L 226.7,205.6 L 200,194.4 L 186.7,183.3 L 173.3,166.7 L 160,155.6 L 149.3,138.9 L 149.3,116.7 L 133.3,100 L 117.3,88.9 L 80,83.3 L 53.3,94.4 L 37.3,83.3 L 32,69.4 Z";
const PATH_GREENLAND = "M 360,19.4 L 413.3,22.2 L 432,36.1 L 421.3,55.6 L 386.7,69.4 L 362.7,83.3 L 346.7,72.2 L 333.3,55.6 L 320,38.9 L 333.3,22.2 L 360,19.4 Z";
const PATH_SOUTH_AMERICA = "M 274.7,227.8 L 288,216.7 L 314.7,219.4 L 346.7,244.4 L 362.7,258.3 L 384,266.7 L 386.7,275 L 376,291.7 L 368,311.1 L 352,322.2 L 341.3,338.9 L 325.3,347.2 L 312,361.1 L 304,377.8 L 301.3,400 L 288,400 L 282.7,388.9 L 282.7,366.7 L 288,344.4 L 290.7,322.2 L 277.3,300 L 266.7,263.9 L 264,255.6 L 272,241.7 L 274.7,227.8 Z";
const PATH_EUROPE = "M 456,150 L 456,130.6 L 474.7,127.8 L 488,119.4 L 485.3,108.3 L 493.3,102.8 L 501.3,100 L 493.3,88.9 L 493.3,77.8 L 512,69.4 L 520,58.3 L 546.7,52.8 L 562.7,55.6 L 560,69.4 L 538.7,83.3 L 528,88.9 L 512,97.2 L 528,100 L 538.7,100 L 554.7,94.4 L 565.3,105.6 L 560,122.2 L 554.7,133.3 L 544,144.4 L 538.7,150 L 544,138.9 L 522.7,138.9 L 520,144.4 L 512,133.3 L 504,127.8 L 488,133.3 L 472,138.9 L 464,150 L 456,150 Z";
const PATH_UK = "M 466.7,111.1 L 477.3,108.3 L 482.7,105.6 L 480,100 L 474.7,91.7 L 469.3,88.9 L 466.7,94.4 L 472,102.8 L 466.7,111.1 Z";
const PATH_IRELAND = "M 453.3,105.6 L 464,105.6 L 464,97.2 L 453.3,100 L 453.3,105.6 Z";
const PATH_AFRICA = "M 464,150 L 485.3,150 L 506.7,147.2 L 512,158.3 L 538.7,161.1 L 565.3,163.9 L 570.7,175 L 581.3,188.9 L 594.7,216.7 L 616,222.2 L 608,236.1 L 592,255.6 L 586.7,277.8 L 576,305.6 L 565.3,327.8 L 554.7,341.7 L 528,344.4 L 522.7,333.3 L 512,311.1 L 512,288.9 L 504,261.1 L 488,238.9 L 488,233.3 L 469.3,236.1 L 448,227.8 L 434.7,216.7 L 434.7,205.6 L 445.3,183.3 L 453.3,166.7 L 464,150 Z";
const PATH_MADAGASCAR = "M 610.7,283.3 L 616,291.7 L 608,319.4 L 597.3,319.4 L 597.3,300 L 610.7,283.3 Z";
const PATH_ASIA = "M 565.3,105.6 L 586.7,97.2 L 613.3,97.2 L 640,83.3 L 666.7,50 L 720,44.4 L 773.3,47.2 L 840,52.8 L 880,52.8 L 933.3,63.9 L 960,66.7 L 920,83.3 L 896,105.6 L 858.7,111.1 L 832,130.6 L 821.3,144.4 L 805.3,166.7 L 800,183.3 L 768,194.4 L 762.7,222.2 L 746.7,238.9 L 741.3,227.8 L 725.3,205.6 L 714.7,188.9 L 693.3,205.6 L 688,225 L 677.3,208.3 L 666.7,186.1 L 640,180.6 L 626.7,186.1 L 634.7,194.4 L 624,205.6 L 608,211.1 L 597.3,216.7 L 576,188.9 L 570.7,175 L 573.3,158.3 L 576,150 L 586.7,133.3 L 608,138.9 L 618.7,127.8 L 608,116.7 L 565.3,105.6 Z";
const PATH_JAPAN = "M 853.3,125 L 866.7,127.8 L 858.7,138.9 L 853.3,150 L 842.7,155.6 L 826.7,161.1 L 832,155.6 L 848,144.4 L 853.3,125 Z";
const PATH_SUMATRA = "M 736,236.1 L 760,263.9 L 784,272.2 L 778.7,269.4 L 762.7,263.9 L 741.3,244.4 L 736,236.1 Z";
const PATH_BORNEO = "M 773.3,247.2 L 792,238.9 L 794.7,258.3 L 776,258.3 L 773.3,247.2 Z";
const PATH_PHILIPPINES = "M 800,200 L 816,216.7 L 816,233.3 L 805.3,230.6 L 800,211.1 L 800,200 Z";
const PATH_AUSTRALIA = "M 826.7,283.3 L 842.7,283.3 L 858.7,280.6 L 869.3,291.7 L 885.3,319.4 L 888,327.8 L 880,347.2 L 858.7,355.6 L 842.7,347.2 L 821.3,338.9 L 800,344.4 L 786.7,344.4 L 784,322.2 L 794.7,305.6 L 810.7,294.4 L 826.7,283.3 Z";
const PATH_TASMANIA = "M 866.7,363.9 L 874.7,363.9 L 874.7,369.4 L 866.7,369.4 L 866.7,363.9 Z";
const PATH_NZ = "M 941.3,347.2 L 954.7,355.6 L 946.7,363.9 L 941.3,347.2 Z M 938.7,363.9 L 944,369.4 L 933.3,377.8 L 925.3,375 L 938.7,363.9 Z";

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
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
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

  // Convert (lat, lon) to SVG (x, y) on 960x500 canvas
  const projectCoords = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 960;
    const y = ((90 - lat) / 180) * 500;
    return { x, y };
  };

  const activeCoords = projectCoords(activePin.lat, activePin.lon);

  const handleSelectPin = (pin: WorldCelebrationPin) => {
    playPopSound(false);
    setActivePinId(pin.id);
    setIsPopupOpen(true);
  };

  const handleContinentClick = (region: 'Americas' | 'Europe' | 'Asia & Pacific' | 'Middle East & Africa') => {
    playPopSound(false);
    setSelectedRegion(region);
    // Find the first celebration located in this clicked continent/region
    const firstInRegion = WORLD_CELEBRATION_PINS.find((p) => p.region === region);
    if (firstInRegion) {
      setActivePinId(firstInRegion.id);
      setIsPopupOpen(true);
    }
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
        {/* SECTION HEADER (Clean typography, zero icons) */}
        <div className="celebration-world-header">
          <div>
            <h2 id="world-map-title" className="celebration-world-title">
              Global Celebrations &amp; Cultural Long Weekends
            </h2>
            <p className="celebration-world-subtitle">
              Explore iconic celebrations mapped across the world. Tap any continent or city pin to inspect what is happening at that part of the globe.
            </p>
          </div>
        </div>

        {/* REGION FILTER BAR */}
        <div className="celebration-filter-bar">
          <div className="region-pills" role="tablist" aria-label="Filter by region">
            {(['All', 'Americas', 'Europe', 'Asia & Pacific', 'Middle East & Africa'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`region-pill-btn ${selectedRegion === r ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRegion(r);
                  if (r !== 'All') {
                    const firstMatch = WORLD_CELEBRATION_PINS.find((p) => p.region === r);
                    if (firstMatch) {
                      setActivePinId(firstMatch.id);
                      setIsPopupOpen(true);
                    }
                  }
                }}
                role="tab"
                aria-selected={selectedRegion === r}
              >
                <span>{r === 'All' ? `All Regions (${WORLD_CELEBRATION_PINS.length})` : r}</span>
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
          {/* LEFT: CELEBRATORY INTERACTIVE VECTOR MAP */}
          <div className="celebration-visual-canvas">
            <div className="svg-map-wrapper">
              <svg
                viewBox="0 0 960 500"
                className="celebration-svg-map"
                role="img"
                aria-label="Interactive Celebration World Map with clickable continents and event pins"
              >
                <defs>
                  <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FAF7F2" />
                    <stop offset="100%" stopColor="#F2ECE2" />
                  </linearGradient>

                  <filter id="beaconGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>

                  <filter id="continentShadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#3D1E06" floodOpacity="0.08" />
                  </filter>
                </defs>

                {/* Ocean Background Canvas */}
                <rect width="960" height="500" rx="16" fill="url(#oceanGrad)" />

                {/* Subtle Latitude & Longitude Geodetic Grid Lines */}
                <g stroke="#E8DFCF" strokeWidth="0.75" strokeDasharray="3 4">
                  {/* Tropic of Cancer (23.5° N) */}
                  <line x1="0" y1="184.7" x2="960" y2="184.7" stroke="#DECFA9" strokeWidth="0.8" />
                  {/* Equator (0°) */}
                  <line x1="0" y1="250" x2="960" y2="250" stroke="#DECFA9" strokeWidth="1.2" strokeDasharray="none" />
                  {/* Tropic of Capricorn (23.5° S) */}
                  <line x1="0" y1="315.3" x2="960" y2="315.3" stroke="#DECFA9" strokeWidth="0.8" />
                  {/* 45° N / S */}
                  <line x1="0" y1="125" x2="960" y2="125" />
                  <line x1="0" y1="375" x2="960" y2="375" />
                  {/* Longitude Meridians */}
                  <line x1="240" y1="0" x2="240" y2="500" />
                  <line x1="480" y1="0" x2="480" y2="500" stroke="#DECFA9" strokeWidth="1" strokeDasharray="none" />
                  <line x1="720" y1="0" x2="720" y2="500" />
                </g>

                {/* ========================================================
                    CLICKABLE CONTINENT GEOMETRIES (Rich Geodetic Vectors)
                    ======================================================== */}

                {/* 1. AMERICAS REGION (North & South America + Greenland) */}
                <g
                  className={`world-continent-group ${selectedRegion === 'Americas' ? 'active-region' : ''} ${hoveredRegion === 'Americas' ? 'hovered-region' : ''}`}
                  onClick={() => handleContinentClick('Americas')}
                  onMouseEnter={() => setHoveredRegion('Americas')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to explore celebrations in the Americas"
                  filter="url(#continentShadow)"
                  style={{ cursor: 'pointer' }}
                >
                  <path d={PATH_NORTH_AMERICA} className="continent-land" />
                  <path d={PATH_GREENLAND} className="continent-land" />
                  <path d={PATH_SOUTH_AMERICA} className="continent-land" />
                  {/* Continent Label */}
                  <text x="210" y="140" className="continent-name-label">Americas</text>
                </g>

                {/* 2. EUROPE REGION (Continental Europe + British Isles + Scandinavia) */}
                <g
                  className={`world-continent-group ${selectedRegion === 'Europe' ? 'active-region' : ''} ${hoveredRegion === 'Europe' ? 'hovered-region' : ''}`}
                  onClick={() => handleContinentClick('Europe')}
                  onMouseEnter={() => setHoveredRegion('Europe')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to explore celebrations in Europe"
                  filter="url(#continentShadow)"
                  style={{ cursor: 'pointer' }}
                >
                  <path d={PATH_EUROPE} className="continent-land" />
                  <path d={PATH_UK} className="continent-land" />
                  <path d={PATH_IRELAND} className="continent-land" />
                  {/* Continent Label */}
                  <text x="500" y="90" className="continent-name-label">Europe</text>
                </g>

                {/* 3. MIDDLE EAST & AFRICA REGION */}
                <g
                  className={`world-continent-group ${selectedRegion === 'Middle East & Africa' ? 'active-region' : ''} ${hoveredRegion === 'Middle East & Africa' ? 'hovered-region' : ''}`}
                  onClick={() => handleContinentClick('Middle East & Africa')}
                  onMouseEnter={() => setHoveredRegion('Middle East & Africa')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to explore celebrations in Middle East & Africa"
                  filter="url(#continentShadow)"
                  style={{ cursor: 'pointer' }}
                >
                  <path d={PATH_AFRICA} className="continent-land" />
                  <path d={PATH_MADAGASCAR} className="continent-land" />
                  {/* Continent Label */}
                  <text x="520" y="240" className="continent-name-label">Africa</text>
                </g>

                {/* 4. ASIA & PACIFIC REGION (Asia, Japan, SE Asia, Australia, NZ) */}
                <g
                  className={`world-continent-group ${selectedRegion === 'Asia & Pacific' ? 'active-region' : ''} ${hoveredRegion === 'Asia & Pacific' ? 'hovered-region' : ''}`}
                  onClick={() => handleContinentClick('Asia & Pacific')}
                  onMouseEnter={() => setHoveredRegion('Asia & Pacific')}
                  onMouseLeave={() => setHoveredRegion(null)}
                  role="button"
                  tabIndex={0}
                  aria-label="Click to explore celebrations in Asia & Pacific"
                  filter="url(#continentShadow)"
                  style={{ cursor: 'pointer' }}
                >
                  <path d={PATH_ASIA} className="continent-land" />
                  <path d={PATH_JAPAN} className="continent-land" />
                  <path d={PATH_SUMATRA} className="continent-land" />
                  <path d={PATH_BORNEO} className="continent-land" />
                  <path d={PATH_PHILIPPINES} className="continent-land" />
                  <path d={PATH_AUSTRALIA} className="continent-land" />
                  <path d={PATH_TASMANIA} className="continent-land" />
                  <path d={PATH_NZ} className="continent-land" />
                  {/* Continent Labels */}
                  <text x="730" y="110" className="continent-name-label">Asia</text>
                  <text x="840" y="325" className="continent-name-label">Australia</text>
                </g>

                {/* ========================================================
                    INTERACTIVE CELEBRATION PINS (City Hotspots)
                    ======================================================== */}
                {filteredPins.map((pin) => {
                  const { x, y } = projectCoords(pin.lat, pin.lon);
                  const isSelected = activePin.id === pin.id;
                  return (
                    <g
                      key={pin.id}
                      className="map-pin-group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPin(pin);
                      }}
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
                      {/* Generous Hit-Target for Mobile and Cursor Tapping */}
                      <circle cx={x} cy={y} r={24} fill="transparent" />

                      {/* Gentle Radiant Halo Beacon */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 18 : 10}
                        fill={pin.color}
                        opacity={isSelected ? 0.35 : 0.18}
                        className={isSelected ? 'pin-active-pulse' : ''}
                      />

                      {/* Outer Ring */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 8.5 : 5.5}
                        fill="#FFFFFF"
                        stroke={pin.color}
                        strokeWidth={isSelected ? 3 : 2}
                        filter="url(#beaconGlow)"
                      />

                      {/* Center Dot */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? 4 : 2.5}
                        fill={pin.color}
                      />

                      {/* Compact City Label Tag */}
                      <g transform={`translate(${x}, ${y + (isSelected ? 14 : 12)})`}>
                        <rect
                          x="-46"
                          y="0"
                          width="92"
                          height="16"
                          rx="8"
                          fill={isSelected ? '#3D1E06' : '#FFFFFF'}
                          stroke={isSelected ? '#3D1E06' : '#E5DECF'}
                          strokeWidth="1"
                          opacity={isSelected ? 0.95 : 0.88}
                        />
                        <text
                          x="0"
                          y="11"
                          fill={isSelected ? '#FFFFFF' : '#3D1E06'}
                          fontSize="9.5"
                          fontWeight={isSelected ? '800' : '700'}
                          textAnchor="middle"
                          letterSpacing="-0.01em"
                        >
                          {pin.flag} {pin.location.split('&')[0].trim()}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* FLOATING CONTINENT EXPLORATION HINT */}
            <div className="map-region-hint">
              <span>
                {hoveredRegion
                  ? `Exploring ${hoveredRegion} • Click continent to view celebrations`
                  : `Tap any continent or city pin to view celebrations`}
              </span>
            </div>

            {/* IN-MAP INTERACTIVE CELEBRATION POPUP CARD ("What's Up") */}
            {isPopupOpen && (
              <div
                className={`celebration-pin-popup ${activeCoords.y < 180 ? 'pos-below' : 'pos-above'}`}
                style={{
                  left: `${Math.max(18, Math.min(82, (activeCoords.x / 960) * 100))}%`,
                  top: `${(activeCoords.y / 500) * 100}%`,
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
                  <span className="popup-highlight-label">What is Happening:</span>
                  <p className="popup-highlight-text">{activePin.tagline}</p>
                </div>

                <div className="popup-footer-row">
                  <div className="popup-budget-block">
                    <span className="popup-budget-label">Budget Benchmark</span>
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
            {activePin.image && (
              <div className="dossier-image-hero">
                <img
                  src={activePin.image}
                  alt={`${activePin.name} in ${activePin.location}`}
                  className="dossier-cover-photo"
                  loading="lazy"
                />
                <div className="dossier-image-overlay">
                  <span className="dossier-badge-floating">{activePin.categoryLabel}</span>
                </div>
              </div>
            )}

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
          <span className="cities-strip-label">Global Celebration Hubs:</span>
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
