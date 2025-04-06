import Replicate from 'replicate';

// Initialize the Replicate client with API token from environment variable
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

// Default model IDs for different image generation styles
export const REPLICATE_MODELS = {
  // Realistic photo generation
  REALISTIC: 'stability-ai/sdxl:7be0f12c54a93f0a98eed733652f522884baa2b7e276ef38c3c96b40a4dc72a7',
  // Artistic stylized images
  ARTISTIC: 'stability-ai/stable-diffusion:ac732df83cea7a18f95fb8d1970148dcb4bc796e81ea12d9d7876695f6450e58',
  // Minimalist design
  MINIMALIST: 'prompthero/openjourney:9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb',
};

export interface ImageGenerationParams {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'minimalist';
  width?: number;
  height?: number;
  negativePrompt?: string;
  seed?: number;
}

/**
 * Generate an image using Replicate's API based on the provided parameters
 */
export async function generateImage({
  prompt,
  style = 'realistic',
  width = 1024,
  height = 1024,
  negativePrompt = 'low quality, blurry, distorted, deformed, disfigured, watermark, text, bad anatomy',
  seed,
}: ImageGenerationParams): Promise<string | null> {
  try {
    // Select model based on style
    const modelId = style === 'realistic' 
      ? REPLICATE_MODELS.REALISTIC 
      : style === 'artistic' 
        ? REPLICATE_MODELS.ARTISTIC
        : REPLICATE_MODELS.MINIMALIST;

    // Call Replicate API
    const output = await replicate.run(modelId, {
      input: {
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        num_outputs: 1,
        scheduler: 'K_EULER',
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: seed || Math.floor(Math.random() * 1000000),
      },
    });

    // The output is typically an array with URL(s) to generated image(s)
    if (Array.isArray(output) && output.length > 0) {
      return output[0] as string;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating image with Replicate:', error);
    return null;
  }
}

export default replicate; 