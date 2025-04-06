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