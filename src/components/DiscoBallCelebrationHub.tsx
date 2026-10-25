import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import {
  formatCurrency,
  REGIONAL_LONG_WEEKENDS,
  detectUserRegion,
  type LongWeekend,
} from '../utils/currency';
import { playPopSound, playCelebrationSound } from '../utils/audio';

interface DiscoBallCelebrationHubProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (occasionId: string, eventName: string) => void;
}

export interface CelebrationEvent {
  id: string;
  name: string;
  location: string;
  country: string;
  dates: string;
  daysUntil: number;
  estBudgetUSD: number;
  guestRange: string;
  categoryKey: string;
  tagline: string;
  logisticsHighlight: string;
  color: string;
}

const UPCOMING_WORLD_EVENTS: CelebrationEvent[] = [
  {
    id: 'diwali',
    name: 'Diwali Festival of Lights',
    location: 'New Delhi & Worldwide',
    country: 'India',
    dates: 'Late October / November',
    daysUntil: 18,
    estBudgetUSD: 18500,
    guestRange: '250–600 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Illuminated Diya Courtyards, Floral Rangoli & Royal Sweets Banquet',
    logisticsHighlight: 'Requires certified fire marshal approval for outdoor sparklers and 48-hr ghee lamp vendor permits.',
    color: '#FF7A00',
  },
  {
    id: 'rio_carnival',
    name: 'Rio Carnival Spectacular',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    dates: 'Mid-February',
    daysUntil: 114,
    estBudgetUSD: 24000,
    guestRange: '150–500 Guests',
    categoryKey: 'festival',
    tagline: 'Samba Pavilions, Feijoada Lounges & Golden Confetti Showers',
    logisticsHighlight: 'Acoustic containment barriers needed for live percussion bands past 2:00 AM.',
    color: '#E65100',
  },
  {
    id: 'hanami',
    name: 'Hanami Cherry Blossom Gala',
    location: 'Tokyo & Kyoto',
    country: 'Japan',
    dates: 'Late March – Early April',
    daysUntil: 158,
    estBudgetUSD: 14500,
    guestRange: '80–200 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Night Blossom Canopy, Wagashi Tasting & Sake Sommelier Pairings',
    logisticsHighlight: 'Park picnic zoning permits must be booked 90 days ahead; requires waste-free bento pack-out protocol.',
    color: '#D84315',
  },
  {
    id: 'halloween',
    name: 'Gothic Masquerade & Halloween',
    location: 'New Orleans & Edinburgh',
    country: 'United States / UK',
    dates: 'October 31',
    daysUntil: 6,
    estBudgetUSD: 11200,
    guestRange: '120–300 Guests',
    categoryKey: 'birthday',
    tagline: 'Velvet Candlelit Chambers, Dry-Ice Cocktails & Live String Quartet',
    logisticsHighlight: 'Open flame candles require glass hurricane shields; verify CO2 detector spacing for low-fog machines.',
    color: '#BF360C',
  },
  {
    id: 'nye',
    name: 'New Year’s Eve Sovereign Gala',
    location: 'Sydney Harbour & New York',
    country: 'Australia / USA',
    dates: 'December 31',
    daysUntil: 67,
    estBudgetUSD: 32000,
    guestRange: '200–800 Guests',
    categoryKey: 'anniversary',
    tagline: 'Midnight Champagne Pyramid, Laser Countdown & Waterfront Terrace',
    logisticsHighlight: 'Holiday overtime staffing rates spike 2.2x after 10:00 PM; contract midnight catering buffers.',
    color: '#FF6F00',
  },
  {
    id: 'lunar_new_year',
    name: 'Lunar New Year Spring Feast',
    location: 'Singapore & Hong Kong',
    country: 'Singapore',
    dates: 'Late January / February',
    daysUntil: 96,
    estBudgetUSD: 16800,
    guestRange: '180–450 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Prosperity Yu Sheng Toss, Lion Dance Procession & Lantern Promenade',
    logisticsHighlight: 'High-clearance ceiling (min 4.5m) required for acrobatic pole lion dancers and live drum troupe.',
    color: '#E64A19',
  },
  {
    id: 'oktoberfest',
    name: 'Bavarian Harvest Gathering',
    location: 'Munich',
    country: 'Germany',
    dates: 'Late September – October',
    daysUntil: 338,
    estBudgetUSD: 19500,
    guestRange: '150–400 Guests',
    categoryKey: 'festival',
    tagline: 'Hand-Crafted Long Tables, Brass Oompah Band & Artisan Pretzel Bars',
    logisticsHighlight: 'Requires heavy-duty timber flooring rental to protect park turf from wooden keg taps.',
    color: '#F57C00',
  },
  {
    id: 'glastonbury',
    name: 'Midsummer Solstice Festival',
    location: 'Somerset',
    country: 'United Kingdom',
    dates: 'Late June',
    daysUntil: 242,
    estBudgetUSD: 28500,
    guestRange: '300–1200 Guests',
    categoryKey: 'festival',
    tagline: 'Festival Mainstage, Glamping Pods & Solar-Powered Sound Architecture',
    logisticsHighlight: 'Generator redundancy contracts with automatic failover transfers prevent live stage silence.',
    color: '#EF6C00',
  },
  {
    id: 'eid',
    name: 'Eid Grand Celebration Banquet',
    location: 'Dubai & Istanbul',
    country: 'UAE / Turkey',
    dates: 'March / April',
    daysUntil: 162,
    estBudgetUSD: 21000,
    guestRange: '200–650 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Oud Symphony, Gold-Leaf Dessert Pavilion & Family Courtyards',
    logisticsHighlight: 'Halal catering chain audit required for all dry aging and multi-tier buffet displays.',
    color: '#D84315',
  },
  {
    id: 'thanksgiving',
    name: 'Autumn Harvest Table & Gala',
    location: 'North America',
    country: 'United States',
    dates: 'Fourth Thursday of November',
    daysUntil: 32,
    estBudgetUSD: 9800,
    guestRange: '40–120 Guests',
    categoryKey: 'retreat',
    tagline: 'Farm-to-Table Hearth, Cider Cellar & Family Estate Dinner',
    logisticsHighlight: 'Commercial convection oven rentals needed if residential kitchen lacks capacity for multi-course meats.',
    color: '#C43E00',
  },
  {
    id: 'st_patricks',
    name: 'Emerald Heritage Celebration',
    location: 'Dublin & Boston',
    country: 'Ireland / USA',
    dates: 'March 17',
    daysUntil: 143,
    estBudgetUSD: 12500,
    guestRange: '120–350 Guests',
    categoryKey: 'festival',
    tagline: 'Fiddle Folk Orchestra, Stout Cask Tapping & Celtic Revelry',
    logisticsHighlight: 'Floor drainage mats essential around draught line installations and glassware wash stations.',
    color: '#2E7D32',
  },
  {
    id: 'holi',
    name: 'Holi Festival of Color & Joy',
    location: 'Varanasi, Jaipur & Global',
    country: 'India',
    dates: 'Mid-March',
    daysUntil: 141,
    estBudgetUSD: 13500,
    guestRange: '150–500 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Organic Herbal Pigment Clouds, Thandai Stations & Dhol Drummers',
    logisticsHighlight: 'Provide organic non-toxic cornstarch powder only; contract high-pressure ground spray wash for tear-down.',
    color: '#E91E63',
  },
];

