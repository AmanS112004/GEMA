import React, { useEffect, useRef } from 'react';
import { useScrollFrames } from './useScrollFrames';
import { getFrameImage, preloadFrames } from './frameLoader';
import './background.css';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frameIndex, opacity, translateY, scale, blur, useFallback } = useScrollFrames();

  // Resize canvas to match viewport dimensions
  useEffect(() => {
    if (useFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Force redrawing the current frame on resize
      getFrameImage(frameIndex)
        .then((img) => {
          drawCoverImage(canvas, img);
        })
        .catch(() => {});
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [useFallback]);

  // Redraw canvas frame when frameIndex changes
  useEffect(() => {
    if (useFallback) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let isSubscribed = true;
    getFrameImage(frameIndex)
      .then((img) => {
        if (isSubscribed) {
          drawCoverImage(canvas, img);
          // Lookahead preloading: load next 8 frames to warm cache
          preloadFrames(frameIndex, 8);
        }
      })
      .catch((err) => {
        console.warn('Failed to draw background frame:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [frameIndex, useFallback]);

  // Utility to draw image in cover style (aspect-ratio preserved)
  const drawCoverImage = (canvas: HTMLCanvasElement, img: HTMLImageElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    
    // Centering offsets
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    ctx.drawImage(img, x, y, newWidth, newHeight);
  };

  const dynamicStyles = {
    '--bg-opacity': opacity,
    '--bg-translate-y': `${translateY}px`,
    '--bg-scale': scale,
    '--bg-blur': `${blur}px`,
  } as React.CSSProperties;

  return (
    <div className="scroll-bg-container" style={dynamicStyles}>
      {useFallback ? (
        <div className="scroll-bg-fallback" />
      ) : (
        <canvas ref={canvasRef} className="scroll-bg-canvas" />
      )}
    </div>
  );
};
