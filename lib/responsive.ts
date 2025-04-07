/**
 * Responsive design utilities
 */

// Detect if user prefers reduced motion for animations
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Helper to add conditional responsive classes
export function responsiveClasses(
  baseClasses: string,
  conditionalClasses: Record<string, boolean>
): string {
  return [
    baseClasses,
    ...Object.entries(conditionalClasses)
      .filter(([_, condition]) => condition)
      .map(([className]) => className),
  ].join(' ');
}

// Create responsive image sources
export function createResponsiveImageSrc(
  basePath: string,
  sizes: Record<string, number>
): string {
  const entries = Object.entries(sizes);
  if (!entries.length) return basePath;

  // Add extension and dimension parameters based on your image provider
  // This is an example for a hypothetical image service
  return entries
    .map(([size, width]) => {
      // Example format: image.jpg?w=640 320w
      return `${basePath}?w=${width} ${width}w`;
    })
    .join(', ');
}

// Generate sizes attribute for responsive images
export function getResponsiveSizes(): string {
  return '(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw';
}

// Responsive font size utility based on viewport
export function getResponsiveFontSize(
  minSize: number,
  maxSize: number,
  minWidth = 320,
  maxWidth = 1200
): string {
  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minSize;
  
  return `clamp(${minSize}rem, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxSize}rem)`;
}

// Get the appropriate padding based on viewport size
export function getResponsivePadding(
  defaultPadding: number,
  mobilePadding: number
): string {
  return `clamp(${mobilePadding}rem, ${defaultPadding / 2}rem + 2vw, ${defaultPadding}rem)`;
}

// Generate grid template columns for responsive layouts
export function getResponsiveGrid(minWidth: number = 250): string {
  return `repeat(auto-fill, minmax(${minWidth}px, 1fr))`;
} 