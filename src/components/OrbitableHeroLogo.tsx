import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { playPopSound } from '../utils/audio';

interface OrbitableHeroLogoProps {
  reducedMotion?: boolean;
  soundEnabled?: boolean;
}

const TARGET_W = 6.0;
const TARGET_H = (6.0 * 768) / 2046; // ~2.252

function getViewportSize(clientWidth: number): { width: number; height: number } {
  const w = Math.min(clientWidth || 940, 940);
  const naturalH = Math.round(w * (400 / 940));
  const h = Math.min(420, Math.max(260, naturalH));
  return { width: w, height: h };
}

function updateCameraDistance(camera: THREE.PerspectiveCamera, w: number, h: number): void {
  const aspect = w / h;
  const fovRad = (32 * Math.PI) / 180;
  const tanHalfFov = Math.tan(fovRad / 2);

  const distW = (TARGET_W * 1.48) / (2 * aspect * tanHalfFov);
  const distH = (TARGET_H * 1.55) / (2 * tanHalfFov);
  const dist = Math.max(distW, distH, 6.5);

  camera.fov = 32;
  camera.aspect = aspect;
  camera.position.set(0, 0, dist);
  camera.updateProjectionMatrix();
}

interface InertiaState {
  targetRotY: number;
  targetRotX: number;
  velocityY: number;
  velocityX: number;
}

function applyInertiaAndFloating(
  elapsedTime: number,
  reducedMotion: boolean,
  state: InertiaState,
  orbitGroup: THREE.Group
): void {
  state.targetRotY += state.velocityY;
  state.targetRotX += state.velocityX;
  state.velocityY *= 0.91;
  state.velocityX *= 0.91;

  state.targetRotY = Math.max(-0.55, Math.min(0.55, state.targetRotY));
  state.targetRotX = Math.max(-0.35, Math.min(0.35, state.targetRotX));

  if (reducedMotion) return;
  const idleRotY = Math.sin(elapsedTime * 0.9) * 0.12;
  const idleRotX = Math.cos(elapsedTime * 0.7) * 0.07;
  state.targetRotY += (idleRotY - state.targetRotY) * 0.04;
  state.targetRotX += (idleRotX - state.targetRotX) * 0.04;
  orbitGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
}

export const OrbitableHeroLogo: React.FC<OrbitableHeroLogoProps> = ({
  reducedMotion = false,
  soundEnabled = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let { width, height } = getViewportSize(container.clientWidth);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
    updateCameraDistance(camera, width, height);

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

    const ambientLight = new THREE.AmbientLight(0xfff5ea, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeed6, 2.6);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xff9e30, 1.8);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const warmRim = new THREE.DirectionalLight(0xffffff, 2.2);
    warmRim.position.set(0, 3, -3);
    scene.add(warmRim);

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      '/festiya-logo.webp',
      (texture) => {
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.colorSpace = THREE.SRGBColorSpace;

        const planeGeo = new THREE.PlaneGeometry(TARGET_W, TARGET_H, 1, 1);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.55,
          metalness: 0.08,
          side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGeo, material);
        orbitGroup.add(mesh);
        renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        console.warn('Could not load hero texture', err);
      }
    );

    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const inertia: InertiaState = {
      targetRotY: 0,
      targetRotX: 0,
      velocityY: 0,
      velocityX: 0,
    };

    let animationFrameId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';
    dom.style.touchAction = 'none';

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
      inertia.velocityY = 0;
      inertia.velocityX = 0;
      dom.style.cursor = 'grabbing';
      playPopSound(soundEnabled);
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerX;
      const deltaY = clientY - prevPointerY;

      inertia.velocityY = deltaX * 0.009;
      inertia.velocityX = deltaY * 0.007;

      inertia.targetRotY += inertia.velocityY;
      inertia.targetRotX += inertia.velocityX;

      inertia.targetRotY = Math.max(-0.55, Math.min(0.55, inertia.targetRotY));
      inertia.targetRotX = Math.max(-0.35, Math.min(0.35, inertia.targetRotX));

      prevPointerX = clientX;
      prevPointerY = clientY;
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

    const handleResize = () => {
      if (!container) return;
      const { width: newW, height: newH } = getViewportSize(container.clientWidth);
      updateCameraDistance(camera, newW, newH);
      renderer.setSize(newW, newH);
      renderer.render(scene, camera);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isDragging) {
        currentRotY += (inertia.targetRotY - currentRotY) * 0.18;
        currentRotX += (inertia.targetRotX - currentRotX) * 0.18;
      } else {
        applyInertiaAndFloating(elapsedTime, reducedMotion, inertia, orbitGroup);
        currentRotY += (inertia.targetRotY - currentRotY) * 0.09;
        currentRotX += (inertia.targetRotX - currentRotX) * 0.09;
      }

      orbitGroup.rotation.y = currentRotY;
      orbitGroup.rotation.x = currentRotX;

      renderer.render(scene, camera);
    };

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      isVisible = Boolean(entry?.isIntersecting);
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.05 });
    observer.observe(container);

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
        maxWidth: '940px',
        aspectRatio: '940 / 400',
        minHeight: '260px',
        maxHeight: '420px',
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
          height: '100%',
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
