import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playPopSound } from '../utils/audio';

interface OrbitableHeroLogoProps {
  reducedMotion?: boolean;
  soundEnabled?: boolean;
}

const TARGET_W = 6.0;
const TARGET_H = (6.0 * 768) / 2046; // ~2.252

function getViewportSize(clientWidth: number): { width: number; height: number } {
  const w = Math.min(clientWidth || 1020, 1020);
  const naturalH = Math.round(w * (432 / 1020));
  const h = Math.min(440, Math.max(260, naturalH));
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
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    let canceled = false;
    let cleanupFn: (() => void) | undefined;

    const setupScene = () => {
      if (canceled) return;
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
        if (!canceled) {
          setIs3DReady(true);
          wakeUpAnimation(45);
        }
      },
      undefined,
      (err) => {
        console.warn('Could not load hero texture', err);
      }
    );

    let isDragging = false;
    let isHovering = false;
    let settleFrames = 45;
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

    const wakeUpAnimation = (frames = 60) => {
      settleFrames = Math.max(settleFrames, frames);
      if (isVisible && !animationFrameId) {
        clock.start();
        animationFrameId = requestAnimationFrame(animate);
      }
    };

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
      wakeUpAnimation(90);
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
      wakeUpAnimation(60);
    };

    const onPointerUp = () => {
      isDragging = false;
      dom.style.cursor = 'grab';
      wakeUpAnimation(45);
    };

    const onMouseEnter = () => {
      isHovering = true;
      wakeUpAnimation(60);
    };

    const onMouseLeave = () => {
      isHovering = false;
      wakeUpAnimation(45);
    };

    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mouseenter', onMouseEnter);
    dom.addEventListener('mouseleave', onMouseLeave);
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
      wakeUpAnimation(20);
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

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

      if (!isDragging && !isHovering) {
        settleFrames--;
      }

      if (isDragging || isHovering || settleFrames > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = 0;
      }
    };

    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      isVisible = Boolean(entry?.isIntersecting);
      if (isVisible && !animationFrameId && (isDragging || isHovering || settleFrames > 0)) {
        animationFrameId = requestAnimationFrame(animate);
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const observer = new IntersectionObserver(onIntersect, { threshold: 0.05 });
    observer.observe(container);

    cleanupFn = () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mouseenter', onMouseEnter);
      dom.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      orbitGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry?.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => {
                if ('map' in m && m.map) (m.map as THREE.Texture).dispose();
                m.dispose();
              });
            } else {
              const mat = child.material as THREE.Material & { map?: THREE.Texture };
              if (mat.map) mat.map.dispose();
              mat.dispose();
            }
          }
        }
      });

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  };

  let idleId: number | undefined;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let sceneStarted = false;

  const triggerSetup = () => {
    if (sceneStarted || canceled) return;
    sceneStarted = true;
    setupScene();
  };

  const container = mountRef.current;
  const wrapper = container?.parentElement;

  if (wrapper) {
    wrapper.addEventListener('pointerenter', triggerSetup, { once: true, passive: true });
    wrapper.addEventListener('touchstart', triggerSetup, { once: true, passive: true });
  }

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    idleId = (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(triggerSetup, { timeout: 4500 });
  } else {
    timerId = setTimeout(triggerSetup, 3800);
  }

  return () => {
    canceled = true;
    if (wrapper) {
      wrapper.removeEventListener('pointerenter', triggerSetup);
      wrapper.removeEventListener('touchstart', triggerSetup);
    }
    if (idleId && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
      (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
    }
    if (timerId) clearTimeout(timerId);
    if (cleanupFn) cleanupFn();
  };
}, [reducedMotion, soundEnabled]);

  return (
    <div
      className="orbitable-hero-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1020px',
        aspectRatio: '1020 / 432',
        minHeight: '260px',
        maxHeight: '440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <img
        src="/festiya-logo.webp"
        alt="Festiya 3D Mascot Logo"
        width={639}
        height={240}
        fetchPriority="high"
        className="festiya-masthead-img"
        style={{
          position: 'absolute',
          inset: 0,
          margin: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          opacity: is3DReady ? 0 : 1,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />
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
          opacity: is3DReady ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
};
