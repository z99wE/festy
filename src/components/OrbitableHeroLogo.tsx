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

    // Viewport: 30% bigger presence
    const getViewportSize = () => {
      const w = container.clientWidth || 640;
      const h = Math.min(480, Math.max(340, Math.round(w * 0.65)));
      return { width: w, height: h };
    };

    let { width, height } = getViewportSize();

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);

    // Dynamic framing so the 30% larger plush mascot is prominent without edge clipping
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      const fovRad = (32 * Math.PI) / 180;
      const targetW = 4.4;
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
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Balanced Studio Lighting: Soft warm ambiance without harsh hotspots
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeed6, 2.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffdfb8, 1.4);
    fillLight.position.set(-3, -2, 2);
    scene.add(fillLight);

    // Warm rim light highlighting fur fibers during 360 rotation
    const rimLight = new THREE.DirectionalLight(0xffa834, 2.2);
    rimLight.position.set(-2, 2, -4);
    scene.add(rimLight);

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
        const depth = 0.24; // Plump 3D volume & extrusion
        const halfDepth = depth / 2;

        // Build continuous 3D side extrusion from the alpha contour of the plush letters
        if (texture.image && typeof document !== 'undefined') {
          const sampleW = 288;
          const sampleH = 108;
          const canvas = document.createElement('canvas');
          canvas.width = sampleW;
          canvas.height = sampleH;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(texture.image, 0, 0, sampleW, sampleH);
            const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
            const data = imgData.data;

            const isSolid = (x: number, y: number) => {
              if (x < 0 || x >= sampleW || y < 0 || y >= sampleH) return false;
              const idx = (y * sampleW + x) * 4;
              return data[idx + 3] > 75; // Alpha threshold
            };

            const positions: number[] = [];
            const colors: number[] = [];

            const toWorldX = (px: number) => ((px / sampleW) - 0.5) * worldW;
            const toWorldY = (py: number) => (0.5 - (py / sampleH)) * worldH;

            const addQuad = (
              vA: [number, number, number],
              vB: [number, number, number],
              vC: [number, number, number],
              vD: [number, number, number],
              r: number,
              g: number,
              b: number
            ) => {
              // Triangle 1
              positions.push(...vA, ...vB, ...vC);
              colors.push(r, g, b, r, g, b, r, g, b);
              // Triangle 2
              positions.push(...vA, ...vC, ...vD);
              colors.push(r, g, b, r, g, b, r, g, b);
            };

            for (let y = 0; y < sampleH; y++) {
              for (let x = 0; x < sampleW; x++) {
                if (!isSolid(x, y)) continue;

                const idx = (y * sampleW + x) * 4;
                const r = data[idx] / 255;
                const g = data[idx + 1] / 255;
                const b = data[idx + 2] / 255;

                // Top boundary (normal facing +Y)
                if (!isSolid(x, y - 1)) {
                  addQuad(
                    [toWorldX(x), toWorldY(y), halfDepth],
                    [toWorldX(x + 1), toWorldY(y), halfDepth],
                    [toWorldX(x + 1), toWorldY(y), -halfDepth],
                    [toWorldX(x), toWorldY(y), -halfDepth],
                    r, g, b
                  );
                }

                // Bottom boundary (normal facing -Y)
                if (!isSolid(x, y + 1)) {
                  addQuad(
                    [toWorldX(x + 1), toWorldY(y + 1), halfDepth],
                    [toWorldX(x), toWorldY(y + 1), halfDepth],
                    [toWorldX(x), toWorldY(y + 1), -halfDepth],
                    [toWorldX(x + 1), toWorldY(y + 1), -halfDepth],
                    r, g, b
                  );
                }

                // Left boundary (normal facing -X)
                if (!isSolid(x - 1, y)) {
                  addQuad(
                    [toWorldX(x), toWorldY(y + 1), halfDepth],
                    [toWorldX(x), toWorldY(y), halfDepth],
                    [toWorldX(x), toWorldY(y), -halfDepth],
                    [toWorldX(x), toWorldY(y + 1), -halfDepth],
                    r, g, b
                  );
                }

                // Right boundary (normal facing +X)
                if (!isSolid(x + 1, y)) {
                  addQuad(
                    [toWorldX(x + 1), toWorldY(y), halfDepth],
                    [toWorldX(x + 1), toWorldY(y + 1), halfDepth],
                    [toWorldX(x + 1), toWorldY(y + 1), -halfDepth],
                    [toWorldX(x + 1), toWorldY(y), -halfDepth],
                    r, g, b
                  );
                }
              }
            }

            if (positions.length > 0) {
              const sideGeometry = new THREE.BufferGeometry();
              sideGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
              sideGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
              sideGeometry.computeVertexNormals();

              const sideMaterial = new THREE.MeshStandardMaterial({
                vertexColors: true,
                roughness: 0.55,
                metalness: 0.04,
                side: THREE.DoubleSide,
              });

              const sideMesh = new THREE.Mesh(sideGeometry, sideMaterial);
              orbitGroup.add(sideMesh);
            }
          }
        }

        // Front Face (Sharp high-res plush fur)
        const planeGeo = new THREE.PlaneGeometry(worldW, worldH, 16, 8);
        const frontMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.38,
          metalness: 0.06,
          side: THREE.FrontSide,
        });
        const frontMesh = new THREE.Mesh(planeGeo, frontMaterial);
        frontMesh.position.z = halfDepth + 0.002;
        orbitGroup.add(frontMesh);

        // Back Face (Mirrored 180° so fluffy fur is visible from all angles)
        const backMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          roughness: 0.38,
          metalness: 0.06,
          side: THREE.FrontSide,
        });
        const backMesh = new THREE.Mesh(planeGeo, backMaterial);
        backMesh.rotation.y = Math.PI;
        backMesh.position.z = -halfDepth - 0.002;
        orbitGroup.add(backMesh);

        // Soft Fluffy Fur Shells (Shell texturing for touchable fuzzy depth)
        const shellConfigs = [
          { z: halfDepth + 0.016, scale: 1.01, opacity: 0.55, isBack: false },
          { z: halfDepth + 0.032, scale: 1.02, opacity: 0.32, isBack: false },
          { z: -halfDepth - 0.016, scale: 1.01, opacity: 0.55, isBack: true },
          { z: -halfDepth - 0.032, scale: 1.02, opacity: 0.32, isBack: true },
        ];

        shellConfigs.forEach(({ z, scale, opacity, isBack }) => {
          const shellMat = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            opacity,
            roughness: 0.45,
            metalness: 0.02,
            side: THREE.FrontSide,
            depthWrite: false,
          });
          const shellMesh = new THREE.Mesh(planeGeo, shellMat);
          shellMesh.position.z = z;
          shellMesh.scale.set(scale, scale, 1);
          if (isBack) {
            shellMesh.rotation.y = Math.PI;
          }
          orbitGroup.add(shellMesh);
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
