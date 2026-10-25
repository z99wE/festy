import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface VenueExperience3DProps {
  reducedMotion?: boolean;
}

/**
 * VenueExperience3D
 * 
 * An ambient, immersive Three.js spatial background that creates the sensation
 * of stepping into an illuminated evening festival/gala venue:
 * - Floating warm bokeh light orbs with soft depth-of-field bobbing
 * - Ambient 3D venue archways providing spatial architectural depth
 * - Smooth camera parallax responding to mouse drift and page scroll
 * - Cinematic motion-blur alpha trailing for smooth, luxurious motion
 * - Zero on-screen instructions — seamless, passive, 60fps performance
 */
export const VenueExperience3D: React.FC<VenueExperience3DProps> = ({
  reducedMotion = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || reducedMotion) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 18;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent canvas

    container.appendChild(renderer.domElement);

    // 2. Ambient & Festival Point Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3d6, 0.9);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xff7722, 2.5, 40);
    warmLight.position.set(0, 5, 8);
    scene.add(warmLight);

    const goldLight = new THREE.PointLight(0xffc83b, 2.0, 35);
    goldLight.position.set(-10, -2, 5);
    scene.add(goldLight);

    // 3. Floating Bokeh Warm Orbs (Venue Lanterns)
    const orbGroup = new THREE.Group();
    const orbCount = 14;
    const orbGeom = new THREE.SphereGeometry(0.65, 24, 24);
    const orbMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0xff6b2b,
        emissive: 0xff4411,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.55,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffd152,
        emissive: 0xffaa22,
        emissiveIntensity: 0.5,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.5,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x10b981, // celebratory mint accent
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.1,
        transparent: true,
        opacity: 0.35,
      }),
    ];

    const orbs: Array<{
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      speed: number;
      offset: number;
    }> = [];

    for (let i = 0; i < orbCount; i++) {
      const mat = orbMaterials[i % orbMaterials.length];
      const mesh = new THREE.Mesh(orbGeom, mat);
      const scale = 0.5 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 16 - 2;

      mesh.position.set(x, y, z);
      orbGroup.add(mesh);

      orbs.push({
        mesh,
        baseX: x,
        baseY: y,
        baseZ: z,
        speed: 0.4 + Math.random() * 0.6,
        offset: Math.random() * Math.PI * 2,
      });
    }
    scene.add(orbGroup);

    // 4. Elegant Venue Depth Arches
    const archGroup = new THREE.Group();
    const archCount = 3;
    for (let a = 0; a < archCount; a++) {
      const archGeom = new THREE.TorusGeometry(8 + a * 3.5, 0.04, 8, 48, Math.PI);
      const archMat = new THREE.MeshBasicMaterial({
        color: 0xffa040,
        transparent: true,
        opacity: 0.12 - a * 0.03,
      });
      const archMesh = new THREE.Mesh(archGeom, archMat);
      archMesh.position.set(0, -3, -4 - a * 6);
      archMesh.rotation.x = 0;
      archGroup.add(archMesh);
    }
    scene.add(archGroup);

    // 6. Smooth Mouse Parallax & Scroll Integration
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 2;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX * 1.5;
      mouseY = normY * 1.2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 7. Responsive Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. 60fps Animation Loop with Damped Motion Blur Glide
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const elapsedTime = clock.getElapsedTime();

      // Camera lerp (smooth spatial floating)
      targetCameraX = mouseX * 1.8;
      targetCameraY = 2 + mouseY * 1.2;

      // Scroll glides camera deeper into venue
      const scrollFactor = (scrollY / (document.body.scrollHeight || 3000)) * 10;
      const targetZ = 18 - scrollFactor * 0.8;

      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0, -5);

      // Animate Lantern Orbs with natural organic sway
      for (let i = 0; i < orbs.length; i++) {
        const item = orbs[i];
        item.mesh.position.y = item.baseY + Math.sin(elapsedTime * item.speed + item.offset) * 0.9;
        item.mesh.position.x = item.baseX + Math.cos(elapsedTime * (item.speed * 0.8) + item.offset) * 0.5;
        item.mesh.rotation.y = elapsedTime * 0.2;
      }

      // Subtle rotational sway on background venue arches
      archGroup.rotation.y = Math.sin(elapsedTime * 0.2) * 0.03;
      archGroup.rotation.z = Math.cos(elapsedTime * 0.15) * 0.01;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      orbGeom.dispose();
      orbMaterials.forEach((m) => m.dispose());

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={mountRef}
      className="venue-3d-experience-container"
      aria-hidden="true"
    />
  );
};
