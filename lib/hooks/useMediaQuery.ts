'use client';

import { useEffect, useState } from 'react';

// Define breakpoints consistent with Tailwind
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook for responsive design
 * @param query Media query string or breakpoint key from Tailwind
 * @returns boolean indicating if the media query matches
 * 
 * @example
 * // Use with breakpoint key
 * const isMobile = useMediaQuery('sm'); // true if viewport width is < 640px
 * const isTablet = useMediaQuery('md'); // true if viewport width is < 768px
 * const isDesktop = useMediaQuery('lg'); // true if viewport width is >= 1024px
 * 
 * // Use with custom query
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: BreakpointKey | string): boolean {
  // Default to true for SSR to avoid layout shifts
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    // Handle SSR
    if (typeof window === 'undefined') return;
    
    // Convert breakpoint key to media query if needed
    const mediaQuery = Object.keys(breakpoints).includes(query as string)
      ? `(max-width: ${breakpoints[query as BreakpointKey] - 1}px)`
      : query;
      
    // Create media query list
    const mediaQueryList = window.matchMedia(mediaQuery);
    
    // Set initial value
    setMatches(mediaQueryList.matches);
    
    // Define callback
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add listener
    mediaQueryList.addEventListener('change', listener);
    
    // Cleanup
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);
  
  return matches;
}

/**
 * Hook to get current viewport dimensions
 * @returns object with width and height properties
 */
export function useViewport() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Call once to set initial size
    handleResize();
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return dimensions;
} 