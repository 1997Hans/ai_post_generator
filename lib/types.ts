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
  prompt: string;
  refinedPrompt?: string;
  content: string;
  caption?: string;
  hashtags: string[];
  imageUrl?: string;
  tone?: string;
  visualStyle?: string;
  createdAt: string;
  updatedAt: string;
  approved?: boolean | null;
}

export interface PostHistory {
  posts: Post[];
}

export interface FeedbackData {
  postId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface PostRequestInput {
  prompt: string;
  tone?: string;
  visualStyle?: string;
  brandingImageUrl?: string;
}

export interface PostOutput {
  id: string;
  content: string;
  caption?: string;
  hashtags: string[];
  imageUrl?: string;
}

export interface ExportOptions {
  format: 'text' | 'image' | 'schedule';
  platform?: 'twitter' | 'instagram' | 'facebook' | 'linkedin';
  scheduledTime?: string;
}

export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin';

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