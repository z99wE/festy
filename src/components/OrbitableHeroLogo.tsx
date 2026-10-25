import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playPopSound } from '../utils/audio';

interface OrbitableHeroLogoProps {
  reducedMotion?: boolean;
  soundEnabled?: boolean;
}

export const OrbitableHeroLogo: React.FC<OrbitableHeroLogoProps> = ({
  reducedMotion = false,
  soundEnabled = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = 360;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff7a18, 2.2);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffd000, 1.6, 12);
    fillLight.position.set(0, 3, 3);
    scene.add(fillLight);

    // Orbitable Root Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Load Pristine Festiya High-Res Texture
    const textureLoader = new THREE.TextureLoader();
    let logoMesh: THREE.Mesh | null = null;
    let backingMesh: THREE.Mesh | null = null;

    textureLoader.load(
      '/festiya-hero.webp',
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        // Front face with Festiya brand artwork
        const frontMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.22,
          metalness: 0.12,
          side: THREE.FrontSide,
        });

        // Golden champagne rim & backing
        const rimMaterial = new THREE.MeshStandardMaterial({
          color: 0xffa439,
          roughness: 0.25,
          metalness: 0.65,
        });

        const materials = [
          rimMaterial,   // right
          rimMaterial,   // left
          rimMaterial,   // top
          rimMaterial,   // bottom
          frontMaterial, // front
          rimMaterial,   // back
        ];

        // Sleek rounded floating emblem slab
        const geometry = new THREE.BoxGeometry(4.2, 1.7, 0.16);
        logoMesh = new THREE.Mesh(geometry, materials);
        logoMesh.castShadow = true;
        orbitGroup.add(logoMesh);

        // Golden floating halo ring
        const ringGeom = new THREE.TorusGeometry(2.35, 0.03, 16, 64);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xffc470,
          roughness: 0.2,
          metalness: 0.85,
          transparent: true,
          opacity: 0.65,
        });
        const haloRing = new THREE.Mesh(ringGeom, ringMat);
        haloRing.rotation.x = Math.PI * 0.45;
        haloRing.position.y = -0.15;
        orbitGroup.add(haloRing);
      },
      undefined,
      (err) => {
        console.warn('Fallback: generating geometric emblem', err);
        const fallbackGeom = new THREE.BoxGeometry(3.6, 1.4, 0.2);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0xff5e1e,
          roughness: 0.3,
          metalness: 0.4,
        });
        backingMesh = new THREE.Mesh(fallbackGeom, fallbackMat);
        orbitGroup.add(backingMesh);
      }
    );

    // Orbit Interaction Dynamics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let velocityY = 0;
    let velocityX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      playPopSound(soundEnabled);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      velocityY = deltaX * 0.008;
      velocityX = deltaY * 0.008;

      targetRotationY += velocityY;
      targetRotationX += velocityX;

      // Bound vertical tilt to prevent disorienting upside-down flip
      targetRotationX = Math.max(-0.6, Math.min(0.6, targetRotationX));

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 800);
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

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = 360;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Idle Float & Smooth Inertia
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle float when not dragging
      if (!isDragging && !reducedMotion) {
        targetRotationY += 0.005; // Gentle continuous orbit
        orbitGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.08;
      }

      // Apply damping / inertia
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      orbitGroup.rotation.y = currentRotationY;
      orbitGroup.rotation.x = currentRotationX;

      dom.style.cursor = isDragging ? 'grabbing' : 'grab';

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
  }, [reducedMotion, soundEnabled]);

  return (
    <div
      className="orbitable-hero-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
        title="Drag to orbit Festiya in 360°"
      />

      {/* Subtle, Classy Orbit Indicator (clean typography, no weird icons) */}
      <div
        style={{
          marginTop: '-12px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#8C4300',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          opacity: isHovered || isInteracting ? 0.95 : 0.6,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }}
      >
        <span>Drag to orbit 360°</span>
      </div>
    </div>
  );
};
