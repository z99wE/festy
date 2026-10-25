import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Viewport sizing: ample width and height to prevent any edge clipping
    const getViewportSize = () => {
      const w = container.clientWidth || 720;
      const h = Math.min(520, Math.max(380, Math.round(w * 0.62)));
      return { width: w, height: h };
    };

    let { width, height } = getViewportSize();

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);

    // Camera distance with generous safety margin (1.35x padding) so 3D rotation NEVER clips at edges
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      const fovRad = (30 * Math.PI) / 180;
      const targetW = 4.2; // mascot width
      const targetH = 1.58;
      // Generous buffer factor (1.42) prevents "F" or "a" from clipping during 360 rotation and tilt
      const distW = (targetW * 1.42) / (2 * aspect * Math.tan(fovRad / 2));
      const distH = (targetH * 1.42) / (2 * Math.tan(fovRad / 2));
      camera.position.set(0, 0, Math.max(6.2, Math.max(distW, distH)));
    };
    updateCameraDistance(width, height);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm, velvety lighting without white specular blowouts or harsh reflections
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeed6, 2.0);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffdfb8, 1.2);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const warmRim = new THREE.DirectionalLight(0xff9e30, 2.4);
    warmRim.position.set(-2, 2, -4);
    scene.add(warmRim);

    // Orbitable Root Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Load High-Res Transparent Fluffy Fur Artwork
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      '/festiya-hero.webp',
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        const worldW = 4.2;
        const worldH = 1.58;
        const planeGeo = new THREE.PlaneGeometry(worldW, worldH, 16, 8);

        // Volumetric Plush Fur Stack:
        // 14 micro-spaced layers at EXACT scale 1.0 (NO scaled shells = ZERO white fungus or halo).
        // alphaTest: 0.35 cleanly drops anti-aliased border fringe so all edges are crisp, cohesive, and vibrant.
        // High roughness (0.88) gives warm matte velvet plushness with NO white plastic shine.
        const layerCount = 14;
        const totalThickness = 0.16;
        const step = totalThickness / (layerCount - 1);
        const startZ = -totalThickness / 2;

        for (let i = 0; i < layerCount; i++) {
          const z = startZ + i * step;
          const isFront = i === layerCount - 1;
          const isBack = i === 0;

          const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.35, // Crisp edge boundary, eliminates any white/gray fringe
            roughness: 0.88, // Velvet matte fur, no white specular hot spots
            metalness: 0.02,
            side: isFront ? THREE.FrontSide : isBack ? THREE.FrontSide : THREE.DoubleSide,
            depthWrite: true,
          });

          const mesh = new THREE.Mesh(planeGeo, material);
          mesh.position.z = z;
          if (isBack) {
            mesh.rotation.y = Math.PI; // Perfectly faces back for 360 orbit visibility
          }
          orbitGroup.add(mesh);
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load hero texture', err);
      }
    );

    // Orbit Interaction Dynamics (Smooth 360 drag rotation)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
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

      targetRotationY += deltaX * 0.01;
      targetRotationX += deltaY * 0.007;

      // Vertical tilt limit
      targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));

      prevMouseX = clientX;
      prevMouseY = clientY;
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

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const { width: newW, height: newH } = getViewportSize();
      camera.aspect = newW / newH;
      updateCameraDistance(newW, newH);
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with Idle Float & Smooth Inertia
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle continuous 360 orbit when idle
      if (!isDragging && !reducedMotion) {
        targetRotationY += 0.006;
        orbitGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      // Smooth inertia damping
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
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '820px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '480px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          overflow: 'visible',
        }}
        title="Festiya 3D Plush Logo"
      />
    </div>
  );
};
