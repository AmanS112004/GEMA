import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    // Detect low-end devices or non-WebGL systems
    const checkLowEnd = () => {
      try {
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as any).deviceMemory || 4;
        
        // Check if WebGL is supported
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl || cores < 4 || memory < 4) {
          return true;
        }
      } catch (e) {
        return true;
      }
      return false;
    };

    if (checkLowEnd()) {
      setIsLowEnd(true);
      return;
    }

    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 200;

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. Particles Configuration
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    // Initialize random positions and velocities
    for (let i = 0; i < particleCount; i++) {
      // Spread positions across screen bounds
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      velocities.push({
        x: (Math.random() - 0.5) * 0.3,
        y: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.1,
      });
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Particle Texture (draw a clean circle)
    const createCircleTexture = () => {
      const size = 16;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
        ctx.fillStyle = '#4A6444';
        ctx.fill();
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const material = new THREE.PointsMaterial({
      size: 4,
      transparent: true,
      opacity: 0.6,
      map: createCircleTexture(),
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. Mouse Interactive Gravity
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to match 3D bounds roughly
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 150;
      mouse.targetY = -(event.clientY / window.innerHeight - 0.5) * 150;
    };

    window.addEventListener('mousemove', onMouseMove);

    // 5. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Damp mouse target
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const posAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      const array = posAttribute.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Move particle
        array[i * 3] += velocities[i].x;
        array[i * 3 + 1] += velocities[i].y;
        array[i * 3 + 2] += velocities[i].z;

        // Apply mouse-reactive pull
        const dx = mouse.x - array[i * 3];
        const dy = mouse.y - array[i * 3 + 1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 80) {
          // Attract particles slightly towards cursor
          const force = (80 - dist) * 0.0005;
          array[i * 3] += dx * force;
          array[i * 3 + 1] += dy * force;
        }

        // Boundary collision / wrap around
        if (Math.abs(array[i * 3]) > 200) {
          array[i * 3] = (array[i * 3] > 0 ? -199 : 199);
        }
        if (Math.abs(array[i * 3 + 1]) > 200) {
          array[i * 3 + 1] = (array[i * 3 + 1] > 0 ? -199 : 199);
        }
      }

      posAttribute.needsUpdate = true;

      // Rotate points system very slowly
      particles.rotation.y += 0.0005;
      particles.rotation.x += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (renderer.domElement && containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isLowEnd]);

  if (isLowEnd) {
    // Elegant fallback: SVG floating circles & gradient backdrop
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F5F1E8] to-[#EAE4D5] overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="4" fill="#4A6444" className="animate-pulse" />
          <circle cx="85%" cy="15%" r="6" fill="#4A6444" className="animate-pulse duration-1000" />
          <circle cx="50%" cy="80%" r="5" fill="#4A6444" className="animate-pulse duration-700" />
          <circle cx="20%" cy="70%" r="8" fill="#4A6444" className="animate-pulse duration-1500" />
          <circle cx="75%" cy="75%" r="5" fill="#4A6444" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-50 bg-[#F5F1E8]"
    />
  );
};
