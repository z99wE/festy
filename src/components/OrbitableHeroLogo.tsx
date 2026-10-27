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

    // Viewport sizing: expansive dimensions for a bold, hero-scale 3D presence
    const getViewportSize = () => {
      const w = container.clientWidth || 740;
      const h = Math.min(560, Math.max(420, Math.round(w * 0.72)));
      return { width: w, height: h };
    };

    let { width, height } = getViewportSize();

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);

    // Hero-scale framing: mascot occupies ~92% of the frame (prominent, bold, commanding)
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      const fovRad = (34 * Math.PI) / 180;
      const targetW = 5.6; // Large target width
      const targetH = 2.15;
      const distW = targetW / (2 * aspect * Math.tan(fovRad / 2));
      const distH = targetH / (2 * Math.tan(fovRad / 2));
      camera.position.set(0, 0, Math.max(distW, distH));
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
    renderer.toneMappingExposure = 1.25;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm, velvety lighting tuned for plush fur (matte, warm, no white specular hot spots)
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 2.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeed6, 2.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffdfb8, 1.4);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    const warmRim = new THREE.DirectionalLight(0xff9e30, 2.4);
    warmRim.position.set(-2, 2, -4);
    scene.add(warmRim);

    // Orbitable Root Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Load Pristine High-Res Logo Texture (Direct from original favicon.png)
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      '/festiya-logo.webp',
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        // Big, imposing 3D mascot dimensions with exact 2046:768 aspect ratio
        const worldW = 5.2;
        const worldH = (worldW * 768) / 2046;
        const planeGeo = new THREE.PlaneGeometry(worldW, worldH, 1, 1);

        // Pristine single-plane material: exactly matches the original artwork with ZERO extra slop
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(planeGeo, material);
        orbitGroup.add(mesh);
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

      targetRotationY += deltaX * 0.007;
      targetRotationX += deltaY * 0.005;

      // Clamp tilt angles to keep logo front-facing, legible, and tactile
      targetRotationY = Math.max(-0.45, Math.min(0.45, targetRotationY));
      targetRotationX = Math.max(-0.25, Math.min(0.25, targetRotationX));

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

    // Animation Loop with Gentle Harmonic Sway (No 360 Spin) & IntersectionObserver
    let animationFrameId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Soft harmonic 3D floating orbit when idle (no 360 spin)
      if (!isDragging && !reducedMotion) {
        const idleRotY = Math.sin(elapsedTime * 0.85) * 0.12;
        const idleRotX = Math.cos(elapsedTime * 0.65) * 0.06;
        targetRotationY += (idleRotY - targetRotationY) * 0.05;
        targetRotationX += (idleRotX - targetRotationX) * 0.05;
        orbitGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.07;
      }

      // Smooth inertia damping
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;

      orbitGroup.rotation.y = currentRotationY;
      orbitGroup.rotation.x = currentRotationX;

      dom.style.cursor = isDragging ? 'grabbing' : 'grab';
      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isVisible = !!entry?.isIntersecting;
      if (isVisible) {
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = 0;
        }
      }
    }, { threshold: 0.05 });

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
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
        maxWidth: '850px',
        height: '520px',
        aspectRatio: '850 / 520',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
        contain: 'layout size',
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '520px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          overflow: 'visible',
        }}
      />
    </div>
  );
};
