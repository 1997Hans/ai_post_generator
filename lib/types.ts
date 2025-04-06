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
  | 'illustrated'
  | 'cinematic';

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
 * Image generation request input
 */
export interface ImageRequestInput {
  prompt: string;
  visualStyle?: VisualStyle;
  platform?: Platform;
  width?: number;
  height?: number;
  seed?: number;
}

/**
 * Image generation response
 */
export interface ImageGenerationResult {
  imageUrl: string | null;
  prompt: string;
  visualStyle: VisualStyle;
  error?: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface Post {
  id: string;
  content: string;
  image_url?: string | null;
  hashtags: string;
  prompt: string;
  refined_prompt?: string | null;
  tone?: string | null;
  visual_style?: string | null;
  created_at: string;
  updated_at?: string | null;
  approved: boolean;
  feedback?: string | null;
}

export interface PostResult {
  content: string;
  imageUrl?: string;
  hashtags?: string;
}

export interface PromptOptions {
  tone?: string;
  visualStyle?: string;
}

export interface PostFormState {
  prompt: string;
  tone?: string;
  visualStyle?: string;
  result: PostResult | null;
}

export interface PostInput {
  content: string;
  image_url?: string | null;
  hashtags: string;
  prompt: string;
  refined_prompt?: string | null;
  tone?: string | null;
  visual_style?: string | null;
} 