export const DiscoBallCelebrationHub: React.FC<DiscoBallCelebrationHubProps> = ({
  reducedMotion = false,
  currentCurrency = 'USD',
  onSelectEventForPlanner,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'festivals' | 'weekends'>('festivals');
  const [selectedEventId, setSelectedEventId] = useState<string>('diwali');
  const [, setSpinBoost] = useState(0);
  const [userRegion, setUserRegion] = useState<string>('US');
  const [detectedCountry, setDetectedCountry] = useState<string>('United States');

  // Detect user region on mount
  useEffect(() => {
    const region = detectUserRegion();
    setUserRegion(region.regionCode);
    setDetectedCountry(region.countryName);
  }, []);

  const activeEvent = useMemo(() => {
    return (
      UPCOMING_WORLD_EVENTS.find((e) => e.id === selectedEventId) ||
      UPCOMING_WORLD_EVENTS[0]
    );
  }, [selectedEventId]);

  const regionalWeekends: LongWeekend[] = useMemo(() => {
    const reg = REGIONAL_LONG_WEEKENDS[userRegion] || REGIONAL_LONG_WEEKENDS.GLOBAL;
    return reg ? reg.longWeekends : [];
  }, [userRegion]);

  // Three.js Reflective Disco Ball Simulation
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 480;
    const height = 440;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm ambient and pin-spot lighting
    const ambient = new THREE.AmbientLight(0xfff5e6, 1.4);
    scene.add(ambient);

    // 3 Pin-spot lights aimed at the disco ball
    const spotGold = new THREE.DirectionalLight(0xffd54f, 3.2);
    spotGold.position.set(4, 6, 4);
    scene.add(spotGold);

    const spotAmber = new THREE.DirectionalLight(0xff7043, 2.8);
    spotAmber.position.set(-5, 4, 3);
    scene.add(spotAmber);

    const spotWhite = new THREE.DirectionalLight(0xffffff, 2.5);
    spotWhite.position.set(0, -4, 5);
    scene.add(spotWhite);

    // Root Group
    const discoGroup = new THREE.Group();
    scene.add(discoGroup);

    // Hanging Rod & Loop at Top
    const rodGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.4, 16);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.1,
    });
    const rodMesh = new THREE.Mesh(rodGeom, rodMat);
    rodMesh.position.set(0, 3.1, 0);
    discoGroup.add(rodMesh);

    const ringGeom = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeom, rodMat);
    ringMesh.position.set(0, 2.0, 0);
    discoGroup.add(ringMesh);

    // FACETED MIRROR DISCO SPHERE
    // An icosahedron with detail produces flat-shaded reflective mirror facets!
    const sphereGeom = new THREE.IcosahedronGeometry(1.85, 4);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0eb,
      metalness: 0.96,
      roughness: 0.12,
      flatShading: true,
      envMapIntensity: 1.5,
    });
    const discoBall = new THREE.Mesh(sphereGeom, sphereMat);
    discoGroup.add(discoBall);

    // Radiating Sparkle Flecks Particle Cloud (Reflections sweeping the room)
    const sparkleCount = 140;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleScales = new Float32Array(sparkleCount);

    for (let i = 0; i < sparkleCount; i++) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      sparklePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      sparklePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      sparklePositions[i * 3 + 2] = radius * Math.cos(phi);
      sparkleScales[i] = Math.random();
    }

    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
    sparkleGeom.setAttribute('scale', new THREE.BufferAttribute(sparkleScales, 1));

    // Custom Sparkle Point Material
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.width = 64;
    sparkleCanvas.height = 64;
    const ctx = sparkleCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 245, 210, 1)');
    grad.addColorStop(0.3, 'rgba(255, 180, 50, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 120, 0, 0.2)');
    grad.addColorStop(1, 'rgba(255, 100, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const sparkleTexture = new THREE.CanvasTexture(sparkleCanvas);
    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.24,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparklesMesh = new THREE.Points(sparkleGeom, sparkleMaterial);
    discoGroup.add(sparklesMesh);

    // Orbiting Golden Horizon Rings
    const orbitRingGeom = new THREE.TorusGeometry(2.7, 0.02, 16, 80);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xffaa44,
      metalness: 0.8,
      roughness: 0.25,
      transparent: true,
      opacity: 0.45,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeom, orbitRingMat);
    orbitRing.rotation.x = Math.PI * 0.42;
    discoGroup.add(orbitRing);

    // Mouse / Touch Drag Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotSpeedY = 0.008;
    let currentRotY = 0;
    let targetTiltX = 0.15;
    let currentTiltX = 0.15;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = x;
      prevMouseY = y;
      playPopSound(true);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = x - prevMouseX;
      const deltaY = y - prevMouseY;

      currentRotY += deltaX * 0.009;
      targetTiltX += deltaY * 0.005;
      targetTiltX = Math.max(-0.4, Math.min(0.4, targetTiltX));

      prevMouseX = x;
      prevMouseY = y;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.style.touchAction = 'none';

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Click on canvas gives instant celebratory burst
    const onCanvasClick = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      confetti({
        particleCount: 28,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD700', '#FF7A00', '#FF4500', '#FFFFFF', '#FFA500'],
      });
      playCelebrationSound(true);
      rotSpeedY += 0.04; // Spin boost!
    };
    dom.addEventListener('click', onCanvasClick);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 480;
      const h = 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop
    let animId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Continuous rotation
      if (!reducedMotion) {
        currentRotY += rotSpeedY;
        // Decay spin boost smoothly back to base speed
        rotSpeedY += (0.007 - rotSpeedY) * 0.03;
      }

      currentTiltX += (targetTiltX - currentTiltX) * 0.06;

      discoBall.rotation.y = currentRotY;
      discoBall.rotation.x = currentTiltX;

      sparklesMesh.rotation.y = currentRotY * 1.25;
      sparklesMesh.rotation.x = currentTiltX + Math.sin(elapsed * 0.5) * 0.1;

      orbitRing.rotation.z = elapsed * 0.15;

      // Subtle vertical breathing float
      discoGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

      dom.style.cursor = isDragging ? 'grabbing' : 'grab';
      renderer.render(scene, camera);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('click', onCanvasClick);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  // Handle triggering celebratory spin burst from button
  const handleBallSpinClick = () => {
    setSpinBoost((prev) => prev + 1);
    confetti({
      particleCount: 36,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FFB300', '#FF7043', '#FFFFFF', '#FFA726'],
    });
    playCelebrationSound(true);
  };

  const handleNextEvent = () => {
    const currentIndex = UPCOMING_WORLD_EVENTS.findIndex((e) => e.id === selectedEventId);
    const nextIndex = (currentIndex + 1) % UPCOMING_WORLD_EVENTS.length;
    setSelectedEventId(UPCOMING_WORLD_EVENTS[nextIndex].id);
    playPopSound(true);
  };

  const handlePrevEvent = () => {
    const currentIndex = UPCOMING_WORLD_EVENTS.findIndex((e) => e.id === selectedEventId);
    const prevIndex = (currentIndex - 1 + UPCOMING_WORLD_EVENTS.length) % UPCOMING_WORLD_EVENTS.length;
    setSelectedEventId(UPCOMING_WORLD_EVENTS[prevIndex].id);
    playPopSound(true);
  };

  return (
    <section className="disco-ball-section-wrapper" aria-label="World Celebrations & Long Weekends">
      {/* Liquid Frosted Glass Body with Faded Vignette Sides */}
      <div className="disco-ball-glass-card">
        {/* Top Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 28px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            Upcoming Celebrations & Long Weekends Around the World
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Interactive celebration calendar. Spin the disco ball or select any global festival or 3-day bank holiday to synthesize an audit-ready plan.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="disco-tab-bar" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'festivals'}
              className={`disco-tab-btn ${activeTab === 'festivals' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('festivals');
                playPopSound(true);
              }}
            >
              <Sparkles size={14} style={{ marginRight: '6px' }} />
              <span>World Festivals & Holidays ({UPCOMING_WORLD_EVENTS.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'weekends'}
              className={`disco-tab-btn ${activeTab === 'weekends' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('weekends');
                playPopSound(true);
              }}
            >
              <Calendar size={14} style={{ marginRight: '6px' }} />
              <span>Regional Long Weekends ({regionalWeekends.length})</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            VIEW A: WORLD FESTIVALS & DISCO BALL STAGE
            ========================================================== */}
        {activeTab === 'festivals' && (
          <div className="disco-stage-layout">
            {/* Left: 3D Interactive Disco Ball Stage */}
            <div className="disco-canvas-column">
              <div
                ref={canvasRef}
                className="disco-canvas-wrap"
                title="Click or drag to spin the disco ball!"
              />

              <div className="disco-ball-action-bar">
                <button
                  type="button"
                  className="btn btn-secondary disco-spin-btn"
                  onClick={handleBallSpinClick}
                  aria-label="Spin celebration disco ball"
                >
                  <Sparkles size={15} style={{ marginRight: '6px' }} />
                  <span>Spin for Celebration Sparkles</span>
                </button>
              </div>

              {/* Event Carousel Pills */}
              <div className="disco-festival-chips-scroll">
                {UPCOMING_WORLD_EVENTS.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className={`disco-chip-item ${selectedEventId === event.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedEventId(event.id);
                      playPopSound(true);
                    }}
                  >
                    <span className="disco-chip-name">{event.name}</span>
                    <span className="disco-chip-days">{event.daysUntil}d</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Selected Celebration Dossier Card */}
            <div className="disco-event-dossier">
              <div className="dossier-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="dossier-tag">Upcoming World Holiday</span>
                    <span className="dossier-countdown">{activeEvent.daysUntil} Days Away</span>
                  </div>
                  <h3 className="dossier-title">{activeEvent.name}</h3>
                  <div className="dossier-meta">
                    <MapPin size={14} />
                    <span>{activeEvent.location}</span>
                    <span style={{ margin: '0 6px' }}>•</span>
                    <Calendar size={14} />
                    <span>{activeEvent.dates}</span>
                  </div>
                </div>

                <div className="dossier-arrows">
                  <button type="button" className="dossier-nav-btn" onClick={handlePrevEvent} aria-label="Previous event">
                    <ChevronLeft size={16} />
                  </button>
                  <button type="button" className="dossier-nav-btn" onClick={handleNextEvent} aria-label="Next event">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <p className="dossier-tagline">{activeEvent.tagline}</p>

              {/* High-Impact Currency Calibrated Budget Grid */}
              <div className="dossier-stats-grid">
                <div className="dossier-stat-box">
                  <span className="stat-label">Estimated Spend Benchmark</span>
                  <div className="stat-value tabular-data" style={{ color: '#BD3700' }}>
                    {formatCurrency(activeEvent.estBudgetUSD, currentCurrency)}
                  </div>
                  <span className="stat-hint">Calibrated for {currentCurrency}</span>
                </div>

                <div className="dossier-stat-box">
                  <span className="stat-label">Attendance Tier</span>
                  <div className="stat-value">{activeEvent.guestRange}</div>
                  <span className="stat-hint">Vendor capacity limits</span>
                </div>
              </div>

              {/* Logistics & Insider Brief */}
              <div className="dossier-logistics-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <CheckCircle2 size={15} color="#BD3700" />
                  <strong style={{ fontSize: '13px', color: '#3D1E06' }}>Planner Logistics Protocol:</strong>
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.55, color: '#5C3413', margin: 0 }}>
                  {activeEvent.logisticsHighlight}
                </p>
              </div>

              {/* Action Button: 1-Click Launch Plan for this Day */}
              <button
                type="button"
                className="btn btn-primary dossier-cta-btn"
                onClick={() => {
                  onSelectEventForPlanner(activeEvent.categoryKey, activeEvent.name);
                  confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
                  playCelebrationSound(true);
                }}
              >
                <span>Plan for {activeEvent.name}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW B: REGIONAL LONG WEEKENDS (GEO-AWARE)
            ========================================================== */}
        {activeTab === 'weekends' && (
          <div className="disco-weekends-view">
            <div className="weekends-banner">
              <div>
                <strong style={{ fontSize: '14.5px', color: '#3D1E06' }}>
                  Auto-Detected Region: {detectedCountry} ({userRegion})
                </strong>
                <p style={{ fontSize: '13px', color: '#6B4019', margin: '2px 0 0' }}>
                  Upcoming 3-day and 4-day bank holidays to schedule celebrations, getaways, and private retreats.
                </p>
              </div>

              {/* Region Switcher Pills */}
              <div className="weekends-region-pills">
                {[
                  { code: 'US', label: 'United States' },
                  { code: 'EU', label: 'Europe / UK' },
                  { code: 'IN', label: 'India' },
                  { code: 'GLOBAL', label: 'Worldwide' },
                ].map((r) => (
                  <button
                    key={r.code}
                    type="button"
                    className={`region-pill-btn ${userRegion === r.code ? 'active' : ''}`}
                    onClick={() => {
                      setUserRegion(r.code);
                      playPopSound(true);
                    }}
                  >
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Weekends Grid */}
            <div className="weekends-cards-grid">
              {regionalWeekends.map((item) => (
                <div key={item.id} className="weekend-card">
                  <div className="weekend-card-top">
                    <span className="weekend-duration-badge">{item.daysCount}-Day Long Weekend</span>
                    <span className="weekend-days-badge">{item.season}</span>
                  </div>

                  <h4 className="weekend-title">{item.name}</h4>
                  <div className="weekend-dates">
                    <Calendar size={13} style={{ marginRight: '6px' }} />
                    <span>{item.dates}</span>
                  </div>

                  <p className="weekend-suggestion" style={{ fontWeight: 700, color: '#3D1E06' }}>
                    {item.theme}
                  </p>
                  <p style={{ fontSize: '12.5px', color: '#6B4019', lineHeight: 1.5, marginBottom: '16px' }}>
                    {item.suggestedEvent} — {item.idealFor}
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary weekend-plan-btn"
                    onClick={() => {
                      onSelectEventForPlanner('festival', item.name);
                      playCelebrationSound(true);
                    }}
                  >
                    <span>Plan for {item.name}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
