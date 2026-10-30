import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import {
  type WorldCelebrationPin,
  WORLD_CELEBRATION_PINS,
  createProceduralGlobeTexture,
  latLonToVector3,
} from '../data/worldCelebrationData';

interface ProjectedLabel {
  id: string;
  name: string;
  location: string;
  flag: string;
  color: string;
  x: number;
  y: number;
  visible: boolean;
}

interface CelebrationGlobeCanvasProps {
  autoRotate: boolean;
  activePinId: string;
  onSelectPin: (pin: WorldCelebrationPin) => void;
  targetRotationRef: MutableRefObject<{ x: number; y: number } | null>;
  cameraRef: MutableRefObject<THREE.PerspectiveCamera | null>;
}

function projectHotspotCoordinates(
  camera: THREE.PerspectiveCamera,
  globeGroup: THREE.Group,
  container: HTMLDivElement,
  globeRadius: number
): ProjectedLabel[] {
  const cWidth = container.clientWidth;
  const cHeight = container.clientHeight;
  const camDir = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);

  return WORLD_CELEBRATION_PINS.map((pin) => {
    const localPos = latLonToVector3(pin.lat, pin.lon, globeRadius + 2.5);
    const worldPos = localPos.clone().applyMatrix4(globeGroup.matrixWorld);
    const isFront = worldPos.clone().normalize().dot(camDir) > 0.15;

    const proj = worldPos.project(camera);
    const screenX = ((proj.x + 1) / 2) * cWidth;
    const screenY = ((-proj.y + 1) / 2) * cHeight;

    return {
      id: pin.id,
      name: pin.name,
      location: pin.location.split('&')[0].trim(),
      flag: pin.flag,
      color: pin.color,
      x: screenX,
      y: screenY,
      visible: isFront,
    };
  });
}

function updateGlobeRotation(
  globeGroup: THREE.Group,
  targetRotationRef: MutableRefObject<{ x: number; y: number } | null>,
  rotVelocityRef: MutableRefObject<{ x: number; y: number }>,
  isDragging: boolean,
  autoRotate: boolean,
  delta: number
) {
  if (targetRotationRef.current) {
    const tx = targetRotationRef.current.x;
    const ty = targetRotationRef.current.y;
    globeGroup.rotation.x += (tx - globeGroup.rotation.x) * 0.08;
    globeGroup.rotation.y += (ty - globeGroup.rotation.y) * 0.08;
    if (Math.abs(tx - globeGroup.rotation.x) < 0.002 && Math.abs(ty - globeGroup.rotation.y) < 0.002) {
      targetRotationRef.current = null;
    }
    return;
  }

  if (isDragging) return;

  globeGroup.rotation.y += rotVelocityRef.current.y;
  globeGroup.rotation.x += rotVelocityRef.current.x;
  rotVelocityRef.current.y *= 0.94;
  rotVelocityRef.current.x *= 0.94;

  if (autoRotate && Math.abs(rotVelocityRef.current.y) < 0.001) {
    globeGroup.rotation.y += delta * 0.15;
  }
}

function GlobePinBadge({
  label,
  isSelected,
  onSelect,
}: {
  label: ProjectedLabel;
  isSelected: boolean;
  onSelect: (pin: WorldCelebrationPin) => void;
}) {
  if (!label.visible) return null;
  const pinData = WORLD_CELEBRATION_PINS.find((p) => p.id === label.id);

  const badgeStyle = {
    left: `${label.x}px`,
    top: `${label.y}px`,
    transform: 'translate(-50%, -100%)',
    borderColor: isSelected ? '#5B42F3' : 'rgba(255, 158, 48, 0.45)',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pinData) onSelect(pinData);
  };

  return (
    <button
      type="button"
      aria-label={`Select destination ${pinData?.name || label.id}`}
      className={`globe-floating-pin-badge ${isSelected ? 'active-pin' : ''}`}
      style={badgeStyle}
      onClick={handleClick}
    >
      <span className="globe-pin-beacon" style={{ background: label.color }} />
      <span className="globe-pin-flag">{label.flag}</span>
      <span className="globe-pin-city">{label.location}</span>
    </button>
  );
}

function handleGlobeResize(entry: ResizeObserverEntry, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  const w = entry.contentRect.width;
  const h = entry.contentRect.height;
  if (w > 0 && h > 0) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
}

