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

    // Viewport: 30% bigger presence on desktop & mobile
    const getViewportSize = () => {
      const w = container.clientWidth || 640;
      const h = Math.min(480, Math.max(340, Math.round(w * 0.65)));
      return { width: w, height: h };
    };

    let { width, height } = getViewportSize();

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);

    // Dynamic framing so 30% larger logo fits perfectly without clipping on any screen
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      const fovRad = (32 * Math.PI) / 180;
      const targetW = 4.4; // 30% larger plane span
      const targetH = 1.65;
      const distW = targetW / (2 * aspect * Math.tan(fovRad / 2));
      const distH = targetH / (2 * Math.tan(fovRad / 2));
      camera.position.set(0, 0, Math.max(4.8, Math.max(distW, distH)));
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
    renderer.toneMappingExposure = 1.35;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Warm Studio Lighting specifically tuned for plush fluffy fur fibers
    const ambientLight = new THREE.AmbientLight(0xfffaed, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedb, 3.4);
    keyLight.position.set(4, 4, 4);
    scene.add(keyLight);

    // Rim light gives golden glow to fluffy fur silhouette as it orbits
    const rimLightBack = new THREE.DirectionalLight(0xff9f38, 3.2);
    rimLightBack.position.set(-4, -2, -4);
    scene.add(rimLightBack);

    const softFill = new THREE.PointLight(0xffd580, 2.0, 12);
    softFill.position.set(0, 3, 3);
    scene.add(softFill);

    // Orbitable Root Group (30% bigger presence)
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

        // Plane aspect ratio matching the fluffy fur wordmark (1024 x 384 ~ 2.66:1)
        // Scaled up 30% (from 3.2 to 4.2 width)
        const planeW = 4.2;
        const planeH = 1.58;
        const geometry = new THREE.PlaneGeometry(planeW, planeH, 16, 8);

        // Volumetric Multi-Layer Fur Slices:
        // No solid cardboard or opaque backing box! The fluffy fur texture is visible from all angles.
        const layerConfigs = [
          { z: 0.08, opacity: 1.0, isBack: false, side: THREE.FrontSide },
          { z: 0.05, opacity: 0.65, isBack: false, side: THREE.DoubleSide },
          { z: 0.02, opacity: 0.5, isBack: false, side: THREE.DoubleSide },
          { z: 0.0, opacity: 0.45, isBack: false, side: THREE.DoubleSide },
          { z: -0.02, opacity: 0.5, isBack: false, side: THREE.DoubleSide },
          { z: -0.05, opacity: 0.65, isBack: false, side: THREE.DoubleSide },
          { z: -0.08, opacity: 1.0, isBack: true, side: THREE.FrontSide },
        ];

        layerConfigs.forEach(({ z, opacity, isBack, side }) => {
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity,
            roughness: 0.38,
            metalness: 0.06,
            side,
            depthWrite: false,
            alphaTest: 0.01,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.z = z;
          if (isBack) {
            mesh.rotation.y = Math.PI; // Perfectly faces back so fluffy fur is visible when rotated 180°
          }
          orbitGroup.add(mesh);
        });
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

      targetRotationY += deltaX * 0.011;
      targetRotationX += deltaY * 0.008;

      // Vertical tilt limits
      targetRotationX = Math.max(-0.55, Math.min(0.55, targetRotationX));

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
        targetRotationY += 0.007;
        orbitGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.07;
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
        maxWidth: '720px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '460px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
        }}
        title="Festiya 3D Plush Logo"
      />
    </div>
  );
};
