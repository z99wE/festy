import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { Hand } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface TactileHero3DProps {
  reducedMotion?: boolean;
  soundEnabled?: boolean;
}

export const TactileHero3D: React.FC<TactileHero3DProps> = ({
  reducedMotion = false,
  soundEnabled = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSquishing, setIsSquishing] = useState(false);
  const [squishCount, setSquishCount] = useState(0);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent canvas

    container.appendChild(renderer.domElement);

    // 2. Warm Studio Lighting for Tactile Plush Softness
    const ambientLight = new THREE.AmbientLight(0xfff3e6, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffaa55, 3.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xff5e1e, 2.5, 15);
    rimLight.position.set(-4, -2, 4);
    scene.add(rimLight);

    const topGlow = new THREE.PointLight(0xffd152, 2.0, 12);
    topGlow.position.set(0, 4, 3);
    scene.add(topGlow);

    // 3. Tactile 3D Plush Group
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // Load High-Res Plush Festiya Logo as Texture for the 3D plush face
    const textureLoader = new THREE.TextureLoader();
    const plushTexture = textureLoader.load('/festiya-hero.webp', () => {
      plushTexture.colorSpace = THREE.SRGBColorSpace;
    });

    // Create a 3D pill/cushion geometry (squishable body)
    const plushGeom = new THREE.CylinderGeometry(2.1, 2.1, 1.25, 32, 8);
    // Bevel/soften edges
    const posAttr = plushGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      if (Math.abs(y) > 0.5) {
        const factor = 1 - (Math.abs(y) - 0.5) * 0.4;
        posAttr.setX(i, posAttr.getX(i) * factor);
        posAttr.setZ(i, posAttr.getZ(i) * factor);
      }
    }
    plushGeom.computeVertexNormals();

    const plushMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      map: plushTexture,
      roughness: 0.35,
      metalness: 0.05,
    });

    const plushMesh = new THREE.Mesh(plushGeom, plushMat);
    plushMesh.rotation.x = Math.PI / 2;
    mascotGroup.add(plushMesh);

    // Soft floating shadow under the plush
    const shadowGeom = new THREE.PlaneGeometry(4.2, 2.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x58220a,
      transparent: true,
      opacity: 0.18,
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.position.set(0, -1.8, -0.5);
    scene.add(shadowMesh);

    // 4. Spring Physics State for Squash & Stretch
    let scaleX = 1;
    let scaleY = 1;
    let scaleZ = 1;
    let velY = 0;
    const targetScaleY = 1;
    const stiffness = 0.16;
    const damping = 0.78;

    // Mouse / Touch Rotation & Tracking
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const applySquishImpulse = (intensity: number = 0.42) => {
      velY -= intensity;
      setIsSquishing(true);
      setSquishCount((prev) => prev + 1);

      playPopSound(soundEnabled);

      // Confetti burst on direct squish
      confetti({
        particleCount: 22,
        spread: 60,
        origin: { y: 0.38, x: 0.72 },
        colors: ['#FF5E1E', '#FFB703', '#06D6A0', '#FF4D6D'],
      });
    };

    const dom = renderer.domElement;

    // Pointer events
    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      applySquishImpulse(0.5);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        // Gentle cursor hover tracking
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetRotY = normX * 0.45;
        targetRotX = -normY * 0.25;
        return;
      }
      const deltaX = e.clientX - startPointerX;
      const deltaY = e.clientY - startPointerY;
      startPointerX = e.clientX;
      startPointerY = e.clientY;

      targetRotY += deltaX * 0.015;
      targetRotX += deltaY * 0.01;
    };

    const handlePointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsSquishing(false), 800);
    };

    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Touch pinch-to-squish
    let initialPinchDistance = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const ratio = currentDist / (initialPinchDistance || 1);
        if (ratio < 0.9) {
          applySquishImpulse(0.35);
        }
      }
    };

    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 5. 60FPS Physics Simulation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Spring physics calculation (Hooke's Law with damping)
      const forceY = -stiffness * (scaleY - targetScaleY);
      velY = (velY + forceY) * damping;
      scaleY += velY;

      // Volume conservation: if Y squashes, X and Z bulge outward!
      scaleX = 1 + (1 - scaleY) * 0.8;
      scaleZ = 1 + (1 - scaleY) * 0.8;

      // Idle breathing float
      const breathe = Math.sin(time * 2.2) * 0.03;
      mascotGroup.scale.set(scaleX * (1 + breathe), scaleY * (1 - breathe), scaleZ * (1 + breathe));
      mascotGroup.position.y = Math.sin(time * 1.8) * 0.12;

      // Smooth rotation lerp
      currentRotY += (targetRotY - currentRotY) * 0.08;
      currentRotX += (targetRotX - currentRotX) * 0.08;
      mascotGroup.rotation.y = currentRotY;
      mascotGroup.rotation.x = currentRotX;

      // Shadow squishes in sync
      shadowMesh.scale.set(scaleX * 1.05, scaleZ * 1.05, 1);
      shadowMat.opacity = 0.18 + (1 - scaleY) * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      plushGeom.dispose();
      plushMat.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
    };
  }, [reducedMotion, soundEnabled]);

  return (
    <div className="tactile-hero-container">
      <div ref={mountRef} className="tactile-hero-canvas-wrap" />

      {/* Tactile interaction pill hint */}
      <div className={`tactile-hint-badge ${isSquishing ? 'squished' : ''}`}>
        <Hand size={14} className="hand-tap-anim" />
        <span>{squishCount > 0 ? `Squished ${squishCount}x! ✨` : 'Tap, pinch or squish Festi!'}</span>
      </div>
    </div>
  );
};
