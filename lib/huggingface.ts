import { HfInference } from '@huggingface/inference';
import { VisualStyle } from './types';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Initialize Hugging Face client with API token from environment variable
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Model mappings for different visual styles
export const HF_MODELS = {
  // Realistic photo generation
  REALISTIC: 'stabilityai/stable-diffusion-xl-base-1.0',
  // Artistic stylized images
  ARTISTIC: 'prompthero/openjourney-v4',
  // Minimalist design
  MINIMALIST: 'runwayml/stable-diffusion-v1-5',
  // Illustrated style
  ILLUSTRATED: 'hakurei/waifu-diffusion',
  // Cinematic style
  CINEMATIC: 'stabilityai/stable-diffusion-xl-base-1.0',
};

export interface ImageGenerationParams {
  prompt: string;
  style?: VisualStyle;
  negativePrompt?: string;
  seed?: number;
}

/**
 * Generate an image using Hugging Face's API based on the provided parameters
 * Returns a URL to the generated image or null if generation failed
 */
export async function generateImage({
  prompt,
  style = 'realistic',
  negativePrompt = 'low quality, blurry, distorted, deformed, disfigured, watermark, text, bad anatomy',
  seed,
}: ImageGenerationParams): Promise<string | null> {
  try {
    // Select model based on style
    const model = getModelForStyle(style);
    
    // Call Hugging Face API for text-to-image generation
    const result = await hf.textToImage({
      model: model,
      inputs: prompt,
      parameters: {
        negative_prompt: negativePrompt,
        seed: seed || Math.floor(Math.random() * 1000000),
        guidance_scale: 7.5,
        num_inference_steps: 25,
      },
    });
    
    // Check if we're in development or production
    const isDev = process.env.NODE_ENV === 'development';
    
    if (result) {
      // Get image bytes
      const imageBytes = await result.arrayBuffer();
      
      if (isDev) {
        // For development: Convert blob to base64 and return as data URL (works well locally)
        const base64 = Buffer.from(imageBytes).toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        return dataUrl;
      } else {
        // For production: Save image to file system and return URL
        const uniqueId = uuidv4();
        const fileName = `${uniqueId}.jpg`;
        const publicDir = path.join(process.cwd(), 'public');
        const uploadsDir = path.join(publicDir, 'uploads');
        
        // Ensure uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const filePath = path.join(uploadsDir, fileName);
        
        // Save file
        await writeFile(filePath, Buffer.from(imageBytes));
        
        // Return URL path
        return `/uploads/${fileName}`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error generating image with Hugging Face:', error);
    return null;
  }
}

/**
 * Helper function to get the appropriate model for the requested style
 */
function getModelForStyle(style: VisualStyle): string {
  switch (style) {
    case 'realistic':
      return HF_MODELS.REALISTIC;
    case 'artistic':
      return HF_MODELS.ARTISTIC;
    case 'minimalist':
      return HF_MODELS.MINIMALIST;
    case 'illustrated':
      return HF_MODELS.ILLUSTRATED;
    case 'cinematic':
      return HF_MODELS.CINEMATIC;
    default:
      return HF_MODELS.REALISTIC;
  }
}

export default hf; 