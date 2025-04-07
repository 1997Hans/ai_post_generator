'use client';

import { useCallback, useEffect, useRef } from 'react';
import { announceToScreenReader, trapFocus } from '../accessibility';

interface UseA11yOptions {
  trapFocusEnabled?: boolean;
  announceChanges?: boolean;
  autoFocus?: boolean;
}

export function useA11y<T extends HTMLElement = HTMLDivElement>(
  options: UseA11yOptions = {}
) {
  const {
    trapFocusEnabled = false,
    announceChanges = false,
    autoFocus = false,
  } = options;
  
  const elementRef = useRef<T>(null);
  
  // Handle keyboard trap focus
  useEffect(() => {
    if (!trapFocusEnabled || !elementRef.current) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      trapFocus(elementRef.current as HTMLElement, e);
    };
    
    const element = elementRef.current;
    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [trapFocusEnabled]);
  
  // Auto-focus the element when it mounts
  useEffect(() => {
    if (autoFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [autoFocus]);
  
  // Announce content changes to screen readers
  const announce = useCallback((message: string, priority?: 'polite' | 'assertive') => {
    if (announceChanges) {
      announceToScreenReader(message, priority);
    }
  }, [announceChanges]);

  return {
    elementRef,
    announce,
  };
} 