const imgCache: HTMLImageElement[] = [];
const loadingStarted = new Set<number>();
const loadedSet = new Set<number>();

// Generate 192 WebP frame URLs pointing to public/bg-webp/
export const frameUrls: string[] = Array.from({ length: 192 }, (_, i) => {
  const frameNum = String(i + 1).padStart(5, '0');
  return `/bg-webp/${frameNum}.webp`;
});

// Pre-fill image cache array with HTMLImageElement references
for (let i = 0; i < 192; i++) {
  imgCache.push(new Image());
}

/**
 * Loads a single frame, pre-decoding it off the main thread if supported.
 */
export const loadFrame = (index: number): Promise<HTMLImageElement> => {
  if (index < 0 || index >= 192) {
    return Promise.reject(new Error(`Index ${index} out of bounds`));
  }

  const img = imgCache[index];
  const url = frameUrls[index];

  // If already loaded and ready (must verify src is set to avoid empty Image complete state)
  if (loadedSet.has(index) || (img.src && img.complete)) {
    loadedSet.add(index);
    return Promise.resolve(img);
  }

  // If currently loading, wait for it
  if (loadingStarted.has(index)) {
    return new Promise((resolve) => {
      const handleLoad = () => {
        loadedSet.add(index);
        resolve(img);
      };
      img.addEventListener('load', handleLoad, { once: true });
      img.addEventListener('error', handleLoad, { once: true });
    });
  }

  loadingStarted.add(index);
  img.src = url;

  // Utilize HTMLImageElement.decode() for asynchronous off-main-thread image decoding
  if (typeof img.decode === 'function') {
    return img.decode()
      .then(() => {
        loadedSet.add(index);
        return img;
      })
      .catch(() => {
        // Fallback if decode fails or gets aborted
        loadedSet.add(index);
        return img;
      });
  } else {
    return new Promise((resolve) => {
      const handleLoad = () => {
        loadedSet.add(index);
        resolve(img);
      };
      img.onload = handleLoad;
      img.onerror = handleLoad;
    });
  }
};

/**
 * Preloads the window of frames around the current scroll position as high priority.
 */
export const preloadFrames = (currentIndex: number) => {
  const nextCount = 12;
  const prevCount = 4;
  
  const start = Math.max(0, currentIndex - prevCount);
  const end = Math.min(frameUrls.length, currentIndex + nextCount + 1);
  
  for (let i = start; i < end; i++) {
    if (!loadingStarted.has(i)) {
      loadFrame(i);
    }
  }
};

/**
 * Synchronously retrieve a preloaded WebP image element from cache if it is fully loaded.
 */
export const getFrameImageSync = (index: number): HTMLImageElement | null => {
  if (index < 0 || index >= 192) return null;
  const img = imgCache[index];
  if (loadedSet.has(index) || (img && img.src && img.complete)) {
    loadedSet.add(index);
    return img;
  }
  return null;
};

/**
 * Retrieve an image element for a given frame index, resolving synchronously if cached and loaded.
 * Fallback to async promise if needed.
 */
export const getFrameImage = (index: number): Promise<HTMLImageElement> => {
  return loadFrame(index);
};

/**
 * Searches outwards from the requested index and returns the closest loaded image element.
 * Guarantees that the canvas always has a frame to draw during rapid scrolling.
 */
export const getClosestLoadedFrame = (index: number): HTMLImageElement | null => {
  if (index < 0 || index >= 192) return null;

  // 1. Check if the exact requested index is ready
  const exactImg = getFrameImageSync(index);
  if (exactImg) return exactImg;

  // 2. Search outwards
  let offset = 1;
  const maxSearchRange = Math.max(index, 191 - index);
  while (offset <= maxSearchRange) {
    const prev = index - offset;
    const next = index + offset;

    if (prev >= 0) {
      const prevImg = getFrameImageSync(prev);
      if (prevImg) return prevImg;
    }
    if (next < 192) {
      const nextImg = getFrameImageSync(next);
      if (nextImg) return nextImg;
    }
    offset++;
  }

  return null;
};

/**
 * Sequentially loads all 192 frames in the background with small batch concurrency
 * to populate the cache without blocking the main rendering thread.
 */
export const startBackgroundPreload = () => {
  // Preload first 15 frames immediately to ensure initial interactivity is perfect
  for (let i = 0; i < 15; i++) {
    loadFrame(i);
  }

  // Defer background loading of the rest of the frames to keep page interactive
  setTimeout(() => {
    let index = 15;
    const batchSize = 3;

    const loadNextBatch = () => {
      if (index >= 192) {
        return;
      }

      const promises: Promise<HTMLImageElement>[] = [];
      let count = 0;

      while (index < 192 && count < batchSize) {
        if (!loadingStarted.has(index)) {
          promises.push(loadFrame(index));
          count++;
        }
        index++;
      }

      if (promises.length === 0) {
        // All frames in this batch are already loading or loaded, move on
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => loadNextBatch());
        } else {
          setTimeout(loadNextBatch, 30);
        }
        return;
      }

      Promise.all(promises).then(() => {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => loadNextBatch());
        } else {
          setTimeout(loadNextBatch, 30);
        }
      }).catch(() => {
        // Continue loading even if one frame fails
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => loadNextBatch());
        } else {
          setTimeout(loadNextBatch, 30);
        }
      });
    };

    loadNextBatch();
  }, 1000);
};

// Start preloading automatically on module import after initial render cycle
if (typeof window !== 'undefined') {
  startBackgroundPreload();
}
