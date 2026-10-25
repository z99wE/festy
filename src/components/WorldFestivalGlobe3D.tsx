import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Globe,
  Sparkles,
  Calendar,
  Compass,
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  formatCurrency,
  REGIONAL_LONG_WEEKENDS,
  detectUserRegion,
  type LongWeekend,
} from '../utils/currency';

interface WorldFestivalGlobe3DProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (occasionId: string, eventName: string) => void;
}

export interface GlobalFestivalItem {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  lat: number;
  lon: number;
  dates: string;
  daysUntil: number;
  estBudgetUSD: number;
  guestRange: string;
  categoryKey: string;
  tagline: string;
  logisticsHighlight: string;
  color: string;
  hexColor: number;
}

const GLOBAL_FESTIVALS: GlobalFestivalItem[] = [
  {
    id: 'diwali',
    name: 'Diwali Festival of Lights',
    location: 'New Delhi & Global',
    country: 'India',
    flag: '🇮🇳',
    lat: 28.6139,
    lon: 77.209,
    dates: 'Late October / November',
    daysUntil: 18,
    estBudgetUSD: 18500,
    guestRange: '250–600 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Royal Diya Lanterns, Rangoli Courtyards & Sweets Banquet',
    logisticsHighlight: 'Architectural facade lighting, traditional Mithai catering grid, firework safety permits.',
    color: '#FF5E1E',
    hexColor: 0xff5e1e,
  },
  {
    id: 'carnival-rio',
    name: 'Rio Carnival & Mardi Gras',
    location: 'Rio de Janeiro',
    country: 'Brazil',
    flag: '🇧🇷',
    lat: -22.9068,
    lon: -43.1729,
    dates: 'February Festive Season',
    daysUntil: 112,
    estBudgetUSD: 32000,
    guestRange: '500+ Open Egress',
    categoryKey: 'festival',
    tagline: 'Samba Rhythms, Costume Parades & Street Stages',
    logisticsHighlight: 'Mobile sound trucks, perimeter barricades, hydration stations, and VIP skybox catering.',
    color: '#FFB703',
    hexColor: 0xffb703,
  },
  {
    id: 'halloween',
    name: 'Halloween & Fall Gala',
    location: 'New York City',
    country: 'United States',
    flag: '🇺🇸',
    lat: 40.7128,
    lon: -74.006,
    dates: 'October 31',
    daysUntil: 6,
    estBudgetUSD: 14500,
    guestRange: '150–350 Guests',
    categoryKey: 'birthday',
    tagline: 'Immersive Haunted Ballroom, Fog FX & Midnight DJ',
    logisticsHighlight: 'DMX strobe synchronized to bass drops, dry-ice fog arrays, mixology bar queue management.',
    color: '#FF8A47',
    hexColor: 0xff8a47,
  },
  {
    id: 'hanami',
    name: 'Cherry Blossom Hanami Festival',
    location: 'Kyoto & Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lon: 139.6503,
    dates: 'Late March – April',
    daysUntil: 154,
    estBudgetUSD: 12000,
    guestRange: '80–200 Guests',
    categoryKey: 'anniversary',
    tagline: 'Pink Blossom Canopies, Sake Tastings & Bento Feasts',
    logisticsHighlight: 'Park permit allocations, low-emission heating lamps, zero-waste biodegradable packaging.',
    color: '#FF4D6D',
    hexColor: 0xff4d6d,
  },
  {
    id: 'nye-gala',
    name: 'New Year’s Eve Midnight Gala',
    location: 'Paris & Worldwide',
    country: 'France',
    flag: '🇫🇷',
    lat: 48.8566,
    lon: 2.3522,
    dates: 'December 31',
    daysUntil: 67,
    estBudgetUSD: 28000,
    guestRange: '200–500 Guests',
    categoryKey: 'charity_gala',
    tagline: 'Black-Tie Champagne Countdown & Projection Mapping',
    logisticsHighlight: 'Midnight toast simultaneous uncorking for 400+ flutes, synchronized laser countdown.',
    color: '#BD3700',
    hexColor: 0xbd3700,
  },
  {
    id: 'lunar-new-year',
    name: 'Lunar New Year Spring Festival',
    location: 'Shanghai & Singapore',
    country: 'China',
    flag: '🇨🇳',
    lat: 31.2304,
    lon: 121.4737,
    dates: 'January / February',
    daysUntil: 94,
    estBudgetUSD: 24000,
    guestRange: '300–700 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Lion Dance Performances, Red Lanterns & Heritage Banquet',
    logisticsHighlight: 'Round 10-top banquet acoustics, high-output ceremonial tea service, auspicious favor packages.',
    color: '#E64909',
    hexColor: 0xe64909,
  },
  {
    id: 'oktoberfest',
    name: 'Oktoberfest Autumn Pavilion',
    location: 'Munich',
    country: 'Germany',
    flag: '🇩🇪',
    lat: 48.1351,
    lon: 11.582,
    dates: 'Late September – October',
    daysUntil: 335,
    estBudgetUSD: 22500,
    guestRange: '250–800 Guests',
    categoryKey: 'festival',
    tagline: 'Artisanal Stein Bars, Brass Bands & Pretzel Stations',
    logisticsHighlight: 'Heavy-duty beer draught chillers, continuous glassware sanitation loop, acoustic dampening tents.',
    color: '#FFB703',
    hexColor: 0xffb703,
  },
  {
    id: 'glastonbury',
    name: 'Summer Solstice Arts Festival',
    location: 'Somerset',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: 51.1444,
    lon: -2.5855,
    dates: 'June Solstice',
    daysUntil: 238,
    estBudgetUSD: 36000,
    guestRange: '400+ Open Air',
    categoryKey: 'festival',
    tagline: 'Multi-Stage Indie Concerts, Glamping & Eco Food Villages',
    logisticsHighlight: 'Off-grid silent generator power drops, artist green-room trailers, sanitary mobile stations.',
    color: '#06D6A0',
    hexColor: 0x06d6a0,
  },
  {
    id: 'eid-celebration',
    name: 'Eid al-Fitr Grand Celebration',
    location: 'Dubai & Global',
    country: 'UAE',
    flag: '🇦🇪',
    lat: 25.2048,
    lon: 55.2708,
    dates: 'Spring Holiday Season',
    daysUntil: 168,
    estBudgetUSD: 26000,
    guestRange: '350–800 Guests',
    categoryKey: 'cultural_fest',
    tagline: 'Opulent Majlis Seating, Oud Aromatics & Gourmet Feasts',
    logisticsHighlight: 'Temperature-controlled outdoor marquee, family lounge zoning, luxury gold-trimmed tableware.',
    color: '#059669',
    hexColor: 0x059669,
  },
  {
    id: 'thanksgiving-us',
    name: 'Thanksgiving Harvest Reunion',
    location: 'Chicago & nationwide',
    country: 'United States',
    flag: '🇺🇸',
    lat: 41.8781,
    lon: -87.6298,
    dates: 'Late November',
    daysUntil: 31,
    estBudgetUSD: 9500,
    guestRange: '40–120 Guests',
    categoryKey: 'anniversary',
    tagline: 'Artisanal Roasts, Cider Bars & Gratitude Storytelling',
    logisticsHighlight: 'Multi-oven synchronized catering, warm cider stations, heated veranda transition areas.',
    color: '#962E03',
    hexColor: 0x962e03,
  },
  {
    id: 'st-patricks',
    name: 'St. Patrick’s Day Street Gala',
    location: 'Dublin & Chicago',
    country: 'Ireland',
    flag: '🇮🇪',
    lat: 53.3498,
    lon: -6.2603,
    dates: 'March 17',
    daysUntil: 143,
    estBudgetUSD: 16000,
    guestRange: '200–450 Guests',
    categoryKey: 'community',
    tagline: 'Emerald Green Illuminations, Celtic Music & Craft Brews',
    logisticsHighlight: 'Outdoor parade viewing tiers, quick-serve stout taps, green LED architectural washers.',
    color: '#06D6A0',
    hexColor: 0x06d6a0,
  },
  {
    id: 'holi-festival',
    name: 'Holi Festival of Vibrant Colors',
    location: 'Jaipur & Delhi',
    country: 'India',
    flag: '🇮🇳',
    lat: 26.9124,
    lon: 75.7873,
    dates: 'March Spring Full Moon',
    daysUntil: 139,
    estBudgetUSD: 15500,
    guestRange: '200–500 Guests',
    categoryKey: 'community',
    tagline: 'Organic Herbal Gulal, Thandai Stations & Live Dhol Beats',
    logisticsHighlight: 'Eco-certified herbal colors, rain dance sprinkler array, dry powder washdown stations.',
    color: '#FF4D6D',
    hexColor: 0xff4d6d,
  },
];

