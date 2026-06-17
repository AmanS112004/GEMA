import { useState, useEffect, useRef } from 'react';

export interface SectionMetrics {
  parallax: number;
  opacity: number;
}

export const useScrollFrames = () => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [opacity, setOpacity] = useState(0.18);
  const [translateY, setTranslateY] = useState(0);
  const [scale, setScale] = useState(1);
  const [blur, setBlur] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  const stateRef = useRef({
    frameIndex: 0,
    targetFrameIndex: 0,
    scrollProgress: 0,
    isScrolling: false,
    lastScrollY: 0,
    scrollTimeout: 0,
    fpsBuffer: [] as number[],
    lastFrameTime: performance.now(),
    frameCount: 0,
  });

  useEffect(() => {
    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setUseFallback(true);
      return;
    }

    // Identify responsive device specs
    const getDeviceSpecs = () => {
      const w = window.innerWidth;
      if (w < 768) {
        return { totalFrames: 48, step: 4, maxFrame: 188 };
      } else if (w < 1024) {
        return { totalFrames: 96, step: 2, maxFrame: 190 };
      } else {
        return { totalFrames: 192, step: 1, maxFrame: 191 };
      }
    };

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

    const handleScroll = () => {
      const docEl = document.documentElement;
      const scrollY = window.scrollY;
      const maxScroll = docEl.scrollHeight - window.innerHeight;
      const progress = maxScroll <= 0 ? 0 : scrollY / maxScroll;
      
      const state = stateRef.current;
      state.scrollProgress = progress;
      state.isScrolling = true;

      // Calculate Target Frame based on device configuration
      const { step, maxFrame } = getDeviceSpecs();
      const intervals = Math.floor(192 / step) - 1;
      
      // Strict No-Reverse constraint: target index must never decrease
      const calculatedFrame = Math.round(progress * intervals) * step;
      state.targetFrameIndex = Math.min(
        maxFrame,
        Math.max(state.targetFrameIndex, calculatedFrame)
      );

      // Section Transitions (Parallax & Opacity)
      let activeParallax = 1.0;
      let activeOpacity = 0.18;

      const viewportCenter = scrollY + window.innerHeight / 2;

      for (let i = 0; i < sectionsConfig.length; i++) {
        const item = sectionsConfig[i];
        const element = document.querySelector(item.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elemTop = rect.top + scrollY;
          const elemHeight = rect.height;
          const elemCenter = elemTop + elemHeight / 2;

          // If viewport center is within or closest to this section
          const distance = Math.abs(viewportCenter - elemCenter);
          if (distance < window.innerHeight) {
            // Apply linear interpolation between sections
            const weight = 1 - distance / window.innerHeight;
            activeParallax = activeParallax * (1 - weight) + item.parallax * weight;
            activeOpacity = activeOpacity * (1 - weight) + item.opacity * weight;
          }
        }
      }

      setOpacity(activeOpacity);

      // TranslateY motion effect (0 -> 18px)
      const targetTranslateY = progress * 18;
      setTranslateY(targetTranslateY);

      // Scale (1 -> 1.03) and Blur (0 -> 0.8) during active scrolling
      setScale(1 + progress * 0.03);
      setBlur(progress * 0.8);

      // Scroll stop settle timeout
      window.clearTimeout(state.scrollTimeout);
      state.scrollTimeout = window.setTimeout(() => {
        state.isScrolling = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial run

    // Lerp and animation render loop
    let animationFrameId: number;
    const update = () => {
      const state = stateRef.current;
      const now = performance.now();
      const delta = now - state.lastFrameTime;
      state.lastFrameTime = now;

      // Monitor FPS during active scrolling
      if (state.isScrolling && delta > 0) {
        const fps = 1000 / delta;
        state.fpsBuffer.push(fps);
        if (state.fpsBuffer.length > 50) {
          state.fpsBuffer.shift();
          const avgFps = state.fpsBuffer.reduce((a, b) => a + b, 0) / state.fpsBuffer.length;
          // Trigger fallback if framerate consistently drops below 45 FPS
          if (avgFps < 45 && state.frameCount > 100) {
            setUseFallback(true);
          }
        }
      }
      state.frameCount++;

      // Smooth interpolation of Frame Index (Lerp)
      if (state.frameIndex < state.targetFrameIndex) {
        // Increment slowly for premium buttery feel
        const diff = state.targetFrameIndex - state.frameIndex;
        const step = Math.max(1, Math.round(diff * 0.1));
        state.frameIndex = Math.min(state.targetFrameIndex, state.frameIndex + step);
        setFrameIndex(state.frameIndex);
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
      window.clearTimeout(stateRef.current.scrollTimeout);
    };
  }, [useFallback]);

  return {
    frameIndex,
    opacity,
    translateY,
    scale,
    blur,
    useFallback,
  };
};
