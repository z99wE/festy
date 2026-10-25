import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Sparkles,
  MapPin,
  Globe,
  ShieldAlert,
  ArrowRight,
  Bot,
  Search,
} from 'lucide-react';

import { formatCurrency } from '../utils/currency';
import { playPopSound, playCelebrationSound } from '../utils/audio';
import {
  WORLDWIDE_LONG_WEEKENDS,
  UPCOMING_WORLD_FESTIVALS,
  type EventPlanningContext,
} from '../data/globalCelebrations';
import { openFestiAIChat } from './FestiChatbot';

interface DiscoBallCelebrationHubProps {
  reducedMotion?: boolean;
  currentCurrency?: string;
  onSelectEventForPlanner: (
    occasionId: string,
    eventName: string,
    context?: EventPlanningContext
  ) => void;
}

export const DiscoBallCelebrationHub: React.FC<DiscoBallCelebrationHubProps> = ({
  reducedMotion = false,
  currentCurrency = 'USD',
  onSelectEventForPlanner,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'weekends' | 'festivals'>('weekends');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selected items for deep-dive dossiers
  const [selectedWeekendId, setSelectedWeekendId] = useState<string>(WORLDWIDE_LONG_WEEKENDS[0].id);
  const [selectedFestivalId, setSelectedFestivalId] = useState<string>(UPCOMING_WORLD_FESTIVALS[0].id);
  const [, setSpinBoost] = useState(0);

  // Filtered worldwide long weekends
  const filteredWeekends = useMemo(() => {
    return WORLDWIDE_LONG_WEEKENDS.filter((item) => {
      const matchRegion =
        selectedRegion === 'All' || item.region === selectedRegion || item.region === 'All';
      const matchMonth =
        selectedMonth === 'All' || item.month.toLowerCase().includes(selectedMonth.toLowerCase());
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.theme.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchMonth && matchSearch;
    });
  }, [selectedRegion, selectedMonth, searchQuery]);

  const activeWeekend = useMemo(() => {
    return (
      WORLDWIDE_LONG_WEEKENDS.find((w) => w.id === selectedWeekendId) ||
      filteredWeekends[0] ||
      WORLDWIDE_LONG_WEEKENDS[0]
    );
  }, [selectedWeekendId, filteredWeekends]);

  const activeFestival = useMemo(() => {
    return (
      UPCOMING_WORLD_FESTIVALS.find((e) => e.id === selectedFestivalId) ||
      UPCOMING_WORLD_FESTIVALS[0]
    );
  }, [selectedFestivalId]);

  // Unique months for filter pills
  const availableMonths = useMemo(() => {
    return [
      'All',
      'November 2026',
      'December 2026',
      'January 2027',
      'February 2027',
      'March 2027',
      'April 2027',
      'May 2027',
      'June 2027',
    ];
  }, []);

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
    let envTexture: THREE.CanvasTexture | null = null;
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const grad = envCtx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#FFFBEB');
      grad.addColorStop(0.2, '#EDE9FE');
      grad.addColorStop(0.4, '#C7D2FE');
      grad.addColorStop(0.6, '#EC4899');
      grad.addColorStop(0.8, '#818CF8');
      grad.addColorStop(1, '#5B42F3');
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 512, 256);

      // Pinpoint reflection spotlights
      const spotColors = ['#FFFFFF', '#EDE9FE', '#C7D2FE', '#FBCFE8', '#BAE6FD'];
      for (let i = 0; i < 16; i++) {
        envCtx.fillStyle = spotColors[i % spotColors.length];
        envCtx.beginPath();
        const px = (i * 32 + 16) % 512;
        const py = 40 + ((i * 37) % 176);
        envCtx.arc(px, py, 12 + (i % 3) * 4, 0, Math.PI * 2);
        envCtx.fill();
      }

      envTexture = new THREE.CanvasTexture(envCanvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = envTexture;
    }

    // Warm ambient and pin-spot lighting
    const ambient = new THREE.AmbientLight(0xfffaed, 2.2);
    scene.add(ambient);

    const spotGold = new THREE.DirectionalLight(0xffd54f, 4.0);
    spotGold.position.set(4, 5, 4);
    scene.add(spotGold);

    const spotAmber = new THREE.DirectionalLight(0x818cf8, 3.2);
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
    rodMesh.position.set(0, 2.3, 0);
    discoGroup.add(rodMesh);

    const loopGeom = new THREE.TorusGeometry(0.18, 0.04, 16, 32);
    const loopMesh = new THREE.Mesh(loopGeom, rodMat);
    loopMesh.position.set(0, 1.25, 0);
    discoGroup.add(loopMesh);

    // Core Sphere with Mirror Facets
    const radius = 1.35;
    const segments = 24;
    const sphereGeom = new THREE.SphereGeometry(radius, segments, segments);

    const mirrorCanvas = document.createElement('canvas');
    mirrorCanvas.width = 1024;
    mirrorCanvas.height = 512;
    const mCtx = mirrorCanvas.getContext('2d');
    if (mCtx) {
      mCtx.fillStyle = '#b8b8b8';
      mCtx.fillRect(0, 0, 1024, 512);

      const tileCols = 64;
      const tileRows = 32;
      const tW = 1024 / tileCols;
      const tH = 512 / tileRows;

      for (let r = 0; r < tileRows; r++) {
        for (let c = 0; c < tileCols; c++) {
          const lum = 180 + Math.floor(Math.sin(r * 4.2 + c * 3.1) * 45 + Math.random() * 30);
          mCtx.fillStyle = `rgb(${lum}, ${lum}, ${lum})`;
          mCtx.fillRect(c * tW + 1, r * tH + 1, tW - 2, tH - 2);

          mCtx.strokeStyle = 'rgba(0,0,0,0.45)';
          mCtx.lineWidth = 1;
          mCtx.strokeRect(c * tW, r * tH, tW, tH);
        }
      }
    }
    const mirrorTexture = new THREE.CanvasTexture(mirrorCanvas);
    mirrorTexture.wrapS = THREE.RepeatWrapping;
    mirrorTexture.wrapT = THREE.RepeatWrapping;

    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.96,
      roughness: 0.14,
      map: mirrorTexture,
      bumpMap: mirrorTexture,
      bumpScale: 0.04,
      flatShading: true,
    });
    const ballMesh = new THREE.Mesh(sphereGeom, ballMaterial);
    discoGroup.add(ballMesh);

    // Interactive Raycasting Hotspots for Celebrations
    const pinGroup = new THREE.Group();
    discoGroup.add(pinGroup);

    const pinGeometry = new THREE.SphereGeometry(0.09, 16, 16);
    const ringGeometry = new THREE.TorusGeometry(0.14, 0.025, 12, 24);

    UPCOMING_WORLD_FESTIVALS.forEach((evt) => {
      const phi = (90 - evt.lat) * (Math.PI / 180);
      const theta = (evt.lon + 180) * (Math.PI / 180);

      const r = radius + 0.06;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      const pinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(evt.color),
        emissive: new THREE.Color(evt.color),
        emissiveIntensity: 0.85,
        metalness: 0.6,
        roughness: 0.2,
      });

      const pin = new THREE.Mesh(pinGeometry, pinMat);
      pin.position.set(x, y, z);
      pin.userData = { id: evt.id, name: evt.name };

      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(evt.color),
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMat);
      ring.position.set(x, y, z);
      ring.lookAt(0, 0, 0);

      pinGroup.add(pin);
      pinGroup.add(ring);
    });

    // Sparkle Particle Field Surrounding Globe
    const sparkleCount = 60;
    const sparkleGeom = new THREE.BufferGeometry();
    const sparklePos = new Float32Array(sparkleCount * 3);
    for (let i = 0; i < sparkleCount; i++) {
      const spR = radius + 0.35 + Math.random() * 0.9;
      const spTheta = Math.random() * Math.PI * 2;
      const spPhi = Math.acos(2 * Math.random() - 1);
      sparklePos[i * 3] = spR * Math.sin(spPhi) * Math.cos(spTheta);
      sparklePos[i * 3 + 1] = spR * Math.cos(spPhi);
      sparklePos[i * 3 + 2] = spR * Math.sin(spPhi) * Math.sin(spTheta);
    }
    sparkleGeom.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3));
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xEDE9FE,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
    });
    const sparklePoints = new THREE.Points(sparkleGeom, sparkleMat);
    discoGroup.add(sparklePoints);

    // Animation Loop
    let animId: number;
    let baseSpeed = 0.0045;
    let currentBoost = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!reducedMotion) {
        discoGroup.rotation.y += baseSpeed + currentBoost;
        discoGroup.rotation.x = Math.sin(Date.now() * 0.001) * 0.08;
        sparklePoints.rotation.y -= 0.002;

        if (currentBoost > 0.0001) {
          currentBoost *= 0.96;
        } else {
          currentBoost = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 440;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sphereGeom.dispose();
      ballMaterial.dispose();
      envTexture?.dispose();
      mirrorTexture.dispose();
    };
  }, [reducedMotion]);

  const handleBallSpinClick = () => {
    setSpinBoost(0.085);
    playCelebrationSound(true);

    if (activeTab === 'festivals') {
      const randomIdx = Math.floor(Math.random() * UPCOMING_WORLD_FESTIVALS.length);
      const chosen = UPCOMING_WORLD_FESTIVALS[randomIdx];
      setSelectedFestivalId(chosen.id);
    } else {
      const randomIdx = Math.floor(Math.random() * filteredWeekends.length);
      const chosen = filteredWeekends[randomIdx] || WORLDWIDE_LONG_WEEKENDS[0];
      setSelectedWeekendId(chosen.id);
    }

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#5B42F3', '#818CF8', '#C7D2FE', '#06D6A0', '#FFB703'],
    });
  };

  const handleLaunchPlan = (
    occasionId: string,
    eventName: string,
    context?: EventPlanningContext
  ) => {
    playCelebrationSound(true);
    onSelectEventForPlanner(occasionId, eventName, context);
  };

  return (
    <section
      className="disco-celebration-section"
      aria-label="Upcoming Celebrations and Worldwide Long Weekends"
    >
      <div className="content-wrapper">
        {/* Section Header */}
        <div className="section-header">
          <div className="disco-header-badge">
            <Globe size={14} className="badge-sparkle-icon" />
            <span>Interactive Worldwide Celebration Calendar & Long Weekend Hub</span>
          </div>

          <h2
            className="section-title"
            style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }}
          >
            Upcoming Celebrations & Long Weekends Around the World
          </h2>
          <p className="section-subtitle">
            Curated 6-month calendar of worldwide long weekends, festive bank holidays, and major celebrations.
            Select any date block to explore logistical checklists and synthesize an audit-ready plan with Festi AI.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="disco-tab-bar" role="tablist">
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
              <Calendar size={15} />
              <span>Worldwide Long Weekends ({WORLDWIDE_LONG_WEEKENDS.length})</span>
            </button>

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
              <Sparkles size={15} />
              <span>Major World Festivals ({UPCOMING_WORLD_FESTIVALS.length})</span>
            </button>
          </div>
        </div>

        {/* Global Region & Search Filter Controls (for Worldwide Long Weekends) */}
        {activeTab === 'weekends' && (
          <div className="worldwide-filters-bar">
            {/* Region Filter Pills */}
            <div className="region-filter-pills" role="group" aria-label="Filter by region">
              {(['All', 'Americas', 'Europe & UK', 'Asia & Pacific'] as const).map((reg) => (
                <button
                  key={reg}
                  type="button"
                  className={`region-pill-btn ${selectedRegion === reg ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRegion(reg);
                    playPopSound(true);
                  }}
                >
                  <span>{reg === 'All' ? '🌐 All Regions' : reg}</span>
                </button>
              ))}

              {/* Month Quick Filter */}
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  playPopSound(true);
                }}
                className="region-pill-btn"
                style={{ outline: 'none', cursor: 'pointer' }}
                aria-label="Filter by month"
              >
                {availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? '📅 All 6 Months' : m}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input Bar */}
            <div className="worldwide-search-box">
              <Search size={14} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
              <input
                type="text"
                placeholder="Search event, country or month..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="worldwide-search-input"
                aria-label="Search celebration or country"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3D Disco Stage & Interactive Workspace Grid */}
        <div className="disco-stage-layout">
          {/* Left Column: 3D Globe + Quick Selector List */}
          <div className="disco-canvas-column">
            <div ref={canvasRef} className="disco-canvas-wrap" />

            <div className="disco-ball-action-bar">
              <button
                type="button"
                className="btn btn-secondary disco-spin-btn"
                onClick={handleBallSpinClick}
                aria-label="Spin celebration disco ball"
              >
                <Sparkles size={15} />
                <span>Spin Celebration Globe</span>
              </button>
            </div>

            {/* Quick-Selector Chips */}
            <div className="disco-festival-chips-scroll">
              {activeTab === 'festivals'
                ? UPCOMING_WORLD_FESTIVALS.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      className={`disco-chip-item ${selectedFestivalId === event.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedFestivalId(event.id);
                        playPopSound(true);
                      }}
                    >
                      <span className="disco-chip-name">{event.name}</span>
                      <span className="disco-chip-days">{event.daysUntil}d</span>
                    </button>
                  ))
                : filteredWeekends.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`disco-chip-item ${selectedWeekendId === item.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedWeekendId(item.id);
                        playPopSound(true);
                      }}
                    >
                      <span>{item.flag}</span>
                      <span className="disco-chip-name">{item.name}</span>
                      <span className="disco-chip-days">{item.daysCount}d</span>
                    </button>
                  ))}
            </div>

            {/* Chronological List of All Events */}
            <div className="worldwide-events-scroll-list">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeTab === 'weekends' ? `Upcoming Extended Breaks (${filteredWeekends.length})` : 'World Festival Calendar'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Click to inspect details
                </span>
              </div>

              {activeTab === 'weekends' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filteredWeekends.map((item) => {
                    const isSelected = selectedWeekendId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`weekend-list-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedWeekendId(item.id);
                          playPopSound(true);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedWeekendId(item.id);
                          }
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '20px' }}>{item.flag}</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {item.dates} • <span style={{ fontWeight: 700 }}>{item.daysCount} Days</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchPlan(item.categoryKey, item.name, {
                              id: item.id,
                              name: item.name,
                              category: item.categoryKey,
                              location: `${item.country} (${item.region})`,
                              dates: item.dates,
                              daysCount: item.daysCount,
                              budgetUSD: item.estBudgetUSD,
                              guestRange: item.guestRange,
                              theme: item.theme,
                              logisticsHighlight: item.logisticsHighlight,
                              aiPrompt: item.aiPrompt,
                            });
                          }}
                        >
                          Plan
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {UPCOMING_WORLD_FESTIVALS.map((fest) => {
                    const isSelected = selectedFestivalId === fest.id;
                    return (
                      <div
                        key={fest.id}
                        className={`weekend-list-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedFestivalId(fest.id);
                          playPopSound(true);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '13px', color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                            {fest.name}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {fest.location} • {fest.dates}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchPlan(fest.categoryKey, fest.name, {
                              id: fest.id,
                              name: fest.name,
                              category: fest.categoryKey,
                              location: fest.location,
                              dates: fest.dates,
                              budgetUSD: fest.estBudgetUSD,
                              guestRange: fest.guestRange,
                              theme: fest.tagline,
                              logisticsHighlight: fest.logisticsHighlight,
                              aiPrompt: fest.aiPrompt,
                            });
                          }}
                        >
                          Plan
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Celebration Dossier Card */}
          <div className="disco-event-dossier">
            {activeTab === 'weekends' ? (
              <>
                <div className="dossier-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span className="dossier-tag">
                        {activeWeekend.flag} {activeWeekend.country}
                      </span>
                      <span className="dossier-countdown">
                        {activeWeekend.daysCount} Days ({activeWeekend.season})
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#EDE9FE',
                          color: 'var(--bubblegum-purple-blue, #5b42f3)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {activeWeekend.month}
                      </span>
                    </div>

                    <h3 className="dossier-title">{activeWeekend.name}</h3>

                    <div className="dossier-meta">
                      <Calendar size={13} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                      <span>{activeWeekend.dates}</span>
                      <span style={{ margin: '0 6px' }}>•</span>
                      <MapPin size={13} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                      <span>{activeWeekend.region}</span>
                    </div>
                  </div>
                </div>

                <p className="dossier-tagline">"{activeWeekend.tagline}"</p>

                {/* Key Metrics */}
                <div className="dossier-stats-grid">
                  <div className="dossier-stat-box">
                    <span className="stat-label">Estimated Budget</span>
                    <span className="stat-value">
                      {formatCurrency(activeWeekend.estBudgetUSD, currentCurrency)}
                    </span>
                  </div>
                  <div className="dossier-stat-box">
                    <span className="stat-label">Crowd Capacity</span>
                    <span className="stat-value">{activeWeekend.guestRange}</span>
                  </div>
                </div>

                {/* Logistics Checkpoint */}
                <div className="dossier-logistics-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <ShieldAlert size={14} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Critical Logistics Checkpoint
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary, #4338ca)', margin: 0, lineHeight: 1.45 }}>
                    {activeWeekend.logisticsHighlight}
                  </p>
                </div>

                {/* Festi AI Prompt Preview Box */}
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 14px',
                    background: 'rgba(91, 66, 243, 0.06)',
                    border: '1.5px dashed var(--bubblegum-purple-blue, #5b42f3)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Bot size={14} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                      Festi AI Context Ready
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{activeWeekend.aiPrompt}"
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: '15px' }}
                    onClick={() => {
                      handleLaunchPlan(activeWeekend.categoryKey, activeWeekend.name, {
                        id: activeWeekend.id,
                        name: activeWeekend.name,
                        category: activeWeekend.categoryKey,
                        location: `${activeWeekend.country} (${activeWeekend.region})`,
                        dates: activeWeekend.dates,
                        daysCount: activeWeekend.daysCount,
                        budgetUSD: activeWeekend.estBudgetUSD,
                        guestRange: activeWeekend.guestRange,
                        theme: activeWeekend.theme,
                        logisticsHighlight: activeWeekend.logisticsHighlight,
                        aiPrompt: activeWeekend.aiPrompt,
                      });
                    }}
                  >
                    <Sparkles size={16} />
                    <span>⚡ Plan with Festi AI</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '13.5px' }}
                    onClick={() => {
                      openFestiAIChat(
                        `I am planning the ${activeWeekend.name} (${activeWeekend.dates} in ${activeWeekend.country}). ${activeWeekend.aiPrompt}`
                      );
                    }}
                  >
                    <Bot size={15} />
                    <span>💬 Chat with Festi AI About This Plan</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="dossier-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span className="dossier-tag">Global Spectacle</span>
                      <span className="dossier-countdown">{activeFestival.daysUntil} Days Away</span>
                    </div>

                    <h3 className="dossier-title">{activeFestival.name}</h3>

                    <div className="dossier-meta">
                      <MapPin size={13} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                      <span>{activeFestival.location}</span>
                      <span style={{ margin: '0 6px' }}>•</span>
                      <Calendar size={13} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                      <span>{activeFestival.dates}</span>
                    </div>
                  </div>
                </div>

                <p className="dossier-tagline">"{activeFestival.tagline}"</p>

                <div className="dossier-stats-grid">
                  <div className="dossier-stat-box">
                    <span className="stat-label">Estimated Budget</span>
                    <span className="stat-value">
                      {formatCurrency(activeFestival.estBudgetUSD, currentCurrency)}
                    </span>
                  </div>
                  <div className="dossier-stat-box">
                    <span className="stat-label">Crowd Capacity</span>
                    <span className="stat-value">{activeFestival.guestRange}</span>
                  </div>
                </div>

                <div className="dossier-logistics-box">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <ShieldAlert size={14} style={{ color: '#059669' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Critical Logistics Check
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary, #4338ca)', margin: 0, lineHeight: 1.45 }}>
                    {activeFestival.logisticsHighlight}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 14px',
                    background: 'rgba(91, 66, 243, 0.06)',
                    border: '1.5px dashed var(--bubblegum-purple-blue, #5b42f3)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Bot size={14} style={{ color: 'var(--bubblegum-purple-blue, #5b42f3)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--bubblegum-purple-blue, #5b42f3)' }}>
                      Festi AI Context Ready
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic', lineHeight: 1.4 }}>
                    "{activeFestival.aiPrompt}"
                  </p>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '13px 20px', fontSize: '15px' }}
                    onClick={() => {
                      handleLaunchPlan(activeFestival.categoryKey, activeFestival.name, {
                        id: activeFestival.id,
                        name: activeFestival.name,
                        category: activeFestival.categoryKey,
                        location: activeFestival.location,
                        dates: activeFestival.dates,
                        budgetUSD: activeFestival.estBudgetUSD,
                        guestRange: activeFestival.guestRange,
                        theme: activeFestival.tagline,
                        logisticsHighlight: activeFestival.logisticsHighlight,
                        aiPrompt: activeFestival.aiPrompt,
                      });
                    }}
                  >
                    <Sparkles size={16} />
                    <span>⚡ Plan with Festi AI</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '13.5px' }}
                    onClick={() => {
                      openFestiAIChat(
                        `I want to plan an event inspired by ${activeFestival.name} (${activeFestival.dates}). ${activeFestival.aiPrompt}`
                      );
                    }}
                  >
                    <Bot size={15} />
                    <span>💬 Chat with Festi AI About This Festival</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