// Helper to convert lat/long to 3D Cartesian coordinates on sphere
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export const WorldFestivalGlobe3D: React.FC<WorldFestivalGlobe3DProps> = ({
  reducedMotion = false,
  currentCurrency = 'USD',
  onSelectEventForPlanner,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedFestival, setSelectedFestival] = useState<GlobalFestivalItem>(GLOBAL_FESTIVALS[0]);
  const [userRegion, setUserRegion] = useState<string>('US');
  const [detectedCountry, setDetectedCountry] = useState<string>('United States');
  const [activeTab, setActiveTab] = useState<'globe' | 'long-weekends'>('globe');

  // Auto-detect user region on mount
  useEffect(() => {
    const detected = detectUserRegion();
    setUserRegion(detected.regionCode);
    setDetectedCountry(detected.countryName);
  }, []);

  const regionalData = REGIONAL_LONG_WEEKENDS[userRegion] || REGIONAL_LONG_WEEKENDS.US;

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 460;

    // 1. Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 7.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Warm Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xff8a47, 3.0);
    sunLight.position.set(8, 6, 8);
    scene.add(sunLight);

    const fillLight = new THREE.PointLight(0xffb703, 1.8, 20);
    fillLight.position.set(-8, -4, 4);
    scene.add(fillLight);

    // 3. Globe Sphere with Brand Aesthetics (Warm Golden-Orange Planet)
    const globeRadius = 2.8;
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Planetary Core
    const globeGeom = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffd9b3,
      emissive: 0xff8a47,
      emissiveIntensity: 0.14,
      roughness: 0.45,
      metalness: 0.15,
    });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    globeGroup.add(globeMesh);

    // Latitude / Longitude Festive Gridlines
    const wireGeom = new THREE.SphereGeometry(globeRadius + 0.015, 24, 18);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xbd3700,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireMesh = new THREE.Mesh(wireGeom, wireMat);
    globeGroup.add(wireMesh);

    // Atmospheric Glow Halo
    const haloGeom = new THREE.SphereGeometry(globeRadius + 0.35, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xff5e1e,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    globeGroup.add(haloMesh);

    // 4. Add Interactive Festival Marker Pins on the Globe
    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    const pinMeshes: { id: string; mesh: THREE.Group; beacon: THREE.Mesh; item: GlobalFestivalItem }[] = [];

    GLOBAL_FESTIVALS.forEach((item) => {
      const pinObj = new THREE.Group();
      const pos = latLongToVector3(item.lat, item.lon, globeRadius + 0.02);
      pinObj.position.copy(pos);
      pinObj.lookAt(pos.clone().multiplyScalar(2)); // orient outwards

      // Base ring
      const ringGeom = new THREE.RingGeometry(0.08, 0.14, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: item.hexColor,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      pinObj.add(ring);

      // Vertical marker pin
      const stemGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8);
      const stemMat = new THREE.MeshStandardMaterial({
        color: 0x28140a,
        metalness: 0.3,
      });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.rotation.x = Math.PI / 2;
      stem.position.z = 0.18;
      pinObj.add(stem);

      // Glowing top gem / beacon
      const beaconGeom = new THREE.SphereGeometry(0.12, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: item.hexColor,
        emissive: item.hexColor,
        emissiveIntensity: 0.9,
      });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.z = 0.36;
      pinObj.add(beacon);

      pinGroup.add(pinObj);
      pinMeshes.push({ id: item.id, mesh: pinObj, beacon, item });
    });

    // 5. User Drag & Click Controls
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotY = 0.5;
    let targetRotX = 0.2;
    let currentRotY = 0.5;
    let currentRotX = 0.2;

    const dom = renderer.domElement;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      targetRotY += dx * 0.007;
      targetRotX += dy * 0.005;
      targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch Support
    let touchX = 0;
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const dx = e.touches[0].clientX - touchX;
        const dy = e.touches[0].clientY - touchY;
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
        targetRotY += dx * 0.007;
        targetRotX += dy * 0.005;
        targetRotX = Math.max(-0.9, Math.min(0.9, targetRotX));
      }
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // 6. Rotate Globe to Focused Festival Function
    const rotateToFestival = (fest: GlobalFestivalItem) => {
      // Calculate target rotation Y and X from lat/long
      const phi = (fest.lat * Math.PI) / 180;
      const theta = (fest.lon * Math.PI) / 180;
      targetRotY = -theta - Math.PI / 2;
      targetRotX = phi;
    };

    // 7. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 8. 60FPS Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Gentle auto-rotation when user is not dragging
      if (!isDragging) {
        targetRotY += 0.0018;
      }

      currentRotY += (targetRotY - currentRotY) * 0.06;
      currentRotX += (targetRotX - currentRotX) * 0.06;

      globeGroup.rotation.y = currentRotY;
      globeGroup.rotation.x = currentRotX;

      // Pulse festival marker beacons
      pinMeshes.forEach((pin, i) => {
        const pulse = 1 + Math.sin(time * 3 + i) * 0.22;
        pin.beacon.scale.set(pulse, pulse, pulse);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Store rotate function on container ref for component access
    (container as unknown as { rotateToFestival: typeof rotateToFestival }).rotateToFestival = rotateToFestival;

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeom.dispose();
      globeMat.dispose();
      wireGeom.dispose();
      wireMat.dispose();
      haloGeom.dispose();
      haloMat.dispose();
    };
  }, [reducedMotion]);

  const handleSelectFestival = (fest: GlobalFestivalItem) => {
    setSelectedFestival(fest);
    const container = mountRef.current as unknown as { rotateToFestival?: (f: GlobalFestivalItem) => void };
    if (container?.rotateToFestival) {
      container.rotateToFestival(fest);
    }
  };

  const handleLaunchPlan = (occasionId: string, eventName: string) => {
    onSelectEventForPlanner(occasionId, eventName);
  };

  return (
    <div className="world-globe-section-wrapper" id="world-globe">
      <div className="content-wrapper">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 28px' }}>
          <div className="hero-badge" style={{ margin: '0 auto 12px', display: 'inline-flex' }}>
            <Globe size={14} style={{ marginRight: '6px' }} />
            <span>Interactive 3D World Festival Horizon</span>
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Where the World Celebrates Next: 3D Holiday & Festival Navigator
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Spin the 3D globe to discover the largest upcoming festivals worldwide, or view your detected region’s next 3-day and 4-day long weekends to plan high-impact events without last-minute stress.
          </p>

          {/* Mode Switcher: 3D World Globe vs Regional Long Weekends */}
          <div className="globe-view-toggle-bar">
            <button
              type="button"
              className={`globe-toggle-btn ${activeTab === 'globe' ? 'active' : ''}`}
              onClick={() => setActiveTab('globe')}
            >
              <Globe size={15} />
              <span>3D World Festival Globe (12 Worldwide)</span>
            </button>
            <button
              type="button"
              className={`globe-toggle-btn ${activeTab === 'long-weekends' ? 'active' : ''}`}
              onClick={() => setActiveTab('long-weekends')}
            >
              <Calendar size={15} />
              <span>Upcoming Long Weekends ({regionalData.flag} {regionalData.regionName})</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            TAB 1: 3D WORLD FESTIVAL GLOBE VIEW
            ========================================================== */}
        {activeTab === 'globe' && (
          <div className="world-globe-interactive-grid">
            {/* 3D WebGL Globe Viewport */}
            <div className="globe-canvas-card">
              <div ref={mountRef} className="globe-three-canvas-wrap" />

              <div className="globe-hint-overlay">
                <Compass size={14} className="spin-slow" />
                <span>Drag to spin the 3D Earth • Click pins to focus</span>
              </div>

              {/* Quick Festival Filter Pills on Globe */}
              <div className="globe-quick-pins-strip">
                {GLOBAL_FESTIVALS.slice(0, 6).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`globe-pin-chip ${selectedFestival.id === item.id ? 'active' : ''}`}
                    onClick={() => handleSelectFestival(item)}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Festival Blueprint Card */}
            <div className="globe-detail-card">
              <div className="festival-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{selectedFestival.flag}</span>
                  <div>
                    <h3 className="festival-title">{selectedFestival.name}</h3>
                    <div className="festival-location-row">
                      <MapPin size={13} color="var(--orange-600)" />
                      <span>{selectedFestival.location}, {selectedFestival.country}</span>
                    </div>
                  </div>
                </div>

                <div className="festival-countdown-badge">
                  <Clock size={12} />
                  <span>In {selectedFestival.daysUntil} Days</span>
                </div>
              </div>

              <p className="festival-tagline">
                "{selectedFestival.tagline}"
              </p>

              {/* Key Commercial Metrics */}
              <div className="festival-metrics-shelf">
                <div className="f-metric-box">
                  <span className="f-metric-lbl">Est. Celebration Budget</span>
                  <span className="f-metric-val">
                    {formatCurrency(selectedFestival.estBudgetUSD, currentCurrency)}
                  </span>
                </div>
                <div className="f-metric-box">
                  <span className="f-metric-lbl">Typical Attendance</span>
                  <span className="f-metric-val" style={{ color: 'var(--text-primary)' }}>
                    {selectedFestival.guestRange}
                  </span>
                </div>
              </div>

              {/* Logistics & Timing Brief */}
              <div className="festival-logistics-box">
                <div className="f-logistics-head">
                  <ShieldCheck size={14} color="#059669" />
                  <span>Key Operational & Vendor Focus</span>
                </div>
                <p className="f-logistics-desc">
                  {selectedFestival.logisticsHighlight}
                </p>
              </div>

              {/* 1-Click Launch into Live Planner */}
              <button
                type="button"
                className="btn btn-primary festival-plan-btn"
                onClick={() => handleLaunchPlan(selectedFestival.categoryKey, selectedFestival.name)}
              >
                <span>Plan {selectedFestival.name} Blueprint</span>
                <ArrowRight size={16} />
              </button>

              {/* List of other worldwide festivals */}
              <div className="other-festivals-list">
                <span className="other-festivals-title">Select from 12 World Festivals:</span>
                <div className="other-festivals-scroll">
                  {GLOBAL_FESTIVALS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`other-fest-pill ${selectedFestival.id === f.id ? 'active' : ''}`}
                      onClick={() => handleSelectFestival(f)}
                    >
                      <span>{f.flag}</span>
                      <span>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 2: REGIONAL UPCOMING LONG WEEKEND SUGGESTER
            ========================================================== */}
        {activeTab === 'long-weekends' && (
          <div className="long-weekends-container">
            {/* Region Detection Banner */}
            <div className="region-detection-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{regionalData.flag}</span>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#BD3700' }}>
                    Geo & IP Regional Detection
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Upcoming Long Weekends for {detectedCountry} ({regionalData.regionName})
                  </h3>
                </div>
              </div>

              {/* Region Switcher Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Switch Region:</span>
                <select
                  value={userRegion}
                  onChange={(e) => setUserRegion(e.target.value)}
                  className="region-select-dropdown"
                  aria-label="Select region for long weekends"
                >
                  <option value="US">🇺🇸 United States & Canada</option>
                  <option value="EU">🇪🇺 European Union & UK</option>
                  <option value="IN">🇮🇳 India & South Asia</option>
                  <option value="GLOBAL">🌍 International Global</option>
                </select>
              </div>
            </div>

            {/* Long Weekend Cards Grid */}
            <div className="long-weekends-grid">
              {regionalData.longWeekends.map((lw: LongWeekend) => (
                <div key={lw.id} className="long-weekend-card">
                  <div className="lw-top-row">
                    <span className="lw-days-tag">{lw.daysCount}-Day Long Weekend</span>
                    <span className="lw-season-tag">{lw.season}</span>
                  </div>

                  <h4 className="lw-name">{lw.name}</h4>
                  <div className="lw-dates-row">
                    <Calendar size={13} color="#FF5E1E" />
                    <span>{lw.dates}</span>
                  </div>

                  <div className="lw-theme-box">
                    <div className="lw-theme-title">
                      <Sparkles size={13} color="#BD3700" />
                      <span>Recommended Concept: <strong>{lw.theme}</strong></span>
                    </div>
                    <p className="lw-theme-detail">{lw.idealFor}</p>
                  </div>

                  <div className="lw-bottom-action">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669', fontWeight: 700 }}>
                      <CheckCircle2 size={13} />
                      <span>{lw.suggestedEvent}</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary lw-plan-btn"
                      onClick={() => handleLaunchPlan('birthday', lw.name)}
                    >
                      <span>Plan {lw.daysCount}-Day Event</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
