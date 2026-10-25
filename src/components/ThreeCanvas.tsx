import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  activeOccasion: string;
  reducedMotion: boolean;
  isPaused: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  scrollProgress,
  activeOccasion,
  reducedMotion,
  isPaused,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  const reducedMotionRef = useRef(reducedMotion);
  const isPausedRef = useRef(isPaused);
  const activeOccasionRef = useRef(activeOccasion);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Keep refs synchronized without recreating the WebGL context
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    activeOccasionRef.current = activeOccasion;
  }, [activeOccasion]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xFFF8F0, 0.015);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Ambient & Directional Celebration Lights ---
    const ambientLight = new THREE.AmbientLight(0xFFF3E0, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFAA00, 2.0);
    sunLight.position.set(6, 10, 8);
    scene.add(sunLight);

    const coralRimLight = new THREE.DirectionalLight(0xFF4D6D, 1.2);
    coralRimLight.position.set(-6, -4, -3);
    scene.add(coralRimLight);

    const dynamicStageLight = new THREE.PointLight(0xFF5E1E, 3.5, 35);
    dynamicStageLight.position.set(0, 0, 5);
    scene.add(dynamicStageLight);

    // --- 3D Confetti Particle Galaxy (Subtle, Airy, Elegant Celebration Sparkles) ---
    // NO floating billboard mascots, NO toruses
    const particleCount = 900;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const confettiPalette = [
      new THREE.Color(0xFF5E1E), // Happy Orange
      new THREE.Color(0xFF8A47), // Peach Orange
      new THREE.Color(0xFFB703), // Sunshine Gold
      new THREE.Color(0xFF4D6D), // Coral
      new THREE.Color(0x06D6A0), // Mint
      new THREE.Color(0xFFEAA7), // Cream Glow
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45 - 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;

      const c = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circular sparkle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.35, 'rgba(255,225,190,0.85)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // --- Mouse Parallax Handler ---
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Window Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isPausedRef.current) return;

      clock.getDelta();
      const elapsedTime = clock.getElapsedTime();
      const isCalm = reducedMotionRef.current;
      const progress = scrollRef.current; // 0.0 to 1.0

      // Smooth mouse parallax lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Smooth camera depth glide along scroll progression
      const targetCamY = -progress * 20;
      const targetCamX = (isCalm ? 0 : mouseRef.current.x * 0.5);
      const targetCamZ = 9 - Math.sin(progress * Math.PI) * 1.5 + (isCalm ? 0 : mouseRef.current.y * 0.3);

      if (isCalm) {
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.position.x = 0;
        camera.position.z = 9;
        camera.rotation.set(0, 0, 0);
      } else {
        camera.position.y += (targetCamY - camera.position.y) * 0.06;
        camera.position.x += (targetCamX - camera.position.x) * 0.06;
        camera.position.z += (targetCamZ - camera.position.z) * 0.06;
        camera.rotation.y = mouseRef.current.x * 0.04;
        camera.rotation.x = -mouseRef.current.y * 0.04;
      }

      // Dynamic ambient stage light matching current selected occasion
      let themeColor = 0xFF5E1E; // Default happy orange
      if (activeOccasionRef.current === 'wedding') themeColor = 0xFF4D6D; // Coral
      else if (activeOccasionRef.current === 'birthday') themeColor = 0xFFB703; // Gold
      else if (activeOccasionRef.current === 'community') themeColor = 0x06D6A0; // Mint
      else if (activeOccasionRef.current === 'work') themeColor = 0x118AB2; // Sky Blue

      dynamicStageLight.color.lerp(new THREE.Color(themeColor), 0.05);
      dynamicStageLight.position.set(
        Math.sin(elapsedTime * 1.2) * 3,
        camera.position.y,
        camera.position.z - 2
      );

      // Gentle drift for celebration sparkle particles
      if (!isCalm) {
        particleSystem.rotation.y = elapsedTime * 0.025;
        particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="webgl-background-container"
      aria-hidden="true"
    />
  );
};
