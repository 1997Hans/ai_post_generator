import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts a JSON object from a string that might contain text before or after the JSON
 */
export function extractJSONFromString(text: string): any {
  try {
    // First check if the entire string is valid JSON
    return JSON.parse(text);
  } catch (e) {
    // If not, try to extract JSON from the string
    const jsonMatches = text.match(/\{(?:[^{}]|(\{(?:[^{}]|(\{(?:[^{}]|{[^{}]*})*\}))*\}))*\}/g);
    if (jsonMatches && jsonMatches.length > 0) {
      try {
        return JSON.parse(jsonMatches[0]);
      } catch (innerError) {
        console.error('Failed to parse extracted JSON:', innerError);
      }
    }
  }
  
  return null;
}

/**
 * Component boundary utilities - helps optimize RSC and Client Components
 */

export function isProdEnvironment() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Analytics tracking functions
 */
export function trackGenerationMetric(metricName: string, value: number) {
  if (typeof window !== 'undefined') {
    // In a real implementation, this would send to your analytics provider
    console.log(`[Analytics] ${metricName}: ${value}`);
    
    // Example implementation with web vitals
    if (window.performance && window.performance.mark) {
      window.performance.mark(`metric_${metricName}`);
    }
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    console.log(`[Event] ${eventName}`, properties);
    
    // This would be replaced with actual analytics implementation
    // e.g., mixpanel.track(eventName, properties)
  }
}

export function measureGenerationTime(generationId: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;
  trackGenerationMetric(`generation_time_${generationId}`, duration);
  return duration;
}