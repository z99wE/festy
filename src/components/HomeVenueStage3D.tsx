import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Compass, Eye, Volume2, Users, Utensils, Camera, Ticket, ArrowRight } from 'lucide-react';

interface HomeVenueStage3DProps {
  reducedMotion?: boolean;
  onLaunchZonePlan?: (zoneName: string) => void;
}

interface VenueZone {
  id: string;
  name: string;
  icon: typeof Volume2;
  color: string;
  hexColor: number;
  capacity: string;
  budgetShare: string;
  highlight: string;
  position: [number, number, number];
}

const VENUE_ZONES: VenueZone[] = [
  {
    id: 'main-stage',
    name: 'Main Stage & Acoustics',
    icon: Volume2,
    color: '#FF5E1E',
    hexColor: 0xff5e1e,
    capacity: '150–500 Guests',
    budgetShare: '22% of total budget',
    highlight: 'DMX spotlighting, pro audio grids, and timecoded run-of-show cues.',
    position: [0, 1.2, -1.5],
  },
  {
    id: 'banquet-lawn',
    name: 'Banquet & Tasting Pavilion',
    icon: Utensils,
    color: '#FFB703',
    hexColor: 0xffb703,
    capacity: 'Round tables of 8–10',
    budgetShare: '38% of total budget',
    highlight: 'Chef course synchronization, sommelier pairings, and dietary grid.',
    position: [-2.5, 0.6, 1.2],
  },
  {
    id: 'photo-arch',
    name: 'Floral & Photo Keepsake Arch',
    icon: Camera,
    color: '#06D6A0',
    hexColor: 0x06d6a0,
    capacity: 'Dual camera lane',
    budgetShare: '12% of total budget',
    highlight: 'Natural golden-hour angle, floral misting, and digital gallery sync.',
    position: [2.5, 0.8, 0.8],
  },
  {
    id: 'welcome-gate',
    name: 'Welcome Gate & Champagne Bar',
    icon: Ticket,
    color: '#FF4D6D',
    hexColor: 0xff4d6d,
    capacity: 'Rapid ingress lane',
    budgetShare: '8% of total budget',
    highlight: 'QR check-in kiosk, signature welcome spritz, and coat check logistics.',
    position: [0, 0.4, 3.2],
  },
];

