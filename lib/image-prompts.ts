import { VisualStyle } from './types';

/**
 * Enhances user prompts for better image generation results
 */
export function enhanceImagePrompt(
  prompt: string,
  style: VisualStyle = 'realistic'
): string {
  // Base prompt enhancement for better results
  let enhancedPrompt = prompt;
  
  // Add style-specific enhancements
  switch (style) {
    case 'realistic':
      enhancedPrompt = `${prompt}, professional photography, high resolution, detailed, 4K, realistic, high quality`;
      break;
    case 'artistic':
      enhancedPrompt = `${prompt}, digital art, artistic, vibrant colors, creative composition, stylized, trending on artstation`;
      break;
    case 'minimalist':
      enhancedPrompt = `${prompt}, minimalist design, clean lines, simple composition, elegant, white background, modern aesthetic`;
      break;
    case 'illustrated':
      enhancedPrompt = `${prompt}, digital illustration, vector art style, colorful, clean lines, professional illustration`;
      break;
    case 'cinematic':
      enhancedPrompt = `${prompt}, cinematic lighting, dramatic, film still, wide angle, detailed, atmospheric, professional photography`;
      break;
    default:
      enhancedPrompt = `${prompt}, high quality, detailed`;
  }
  
  return enhancedPrompt;
}

/**
 * Generates a negative prompt to avoid common image generation issues
 */
export function getNegativePrompt(style: VisualStyle = 'realistic'): string {
  // Base negative prompt for all styles
  const baseNegativePrompt = 'low quality, blurry, distorted, deformed, disfigured, watermark, text, bad anatomy';
  
  // Style-specific negative prompts
  switch (style) {
    case 'realistic':
      return `${baseNegativePrompt}, cartoon, illustration, painting, drawing, artificial, fake`;
    case 'artistic':
      return `${baseNegativePrompt}, photorealistic, boring, plain`;
    case 'minimalist':
      return `${baseNegativePrompt}, busy, cluttered, complex, detailed, ornate`;
    case 'illustrated':
      return `${baseNegativePrompt}, photorealistic, overly detailed, busy, cluttered`;
    case 'cinematic':
      return `${baseNegativePrompt}, flat lighting, amateur, unprofessional`;
    default:
      return baseNegativePrompt;
  }
}

/**
 * Optimizes image dimensions based on target platform
 */
export function getOptimalDimensions(
  platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook' = 'instagram'
): { width: number; height: number } {
  switch (platform) {
    case 'instagram':
      return { width: 1080, height: 1080 }; // Square format (1:1)
    case 'twitter':
      return { width: 1200, height: 675 }; // 16:9 landscape
    case 'linkedin':
      return { width: 1200, height: 627 }; // Recommended for LinkedIn
    case 'facebook':
      return { width: 1200, height: 630 }; // Recommended for Facebook
    default:
      return { width: 1024, height: 1024 }; // Default square
  }
} 