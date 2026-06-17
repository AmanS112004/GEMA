import React, { useEffect, useRef } from 'react';
import { getClosestLoadedFrame, preloadFrames } from './frameLoader';
import './background.css';

interface CachedSection {
  id: string;
  elemCenter: number;
  parallax: number;
  opacity: number;
}

export const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentFrameIndex = 0;
    let targetFrameIndex = 0;
    let lastDrawnImg: HTMLImageElement | null = null;

    let currentOpacity = 0.18;
    let targetOpacity = 0.18;

    let currentTranslateY = 0;
    let targetTranslateY = 0;

    let currentScale = 1.0;
    let targetScale = 1.0;

    let currentBlur = 0;
    let targetBlur = 0;

    // Caching layout metrics to prevent layout thrashing (getBoundingClientRect / scrollHeight)
    let cachedSections: CachedSection[] = [];
    let maxScroll = 0;

    // Parallax and Opacity maps per section
    const sectionsConfig = [
      { id: '#hero', parallax: 1.0, opacity: 0.18 },
      { id: '#details', parallax: 0.8, opacity: 0.10 },
      { id: '#why-us', parallax: 0.65, opacity: 0.10 },
      { id: '#outcomes', parallax: 0.55, opacity: 0.10 },
      { id: '#faq', parallax: 0.50, opacity: 0.10 },
      { id: '#register', parallax: 0.40, opacity: 0.08 },
      { id: 'footer', parallax: 0.0, opacity: 0.00 },
    ];

    // Compute dimensions once during mount/resize/layout changes
    const measureSections = () => {
      const docEl = document.documentElement;
      maxScroll = Math.max(1, docEl.scrollHeight - window.innerHeight);
      
      const scrollY = window.scrollY;
      cachedSections = sectionsConfig
        .map((item) => {
          const element = document.querySelector(item.id);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elemTop = rect.top + scrollY;
            const elemHeight = rect.height;
            return {
              id: item.id,
              elemCenter: elemTop + elemHeight / 2,
              parallax: item.parallax,
              opacity: item.opacity,
            };
          }
          return null;
        })
        .filter((s): s is CachedSection => s !== null);
    };

    // Resize canvas to match viewport dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastDrawnImg = null; // Force redraw on resize
      measureSections();
      drawCurrentFrame();
    };

    // Identify responsive device specs
    const getDeviceSpecs = () => {
      const w = window.innerWidth;
      if (w < 768) {
        return { step: 4, maxFrame: 188 };
      } else if (w < 1024) {
        return { step: 2, maxFrame: 190 };
      } else {
        return { step: 1, maxFrame: 191 };
      }
    };

    // Centered cover rendering
    const drawCoverImage = (img: HTMLImageElement) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const newWidth = imgWidth * ratio;
      const newHeight = imgHeight * ratio;
      
      const x = (canvasWidth - newWidth) / 2;
      const y = (canvasHeight - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);
    };

    let lastPreloadedIndex = -1;

    const drawCurrentFrame = () => {
      const index = Math.round(currentFrameIndex);
      
      // Trigger preloading for the requested index immediately when it changes
      if (index !== lastPreloadedIndex) {
        preloadFrames(index);
        lastPreloadedIndex = index;
      }

      const img = getClosestLoadedFrame(index);
      if (img && img !== lastDrawnImg) {
        drawCoverImage(img);
        lastDrawnImg = img;
      }
    };

    const applyStyles = () => {
      container.style.setProperty('--bg-opacity', String(currentOpacity));
      container.style.setProperty('--bg-translate-y', `${currentTranslateY}px`);
      container.style.setProperty('--bg-scale', String(currentScale));
      container.style.setProperty('--bg-blur', `${currentBlur}px`);
    };

    // Scroll handler - strictly performs math with cached values, preventing any layout thrashing
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const progress = maxScroll <= 0 ? 0 : scrollY / maxScroll;

      // Calculate Target Frame based on device configuration
      const { step, maxFrame } = getDeviceSpecs();
      const intervals = Math.floor(192 / step) - 1;
      const calculatedFrame = Math.round(progress * intervals) * step;
      targetFrameIndex = Math.min(maxFrame, Math.max(0, calculatedFrame));

      // Calculate opacity target by blending section configurations based on proximity to viewport center
      let activeOpacity = 0.18;
      const viewportCenter = scrollY + window.innerHeight / 2;

      for (let i = 0; i < cachedSections.length; i++) {
        const section = cachedSections[i];
        const distance = Math.abs(viewportCenter - section.elemCenter);
        if (distance < window.innerHeight) {
          const weight = 1 - distance / window.innerHeight;
          activeOpacity = activeOpacity * (1 - weight) + section.opacity * weight;
        }
      }
      targetOpacity = activeOpacity;

      // TranslateY motion effect (0 -> 18px)
      targetTranslateY = progress * 18;
      // Scale (1 -> 1.03) and Blur (0 -> 0.8) during active scrolling
      targetScale = 1 + progress * 0.03;
      targetBlur = progress * 0.8;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    // Initial measurements and updates
    resizeCanvas();
    handleScroll();
    applyStyles();

    // Re-measure after a small delay in case initial height wasn't fully computed due to font/image load
    const remeasureTimeout = setTimeout(() => {
      measureSections();
      handleScroll();
    }, 500);

    // Unified Lerp and animation render loop
    let animationFrameId: number;
    const update = () => {
      let needsStyleUpdate = false;

      // Lerp Frame Index (15% coefficient for buttery smoothness)
      if (currentFrameIndex !== targetFrameIndex) {
        const diff = targetFrameIndex - currentFrameIndex;
        if (Math.abs(diff) < 0.01) {
          currentFrameIndex = targetFrameIndex;
        } else {
          currentFrameIndex += diff * 0.15;
        }
      }

      // Lerp Opacity
      if (currentOpacity !== targetOpacity) {
        const diff = targetOpacity - currentOpacity;
        if (Math.abs(diff) < 0.001) {
          currentOpacity = targetOpacity;
        } else {
          currentOpacity += diff * 0.15;
        }
        needsStyleUpdate = true;
      }

      // Lerp TranslateY
      if (currentTranslateY !== targetTranslateY) {
        const diff = targetTranslateY - currentTranslateY;
        if (Math.abs(diff) < 0.01) {
          currentTranslateY = targetTranslateY;
        } else {
          currentTranslateY += diff * 0.15;
        }
        needsStyleUpdate = true;
      }

      // Lerp Scale
      if (currentScale !== targetScale) {
        const diff = targetScale - currentScale;
        if (Math.abs(diff) < 0.0001) {
          currentScale = targetScale;
        } else {
          currentScale += diff * 0.15;
        }
        needsStyleUpdate = true;
      }

      // Lerp Blur
      if (currentBlur !== targetBlur) {
        const diff = targetBlur - currentBlur;
        if (Math.abs(diff) < 0.01) {
          currentBlur = targetBlur;
        } else {
          currentBlur += diff * 0.15;
        }
        needsStyleUpdate = true;
      }

      // Draw current frame (internally throttled by lastDrawnImg check)
      drawCurrentFrame();

      // Direct DOM style mutation avoiding React component cycle overhead
      if (needsStyleUpdate) {
        applyStyles();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(remeasureTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-bg-container">
      <canvas ref={canvasRef} className="scroll-bg-canvas" />
    </div>
  );
};