export function CelebrationGlobeCanvas({
  autoRotate,
  activePinId,
  onSelectPin,
  targetRotationRef,
  cameraRef,
}: CelebrationGlobeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotVelocityRef = useRef({ x: 0, y: 0 });
  const [labelCoords, setLabelCoords] = useState<ProjectedLabel[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 540;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 240);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xfff0f7, 2.8));

    const sunLight = new THREE.DirectionalLight(0xfff8f0, 2.2);
    sunLight.position.set(140, 140, 160);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xffd6ec, 1.8);
    fillLight.position.set(-160, 80, 120);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.4);
    rimLight.position.set(-140, -40, -120);
    scene.add(rimLight);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 75;
    const sphereGeo = new THREE.SphereGeometry(globeRadius, 64, 64);
    const globeTexture = createProceduralGlobeTexture();

    const sphereMat = new THREE.MeshPhysicalMaterial({
      map: globeTexture,
      roughness: 0.22,
      metalness: 0.02,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
      sheen: 0.75,
      sheenColor: new THREE.Color('#FFB5D5'),
      sheenRoughness: 0.25,
      transparent: true,
      opacity: 0.98,
    });
    globeGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    const atmosGeo = new THREE.SphereGeometry(globeRadius + 3.5, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({ color: 0xd8b4fe, transparent: true, opacity: 0.32, side: THREE.BackSide });
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

    const pinGroup = new THREE.Group();
    globeGroup.add(pinGroup);

    WORLD_CELEBRATION_PINS.forEach((pin) => {
      const pos = latLonToVector3(pin.lat, pin.lon, globeRadius + 1.2);
      const beaconMesh = new THREE.Mesh(new THREE.SphereGeometry(2.2, 16, 16), new THREE.MeshBasicMaterial({ color: pin.color || '#FF9E30' }));
      beaconMesh.position.copy(pos);
      pinGroup.add(beaconMesh);

      const ringMesh = new THREE.Mesh(new THREE.RingGeometry(1.8, 3.6, 24), new THREE.MeshBasicMaterial({ color: pin.color || '#FF9E30', side: THREE.DoubleSide, transparent: true, opacity: 0.65 }));
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      pinGroup.add(ringMesh);
    });

    globeGroup.rotation.y = 0.6;
    globeGroup.rotation.x = 0.2;

    let animId = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      updateGlobeRotation(globeGroup, targetRotationRef, rotVelocityRef, isDraggingRef.current, autoRotate, delta);
      globeGroup.rotation.x = Math.max(-0.65, Math.min(0.65, globeGroup.rotation.x));
      renderer.render(scene, camera);

      const newCoords = projectHotspotCoordinates(camera, globeGroup, container, globeRadius);
      setLabelCoords(newCoords);
    };

    animId = requestAnimationFrame(animate);

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      targetRotationRef.current = null;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      rotVelocityRef.current = { x: 0, y: 0 };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
      globeGroup.rotation.y += dx * 0.007;
      globeGroup.rotation.x += dy * 0.007;
      rotVelocityRef.current = { x: dy * 0.002, y: dx * 0.002 };
    };

    const onMouseUp = () => { isDraggingRef.current = false; };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const ro = new ResizeObserver((entries) => {
      entries.forEach((entry) => handleGlobeResize(entry, camera, renderer));
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      pinGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });
      sphereGeo.dispose();
      sphereMat.dispose();
      globeTexture.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
      renderer.dispose();
      if (container.contains(domEl)) container.removeChild(domEl);
    };
  }, [autoRotate, targetRotationRef, cameraRef]);

  return (
    <div className="celebration-visual-canvas globe-canvas-wrapper">
      <div
        ref={mountRef}
        className="three-globe-container"
        style={{ width: '100%', height: '440px', cursor: 'grab' }}
      />

      <div className="globe-labels-overlay" aria-hidden="true">
        {labelCoords.map((label) => (
          <GlobePinBadge
            key={label.id}
            label={label}
            isSelected={label.id === activePinId}
            onSelect={onSelectPin}
          />
        ))}
      </div>

      <div className="map-region-hint">
        <span>Drag to spin 3D globe • Click city beacon to inspect celebration</span>
      </div>
    </div>
  );
}
