import React, { useEffect, useRef } from 'react';
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

    let isDisposed = false;
    let cleanupFn: (() => void) | undefined;

    import('three').then((THREE) => {
      if (isDisposed) return;

      // Viewport sizing: expansive bounding box for commanding 3D masthead presence without edge clipping
      const getViewportSize = () => {
        const w = Math.min(container.clientWidth || 940, 940);
        const naturalH = Math.round(w * (400 / 940));
        const h = Math.min(420, Math.max(260, naturalH));
        return { width: w, height: h };
      };

      let { width, height } = getViewportSize();

      // Three.js Scene Setup (32° FOV gives natural depth and avoids distortion)
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);

      const targetW = 6.0;
      const targetH = (6.0 * 768) / 2046; // ~2.252

      const updateCameraDistance = (w: number, h: number) => {
        const aspect = w / h;
        const fovRad = (32 * Math.PI) / 180;
        const tanHalfFov = Math.tan(fovRad / 2);

        // Extended bounding box margin so rotation never clips edges even on full tilt
        const distW = (targetW * 1.48) / (2 * aspect * tanHalfFov);
        const distH = (targetH * 1.55) / (2 * tanHalfFov);
        const dist = Math.max(distW, distH, 6.5);

        camera.fov = 32;
        camera.aspect = aspect;
        camera.position.set(0, 0, dist);
        camera.updateProjectionMatrix();
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

      // Warm, velvety lighting tuned for real 3D plush sheen & highlights
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

      // Orbitable Root Group
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      // Load Pristine High-Res Logo Texture
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        '/festiya-logo.webp',
        (texture) => {
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.colorSpace = THREE.SRGBColorSpace;

          const planeGeo = new THREE.PlaneGeometry(targetW, targetH, 1, 1);

          // MeshStandardMaterial reacts to 3D lighting with real plush velvet sheen
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

      // Orbit Interaction Dynamics (Fluid tactile 3D twist & momentum)
      let isDragging = false;
      let prevPointerX = 0;
      let prevPointerY = 0;
      let targetRotY = 0;
      let targetRotX = 0;
      let currentRotY = 0;
      let currentRotX = 0;
      let velocityY = 0;
      let velocityX = 0;

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
        velocityY = 0;
        velocityX = 0;
        dom.style.cursor = 'grabbing';
        playPopSound(soundEnabled);
      };

      const onPointerMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;

        velocityY = deltaX * 0.009;
        velocityX = deltaY * 0.007;

        targetRotY += velocityY;
        targetRotX += velocityX;

        // Generous tilt range: dramatic, responsive 3D twist without clipping
        targetRotY = Math.max(-0.55, Math.min(0.55, targetRotY));
        targetRotX = Math.max(-0.35, Math.min(0.35, targetRotX));

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

      // Resize Handler
      const handleResize = () => {
        if (!container) return;
        const { width: newW, height: newH } = getViewportSize();
        updateCameraDistance(newW, newH);
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
          // Direct tracking with smooth inertia
          currentRotY += (targetRotY - currentRotY) * 0.18;
          currentRotX += (targetRotX - currentRotX) * 0.18;
        } else {
          // Apply velocity glide
          targetRotY += velocityY;
          targetRotX += velocityX;
          velocityY *= 0.91;
          velocityX *= 0.91;

          targetRotY = Math.max(-0.55, Math.min(0.55, targetRotY));
          targetRotX = Math.max(-0.35, Math.min(0.35, targetRotX));

          // Soft harmonic 3D floating & gentle return toward alive breathing float
          if (!reducedMotion) {
            const idleRotY = Math.sin(elapsedTime * 0.9) * 0.12;
            const idleRotX = Math.cos(elapsedTime * 0.7) * 0.07;
            targetRotY += (idleRotY - targetRotY) * 0.04;
            targetRotX += (idleRotX - targetRotX) * 0.04;
            orbitGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.08;
          }

          currentRotY += (targetRotY - currentRotY) * 0.09;
          currentRotX += (targetRotX - currentRotX) * 0.09;
        }

        orbitGroup.rotation.y = currentRotY;
        orbitGroup.rotation.x = currentRotX;

        renderer.render(scene, camera);
      };

      const observer = new IntersectionObserver(
        (entries) => {
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
        },
        { threshold: 0.05 }
      );

      observer.observe(container);

      cleanupFn = () => {
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
    });

    return () => {
      isDisposed = true;
      cleanupFn?.();
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
