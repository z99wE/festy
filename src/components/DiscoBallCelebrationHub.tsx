import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

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
  lat: number;
  lon: number;
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
    lat: 28.6,
    lon: 77.2,
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
    lat: -22.9,
    lon: -43.1,
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
    lat: 35.6,
    lon: 139.6,
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
    lat: 55.9,
    lon: -3.1,
  },
  {
    id: 'nye',
    name: 'Midnight Gala & New Year’s Eve',
    location: 'Sydney Harbour & NYC',
    country: 'Australia / US',
    dates: 'December 31',
    daysUntil: 67,
    estBudgetUSD: 29500,
    guestRange: '200–800 Guests',
    categoryKey: 'gala',
    tagline: 'Rooftop Champagne Pyrotechnics, Ice Sculptures & Countdown Ball Drops',
    logisticsHighlight: 'Sound permit curfew extension to 1:30 AM; load-in requires dedicated freight elevator reservations.',
    color: '#F57C00',
    lat: -33.8,
    lon: 151.2,
  },
  {
    id: 'glastonbury',
    name: 'Midsummer Solstice & Festival',
    location: 'Somerset & Wiltshire',
    country: 'United Kingdom',
    dates: 'Late June',
    daysUntil: 242,
    estBudgetUSD: 16800,
    guestRange: '150–400 Guests',
    categoryKey: 'festival',
    tagline: 'Wildflower Meadows, Solar Acoustic Stages & Organic Cider Bars',
    logisticsHighlight: 'Temporary field power generators must comply with eco-friendly biodiesel noise dampening guidelines.',
    color: '#EF6C00',
    lat: 51.1,
    lon: -2.7,
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

  // Three.js Reflective 3D Celebration Disco Globe Simulation
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 6.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // DYNAMIC CELEBRATORY ENVIRONMENT MAP
    // This gives the disco ball real shimmering reflections so mirror facets sparkle brilliantly!
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const grad = envCtx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#FFFBEB');
      grad.addColorStop(0.2, '#FDE047');
      grad.addColorStop(0.4, '#FB923C');
      grad.addColorStop(0.6, '#EC4899');
      grad.addColorStop(0.8, '#818CF8');
      grad.addColorStop(1, '#FBBF24');
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 512, 256);

      // Add high-intensity pinpoint reflection spotlights
      const spotColors = ['#FFFFFF', '#FFF7ED', '#FEF08A', '#FBCFE8', '#BAE6FD'];
      for (let i = 0; i < 16; i++) {
        envCtx.fillStyle = spotColors[i % spotColors.length];
        envCtx.beginPath();
        const px = (i * 32 + 16) % 512;
        const py = 40 + ((i * 37) % 176);
        envCtx.arc(px, py, 12 + (i % 3) * 4, 0, Math.PI * 2);
        envCtx.fill();
      }

      const envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envTexture;
    }

    // Warm ambient and pin-spot lighting
    const ambient = new THREE.AmbientLight(0xfffaed, 2.2);
    scene.add(ambient);

    const spotGold = new THREE.DirectionalLight(0xffd54f, 4.0);
    spotGold.position.set(4, 5, 4);
    scene.add(spotGold);

    const spotAmber = new THREE.DirectionalLight(0xff7043, 3.2);
    spotAmber.position.set(-5, 4, 3);
    scene.add(spotAmber);

    const spotWhite = new THREE.DirectionalLight(0xffffff, 3.0);
    spotWhite.position.set(0, -3, 5);
    scene.add(spotWhite);

    // Root Group
    const discoGroup = new THREE.Group();
    scene.add(discoGroup);

    // Hanging Chrome Rod & Loop at Top
    const rodGeom = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 16);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.95,
      roughness: 0.12,
    });
    const rodMesh = new THREE.Mesh(rodGeom, rodMat);
    rodMesh.position.set(0, 2.9, 0);
    discoGroup.add(rodMesh);

    const ringGeom = new THREE.TorusGeometry(0.16, 0.035, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeom, rodMat);
    ringMesh.position.set(0, 1.88, 0);
    discoGroup.add(ringMesh);

    // FACETED MIRROR DISCO GLOBE SPHERE
    // Sphere with latitude / longitude grid facets produces authentic mirror tiles!
    const sphereRadius = 1.72;
    const sphereGeom = new THREE.SphereGeometry(sphereRadius, 48, 28);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f7fa,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      flatShading: true,
      envMapIntensity: 2.8,
    });
    const discoBall = new THREE.Mesh(sphereGeom, sphereMat);
    discoGroup.add(discoBall);

    // Chrome Top Fixture Cap
    const capGeom = new THREE.CylinderGeometry(0.35, 0.45, 0.18, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.95,
      roughness: 0.15,
    });
    const capMesh = new THREE.Mesh(capGeom, capMat);
    capMesh.position.set(0, sphereRadius + 0.06, 0);
    discoBall.add(capMesh);

    // 3D Glowing Festival Beacons around the Globe
    const beaconGroup = new THREE.Group();
    discoBall.add(beaconGroup);

    UPCOMING_WORLD_EVENTS.forEach((ev) => {
      // Convert lat/lon to sphere Cartesian coordinates
      const phi = (90 - ev.lat) * (Math.PI / 180);
      const theta = (ev.lon + 180) * (Math.PI / 180);
      const r = sphereRadius + 0.08;

      const bx = -(r * Math.sin(phi) * Math.cos(theta));
      const by = r * Math.cos(phi);
      const bz = r * Math.sin(phi) * Math.sin(theta);

      // Glowing celebration jewel pin
      const pinGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const pinMat = new THREE.MeshStandardMaterial({
        color: ev.color,
        emissive: ev.color,
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.2,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(bx, by, bz);
      beaconGroup.add(pinMesh);

      // Pulsing beacon halo ring
      const haloGeo = new THREE.RingGeometry(0.14, 0.22, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: ev.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.set(bx, by, bz);
      haloMesh.lookAt(bx * 2, by * 2, bz * 2);
      beaconGroup.add(haloMesh);
    });

    // Radiating Sparkle Flecks Particle Cloud (Reflections sweeping the room)
    const sparkleCount = 140;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePositions = new Float32Array(sparkleCount * 3);

    for (let i = 0; i < sparkleCount; i++) {
      const radius = 2.1 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      sparklePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      sparklePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      sparklePositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));

    // Custom Sparkle Canvas Texture
    const sparkleCanvas = document.createElement('canvas');
    sparkleCanvas.width = 64;
    sparkleCanvas.height = 64;
    const sCtx = sparkleCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      sGrad.addColorStop(0, 'rgba(255, 250, 220, 1)');
      sGrad.addColorStop(0.3, 'rgba(255, 180, 50, 0.8)');
      sGrad.addColorStop(0.7, 'rgba(255, 120, 0, 0.25)');
      sGrad.addColorStop(1, 'rgba(255, 100, 0, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 64, 64);
    }

    const sparkleTexture = new THREE.CanvasTexture(sparkleCanvas);
    const sparkleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: sparkleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const sparklesMesh = new THREE.Points(sparkleGeom, sparkleMaterial);
    discoGroup.add(sparklesMesh);

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

    // Click on canvas triggers celebratory burst
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
      const w = container.clientWidth || 440;
      const h = 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Continuous rotation
      if (!reducedMotion) {
        currentRotY += rotSpeedY;
        rotSpeedY += (0.007 - rotSpeedY) * 0.03;
      }

      currentTiltX += (targetTiltX - currentTiltX) * 0.06;

      discoBall.rotation.y = currentRotY;
      discoBall.rotation.x = currentTiltX;

      sparklesMesh.rotation.y = currentRotY * 1.2;
      sparklesMesh.rotation.x = currentTiltX + Math.sin(elapsed * 0.5) * 0.1;

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
      dom.removeEventListener('touchend', onPointerUp);
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
      <div className="disco-ball-glass-card">
        {/* Top Header with Bubblegum Purplish Blue title */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 28px' }}>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 36px)',
              fontWeight: 850,
              color: 'var(--bubblegum-purple-blue, #5b42f3)',
              lineHeight: 1.25,
            }}
          >
            Upcoming Celebrations & Long Weekends Around the World
          </h2>
          <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Interactive celebration calendar. Spin the 3D celebration globe or select any global festival or 3-day bank holiday to synthesize an audit-ready plan.
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
              <span>World Festivals ({UPCOMING_WORLD_EVENTS.length})</span>
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
              <span>Regional Long Weekends ({regionalWeekends.length})</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            PERMANENT 3D DISCO GLOBE + INTERACTIVE PANELS
            ========================================================== */}
        <div className="disco-stage-layout">
          {/* Left: 3D Interactive Celebration Disco Globe */}
          <div className="disco-canvas-column">
            <div
              ref={canvasRef}
              className="disco-canvas-wrap"
            />

            <div className="disco-ball-action-bar">
              <button
                type="button"
                className="btn btn-secondary disco-spin-btn"
                onClick={handleBallSpinClick}
                aria-label="Spin celebration disco ball"
              >
                <span>Spin Celebration Globe</span>
              </button>
            </div>

            {/* Quick-Selector Chips */}
            {activeTab === 'festivals' ? (
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
            ) : (
              <div className="disco-festival-chips-scroll">
                {regionalWeekends.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="disco-chip-item"
                    onClick={() => {
                      onSelectEventForPlanner(item.suggestedEvent, item.name);
                    }}
                  >
                    <span className="disco-chip-name">{item.name}</span>
                    <span className="disco-chip-days">{item.daysCount}d</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Selected Celebration Dossier Card or Regional Long Weekends */}
          <div className="disco-event-dossier">
            {activeTab === 'festivals' ? (
              <>
                <div className="dossier-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className="dossier-countdown">{activeEvent.daysUntil} Days Away</span>
                    </div>
                    <h3 className="dossier-title">{activeEvent.name}</h3>
                    <div className="dossier-meta">
                      <span>{activeEvent.location}</span>
                      <span style={{ margin: '0 6px' }}>•</span>
                      <span>{activeEvent.dates}</span>
                    </div>
                  </div>

                  <div className="dossier-arrows">
                    <button type="button" className="dossier-nav-btn" onClick={handlePrevEvent} aria-label="Previous event">
                      ‹
                    </button>
                    <button type="button" className="dossier-nav-btn" onClick={handleNextEvent} aria-label="Next event">
                      ›
                    </button>
                  </div>
                </div>

                <p className="dossier-tagline">"{activeEvent.tagline}"</p>

                <div className="dossier-stats-grid">
                  <div className="dossier-stat-box">
                    <span className="stat-label">Estimated Budget</span>
                    <span className="stat-value">{formatCurrency(activeEvent.estBudgetUSD, currentCurrency)}</span>
                  </div>
                  <div className="dossier-stat-box">
                    <span className="stat-label">Crowd Capacity</span>
                    <span className="stat-value">{activeEvent.guestRange}</span>
                  </div>
                </div>

                <div className="dossier-logistics-box">
                  <div style={{ marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Critical Logistics Check
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary, #4338ca)', margin: 0, lineHeight: 1.45 }}>
                    {activeEvent.logisticsHighlight}
                  </p>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14.5px' }}
                    onClick={() => {
                      onSelectEventForPlanner(activeEvent.categoryKey, activeEvent.name);
                    }}
                  >
                    <span>Synthesize {activeEvent.name} Plan</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="dossier-countdown">{regionalWeekends.length} Long Weekends</span>
                  </div>
                  <h3 className="dossier-title">Bank Holidays & 3-Day Escapes</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Pre-calculated bank holidays in {detectedCountry} ideal for reunions, milestone birthdays, and weekend getaways.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                  {regionalWeekends.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.75)',
                        border: '1px solid rgba(255, 140, 60, 0.25)',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                      }}
                      onClick={() => onSelectEventForPlanner(item.suggestedEvent, item.name)}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {item.dates} • {item.daysCount} Days
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }}
                      >
                        Plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
