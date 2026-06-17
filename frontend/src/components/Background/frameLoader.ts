// Preload cache to avoid browser garbage collection of preloaded images
const preloadedCache = new Set<string>();
const imgCache: { [url: string]: HTMLImageElement } = {};

// Eager glob import of all PNG frames in the folder
const modules = import.meta.glob(
  './_MConverter*/*.png',
  { eager: true }
);

// Extract and sort the resolved URLs numerically based on filename
export const frameUrls: string[] = Object.keys(modules)
  .sort((a, b) => {
    const aNum = parseInt(a.match(/(\d+)\.png$/)?.[1] || '0', 10);
    const bNum = parseInt(b.match(/(\d+)\.png$/)?.[1] || '0', 10);
    return aNum - bNum;
  })
  .map((key) => {
    const val = modules[key] as any;
    return val.default || val;
  });

console.log('FRAME_LOADER: successfully loaded', frameUrls.length, 'frames.');

/**
 * Preload adjacent frames ahead of time to keep scrolling smooth and flicker-free.
 * @param startIndex The starting index in the frame list to begin preloading from.
 * @param count The number of frames ahead to load. Default is 8.
 */
export const preloadFrames = (startIndex: number, count = 8) => {
  const endIndex = Math.min(startIndex + count, frameUrls.length);
  for (let i = startIndex; i < endIndex; i++) {
    const url = frameUrls[i];
    if (url && !preloadedCache.has(url)) {
      const img = new Image();
      img.src = url;
      preloadedCache.add(url);
      imgCache[url] = img; // Retain reference in memory
    }
  }
};

/**
 * Synchronously retrieve an image element for a given frame index,
 * preloading it if it doesn't exist.
 */
export const getFrameImage = (index: number): Promise<HTMLImageElement> => {
  const url = frameUrls[index];
  if (!url) return Promise.reject(new Error(`Index ${index} out of bounds`));

  if (imgCache[url]) {
    return Promise.resolve(imgCache[url]);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      imgCache[url] = img;
      preloadedCache.add(url);
      resolve(img);
    };
    img.onerror = (err) => {
      reject(err);
    };
  });
};
