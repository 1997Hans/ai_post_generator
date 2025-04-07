/**
 * Accessibility utilities for the Social Media Post Generator
 */

export const srOnly = 'sr-only';

// This keyboard trap utility ensures focus stays within a component
export function trapFocus(element: HTMLElement, event: KeyboardEvent) {
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (!focusableElements.length) return;
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  // Handle Tab key press
  if (event.key === 'Tab') {
    // Shift + Tab - navigate backwards
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    // Tab - navigate forwards
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }
}

// Skip link function to improve keyboard navigation
export function setupSkipLink(targetId: string) {
  const skipLink = document.querySelector('[data-skip-link]') as HTMLAnchorElement;
  if (skipLink) {
    skipLink.href = `#${targetId}`;
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }
}

// Announce dynamic content changes to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document !== 'undefined') {
    let announcer = document.getElementById('sr-announcer');
    
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'sr-announcer';
      announcer.setAttribute('aria-live', priority);
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = srOnly;
      document.body.appendChild(announcer);
    }
    
    // Clear previous content first, then add new announcement
    // This ensures screen readers announce the change
    announcer.textContent = '';
    
    // Small timeout to ensure the clear happens first
    setTimeout(() => {
      if (announcer) announcer.textContent = message;
    }, 50);
  }
}

// Handle responsive font sizes for better readability
export function getResponsiveFontSize(baseSize: number, minSize: number, maxSize: number): string {
  return `clamp(${minSize}rem, ${baseSize}vw, ${maxSize}rem)`;
}

// Generate accessible color combinations with sufficient contrast
export function getAccessibleColors(primaryColor: string): {
  background: string;
  text: string;
  contrast: number;
} {
  // In a real implementation, this would calculate proper contrast ratios
  // This is a simplified example
  return {
    background: primaryColor,
    text: '#ffffff', 
    contrast: 4.5  // WCAG AA minimum is 4.5:1 for normal text
  };
} 