export const HomeVenueStage3D: React.FC<HomeVenueStage3DProps> = ({
  reducedMotion = false,
  onLaunchZonePlan,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeZoneId, setActiveZoneId] = useState<string>('main-stage');
  const [lightingMode, setLightingMode] = useState<'sunset' | 'carnival' | 'golden'>('sunset');
  const [isInteracting, setIsInteracting] = useState(false);

  const activeZone = VENUE_ZONES.find((z) => z.id === activeZoneId) || VENUE_ZONES[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 9);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Stage Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.SpotLight(0xff7a33, 4.0, 25, Math.PI / 4, 0.4, 1);
    mainSpot.position.set(0, 10, 4);
    mainSpot.castShadow = true;
    scene.add(mainSpot);

    const fillSpot = new THREE.SpotLight(0xffc247, 2.8, 20, Math.PI / 3, 0.5, 1);
    fillSpot.position.set(-6, 8, -4);
    scene.add(fillSpot);

    const rimLight = new THREE.PointLight(0xff8a47, 1.8, 15);
    rimLight.position.set(5, 4, -4);
    scene.add(rimLight);

    // 3. Central Stage Group
    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    // Ground reflective disc / festival lawn base
    const baseGeom = new THREE.CylinderGeometry(4.8, 5.0, 0.35, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xffe2c2,
      roughness: 0.3,
      metalness: 0.1,
    });
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -0.175;
    baseMesh.receiveShadow = true;
    stageRoot.add(baseMesh);

    // Tier 1: Outer festival ring
    const tier1Geom = new THREE.CylinderGeometry(4.2, 4.4, 0.25, 48);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0xffd1a4,
      roughness: 0.2,
      metalness: 0.2,
    });
    const tier1Mesh = new THREE.Mesh(tier1Geom, tier1Mat);
    tier1Mesh.position.y = 0.125;
    stageRoot.add(tier1Mesh);

    // Tier 2: Golden Pavilion ring
    const tier2Geom = new THREE.CylinderGeometry(3.3, 3.5, 0.3, 48);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0xffba75,
      roughness: 0.25,
      metalness: 0.35,
    });
    const tier2Mesh = new THREE.Mesh(tier2Geom, tier2Mat);
    tier2Mesh.position.y = 0.375;
    stageRoot.add(tier2Mesh);

    // Tier 3: Mainstage Centerpiece
    const stageGeom = new THREE.CylinderGeometry(2.2, 2.3, 0.4, 48);
    const stageMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.2,
      metalness: 0.2,
    });
    const stageMesh = new THREE.Mesh(stageGeom, stageMat);
    stageMesh.position.y = 0.7;
    stageRoot.add(stageMesh);

    // 4. Architectural Archways & Columns
    const archGroup = new THREE.Group();
    const archCount = 5;
    for (let i = 0; i < archCount; i++) {
      const angle = (i / (archCount - 1)) * Math.PI - Math.PI / 2;
      const radius = 3.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 0.4;

      // Vertical Column
      const colGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 16);
      const colMat = new THREE.MeshStandardMaterial({
        color: 0xffb385,
        metalness: 0.4,
        roughness: 0.2,
      });
      const col = new THREE.Mesh(colGeom, colMat);
      col.position.set(x, 1.4, z);
      archGroup.add(col);

      // Top glowing finial lantern
      const lanternGeom = new THREE.SphereGeometry(0.14, 16, 16);
      const lanternMat = new THREE.MeshStandardMaterial({
        color: 0xff5e1e,
        emissive: 0xff3b00,
        emissiveIntensity: 0.9,
      });
      const lantern = new THREE.Mesh(lanternGeom, lanternMat);
      lantern.position.set(x, 2.55, z);
      archGroup.add(lantern);
    }
    stageRoot.add(archGroup);

    // Pavilion Back Wall Arc
    const backWallGeom = new THREE.TorusGeometry(3.6, 0.06, 12, 36, Math.PI);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0xff8a47,
      metalness: 0.5,
      roughness: 0.2,
    });
    const backWall = new THREE.Mesh(backWallGeom, backWallMat);
    backWall.rotation.x = Math.PI / 2;
    backWall.rotation.z = 0;
    backWall.position.set(0, 2.5, -0.4);
    stageRoot.add(backWall);

    // 5. Zone Interactive Podiums
    const zoneMeshes: { id: string; mesh: THREE.Group; marker: THREE.Mesh }[] = [];

    VENUE_ZONES.forEach((z) => {
      const zoneGroup = new THREE.Group();
      zoneGroup.position.set(...z.position);

      // Marker base
      const markerGeom = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 24);
      const markerMat = new THREE.MeshStandardMaterial({
        color: z.hexColor,
        roughness: 0.2,
        metalness: 0.3,
      });
      const marker = new THREE.Mesh(markerGeom, markerMat);
      marker.position.y = 0.08;
      zoneGroup.add(marker);

      // Floating diamond beacon
      const beaconGeom = new THREE.OctahedronGeometry(0.18, 0);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: z.hexColor,
        emissive: z.hexColor,
        emissiveIntensity: 0.7,
        roughness: 0.1,
      });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.y = 0.55;
      zoneGroup.add(beacon);

      stageRoot.add(zoneGroup);
      zoneMeshes.push({ id: z.id, mesh: zoneGroup, marker: beacon });
    });

    // 6. Mouse Rotation / Drag Controls
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0.2;
    let currentRotationY = 0.2;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      setIsInteracting(true);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetRotationY += deltaX * 0.008;
    };

    const onMouseUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        setIsInteracting(true);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - touchStartX;
        touchStartX = e.touches[0].clientX;
        targetRotationY += deltaX * 0.008;
      }
    };
    const onTouchEnd = () => {
      setTimeout(() => setIsInteracting(false), 2000);
    };

    domEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

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

    // 8. Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation if user is not actively dragging
      if (!isDragging) {
        targetRotationY += 0.002;
      }

      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      stageRoot.rotation.y = currentRotationY;

      // Animate floating beacons
      zoneMeshes.forEach((item, idx) => {
        item.marker.position.y = 0.55 + Math.sin(elapsedTime * 2.5 + idx) * 0.08;
        item.marker.rotation.y = elapsedTime * 1.5;
        item.marker.rotation.x = Math.sin(elapsedTime * 1.2) * 0.2;
      });

      // Update spot lights based on mode
      if (lightingMode === 'sunset') {
        mainSpot.color.setHex(0xff6020);
        fillSpot.color.setHex(0xffaa33);
      } else if (lightingMode === 'carnival') {
        mainSpot.color.setHex(0xffb703);
        fillSpot.color.setHex(0x06d6a0);
      } else {
        mainSpot.color.setHex(0xffaa44);
        fillSpot.color.setHex(0xff8a47);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      baseGeom.dispose();
      baseMat.dispose();
      tier1Geom.dispose();
      tier1Mat.dispose();
      tier2Geom.dispose();
      tier2Mat.dispose();
      stageGeom.dispose();
      stageMat.dispose();
    };
  }, [reducedMotion, lightingMode]);

  return (
    <div className="home-3d-stage-wrapper">
      {/* 3D Stage Canvas Container */}
      <div className="home-3d-canvas-box" ref={mountRef}>
        {/* Floating spatial interaction hint */}
        <div className="stage-3d-hint-pill">
          <Compass size={14} className={isInteracting ? 'spin-slow' : ''} />
          <span>{isInteracting ? 'Rotating 3D Celebration Stage' : 'Drag to rotate 3D Pavilion 360°'}</span>
        </div>

        {/* Ambient lighting mode switcher */}
        <div className="stage-lighting-toggles" role="group" aria-label="Venue Lighting Modes">
          <button
            type="button"
            className={`lighting-toggle-btn ${lightingMode === 'sunset' ? 'active' : ''}`}
            onClick={() => setLightingMode('sunset')}
            title="Warm Sunset Gala Lighting"
          >
            Sunset Gala
          </button>
          <button
            type="button"
            className={`lighting-toggle-btn ${lightingMode === 'carnival' ? 'active' : ''}`}
            onClick={() => setLightingMode('carnival')}
            title="Vibrant Carnival Lighting"
          >
            Carnival Glow
          </button>
          <button
            type="button"
            className={`lighting-toggle-btn ${lightingMode === 'golden' ? 'active' : ''}`}
            onClick={() => setLightingMode('golden')}
            title="Golden Hour Acoustic Lighting"
          >
            Golden Hour
          </button>
        </div>
      </div>

      {/* Interactive Venue Zone Inspector Card */}
      <div className="home-3d-inspector-card">
        <div className="inspector-header">
          <div className="inspector-badge">
            <Sparkles size={14} />
            <span>Interactive 3D Venue Blueprint</span>
          </div>
          <span className="inspector-version">WebGL 60FPS</span>
        </div>

        {/* Zone Selector Buttons */}
        <div className="inspector-zones-grid">
          {VENUE_ZONES.map((zone) => {
            const Icon = zone.icon;
            const isSelected = zone.id === activeZoneId;
            return (
              <button
                key={zone.id}
                type="button"
                className={`zone-select-card ${isSelected ? 'active' : ''}`}
                style={{
                  borderColor: isSelected ? zone.color : 'var(--border-subtle)',
                }}
                onClick={() => setActiveZoneId(zone.id)}
              >
                <div
                  className="zone-icon-pill"
                  style={{
                    backgroundColor: isSelected ? zone.color : 'var(--orange-100)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div className="zone-name-text">{zone.name}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Blueprint Detail */}
        <div className="selected-zone-detail-box">
          <div className="zone-detail-top">
            <div>
              <h4 className="zone-detail-title">{activeZone.name}</h4>
              <p className="zone-detail-highlight">{activeZone.highlight}</p>
            </div>
            <div className="zone-metric-tag">
              <span className="metric-label">Budget Weight</span>
              <span className="metric-val">{activeZone.budgetShare}</span>
            </div>
          </div>

          <div className="zone-specs-row">
            <div className="spec-item">
              <Users size={14} />
              <span><strong>Capacity:</strong> {activeZone.capacity}</span>
            </div>
            <div className="spec-item">
              <Eye size={14} />
              <span><strong>Acoustics:</strong> Phase-aligned stereo array</span>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary zone-launch-btn"
            onClick={() => onLaunchZonePlan && onLaunchZonePlan(activeZone.id)}
          >
            <span>Design {activeZone.name} Blueprint</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
