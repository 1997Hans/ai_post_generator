/**
 * Types for tone selection
 */
export type ToneType = 
  | 'professional' 
  | 'friendly' 
  | 'humorous' 
  | 'inspirational'
  | 'informative'
  | 'casual';

/**
 * Types for visual styles
 */
export type VisualStyle = 
  | 'realistic' 
  | 'artistic' 
  | 'minimalist'
  | 'abstract'
  | 'cartoon';

/**
 * Social media platform types
 */
export type Platform = 'instagram' | 'twitter' | 'linkedin' | 'facebook';

/**
 * Request input for generating a post
 */
export interface PostRequestInput {
  topic: string;
  tone?: ToneType;
  visualStyle?: VisualStyle;
  platform?: Platform;
  brandGuidelines?: string;
  maxLength?: number;
}

/**
 * Response from post generation
 */
export interface PostOutput {
  mainContent: string;
  caption: string;
  hashtags: string[];
  visualPrompt: string;
  imageUrl?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
} 