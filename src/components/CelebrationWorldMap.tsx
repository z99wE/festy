import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Globe,
  Calendar,
  Sparkles,
  ArrowRight,
  Search,
  MessageSquare,
  Users,
  Compass,
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
  reducedMotion = false,
  currentCurrency = 'USD',
  onSelectEventForPlanner,
}) => {
  const [activePinId, setActivePinId] = useState<string>(WORLD_CELEBRATION_PINS[0].id);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [displayMode, setDisplayMode] = useState<'map' | 'globe'>('map');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const globeContainerRef = useRef<HTMLDivElement>(null);

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

  // 3D Three.js Rotating Celebration Globe with Beacons (Zero confetti, warm celebratory earth)
  useEffect(() => {
    if (displayMode !== 'globe') return;
    const container = globeContainerRef.current;
    if (!container) return;

    let isDisposed = false;
    let animationFrameId = 0;
    let cleanupFn: (() => void) | undefined;

    import('three').then((THREE) => {
      if (isDisposed) return;
      const width = container.clientWidth || 460;
      const height = 380;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
      camera.position.set(0, 0, 5.2);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      // Warm celebratory lighting
      const ambientLight = new THREE.AmbientLight(0xfff5ea, 2.2);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffedd5, 2.5);
      sunLight.position.set(4, 3, 5);
      scene.add(sunLight);

      const rimLight = new THREE.DirectionalLight(0xffc278, 1.5);
      rimLight.position.set(-4, -2, -3);
      scene.add(rimLight);

      const globeGroup = new THREE.Group();
      scene.add(globeGroup);

      // Earth Sphere with elegant celebratory parchment/landmass canvas
      const sphereRadius = 1.7;
      const sphereGeom = new THREE.SphereGeometry(sphereRadius, 32, 32);

      // Procedural warm celebratory globe texture
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Soft creamy ocean
        ctx.fillStyle = '#f8f4ec';
        ctx.fillRect(0, 0, 1024, 512);

        // Latitude & Longitude delicate guide arcs
        ctx.strokeStyle = '#e7dece';
        ctx.lineWidth = 1;
        for (let x = 0; x <= 1024; x += 1024 / 12) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, 512);
          ctx.stroke();
        }
        for (let y = 0; y <= 512; y += 512 / 6) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(1024, y);
          ctx.stroke();
        }

        // Equator accent line
        ctx.strokeStyle = '#dfd2bc';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 256);
        ctx.lineTo(1024, 256);
        ctx.stroke();

        // Stylized continent clusters (warm champagne fill)
        ctx.fillStyle = '#ebdcc7';
        // Americas
        ctx.beginPath();
        ctx.ellipse(280, 190, 85, 110, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(340, 360, 60, 95, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Europe & Africa
        ctx.beginPath();
        ctx.ellipse(540, 170, 60, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(550, 290, 75, 90, 0, 0, Math.PI * 2);
        ctx.fill();

        // Asia & Australia
        ctx.beginPath();
        ctx.ellipse(750, 180, 120, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(840, 360, 50, 45, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const globeTex = new THREE.CanvasTexture(canvas);
      globeTex.colorSpace = THREE.SRGBColorSpace;

      const globeMat = new THREE.MeshStandardMaterial({
        map: globeTex,
        roughness: 0.65,
        metalness: 0.05,
      });

      const earthMesh = new THREE.Mesh(sphereGeom, globeMat);
      globeGroup.add(earthMesh);

      // Outer atmospheric warm glow
      const atmosphereGeom = new THREE.SphereGeometry(sphereRadius * 1.025, 32, 32);
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: 0xffa45b,
        transparent: true,
        opacity: 0.09,
        side: THREE.BackSide,
      });
      const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
      globeGroup.add(atmosphereMesh);

      // Add 3D Beacon Pins for celebrations
      const pinMeshes: { mesh: any; pin: WorldCelebrationPin }[] = [];
      const pinGeom = new THREE.SphereGeometry(0.065, 16, 16);

      WORLD_CELEBRATION_PINS.forEach((pin) => {
        const phi = (90 - pin.lat) * (Math.PI / 180);
        const theta = (pin.lon + 180) * (Math.PI / 180);

        const x = -sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.cos(phi);
        const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

        const pinMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(pin.color),
        });
        const pinMesh = new THREE.Mesh(pinGeom, pinMat);
        pinMesh.position.set(x, y, z);
        globeGroup.add(pinMesh);
        pinMeshes.push({ mesh: pinMesh, pin });
      });

      // Mouse drag rotation
      let isDragging = false;
      let prevX = 0;
      let prevY = 0;
      let rotX = 0.25;
      let rotY = -0.6;
      let targetRotX = rotX;
      let targetRotY = rotY;

      const dom = renderer.domElement;
      dom.style.cursor = 'grab';

      const onPointerDown = (e: MouseEvent | TouchEvent) => {
        isDragging = true;
        const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
        prevX = cx;
        prevY = cy;
        dom.style.cursor = 'grabbing';
      };

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaX = cx - prevX;
        const deltaY = cy - prevY;
        prevX = cx;
        prevY = cy;
        targetRotY += deltaX * 0.007;
        targetRotX += deltaY * 0.007;
        targetRotX = Math.max(-1.1, Math.min(1.1, targetRotX));
      };

      const onPointerUp = () => {
        isDragging = false;
        dom.style.cursor = 'grab';
      };

      dom.addEventListener('mousedown', onPointerDown);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      dom.addEventListener('touchstart', onPointerDown, { passive: true });
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', onPointerUp);

      let lastTime = 0;
      const animate = (timestamp: number) => {
        animationFrameId = requestAnimationFrame(animate);
        if (timestamp - lastTime < 28) return;
        lastTime = timestamp;

        if (!isDragging && !reducedMotion) {
          targetRotY += 0.0018; // Gentle slow rotation
        }

        rotY += (targetRotY - rotY) * 0.08;
        rotX += (targetRotX - rotX) * 0.08;

        globeGroup.rotation.y = rotY;
        globeGroup.rotation.x = rotX;

        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate);

      cleanupFn = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        dom.removeEventListener('mousedown', onPointerDown);
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('mouseup', onPointerUp);
        dom.removeEventListener('touchstart', onPointerDown);
        window.removeEventListener('touchmove', onPointerMove);
        window.removeEventListener('touchend', onPointerUp);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    });

    return () => {
      isDisposed = true;
      cleanupFn?.();
    };
  }, [displayMode, reducedMotion]);

  const handleSelectPin = (pin: WorldCelebrationPin) => {
    playPopSound(false);
    setActivePinId(pin.id);
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
        {/* SECTION HEADER */}
        <div className="celebration-world-header">
          <div>
            <div className="celebration-badge-pill">
              <Sparkles size={14} className="badge-sparkle-icon" aria-hidden="true" />
              <span>Worldwide Celebrations &amp; Getaways</span>
            </div>
            <h2 id="world-map-title" className="celebration-world-title">
              Global Celebrations &amp; Long Weekend Escapes
            </h2>
            <p className="celebration-world-subtitle">
              Explore iconic cultural festivals, solstice gatherings, and milestone long weekends mapped across the world.
            </p>
          </div>

          {/* VIEW SWITCHER & REGION FILTER */}
          <div className="celebration-header-actions">
            <div className="mode-toggle-cluster" role="radiogroup" aria-label="Map Display Mode">
              <button
                type="button"
                className={`mode-toggle-btn ${displayMode === 'map' ? 'active' : ''}`}
                onClick={() => setDisplayMode('map')}
                role="radio"
                aria-checked={displayMode === 'map'}
              >
                <Compass size={15} aria-hidden="true" />
                <span>World Map</span>
              </button>
              <button
                type="button"
                className={`mode-toggle-btn ${displayMode === 'globe' ? 'active' : ''}`}
                onClick={() => setDisplayMode('globe')}
                role="radio"
                aria-checked={displayMode === 'globe'}
              >
                <Globe size={15} aria-hidden="true" />
                <span>Celebration Globe</span>
              </button>
            </div>
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
          {/* LEFT: MAP OR 3D GLOBE CANVAS */}
          <div className="celebration-visual-canvas">
            {displayMode === 'map' ? (
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
                        {/* Gentle Pulsing Ring (Zero confetti, warm celebratory glow) */}
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
                          r={isSelected ? 8 : 5.5}
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

                        {/* Pill Label for Selected Pin */}
                        {isSelected && (
                          <g transform={`translate(${x}, ${y - 14})`}>
                            <rect
                              x="-55"
                              y="-24"
                              width="110"
                              height="22"
                              rx="11"
                              fill="#2B1B17"
                              opacity="0.94"
                            />
                            <text
                              x="0"
                              y="-9"
                              fill="#FFFFFF"
                              fontSize="11"
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
            ) : (
              <div className="three-globe-wrapper">
                <div ref={globeContainerRef} className="three-globe-canvas-host" />
                <div className="globe-drag-hint">
                  <span>Drag globe in 360° to explore global celebration hubs</span>
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
                <Sparkles size={14} className="logistics-icon" aria-hidden="true" />
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
                title="Consult FestiBot AI about this event"
              >
                <MessageSquare size={16} aria-hidden="true" />
                <span>Ask FestiBot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
