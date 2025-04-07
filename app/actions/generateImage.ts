"use server";

import { generateImage as hfGenerateImage } from "../../lib/huggingface";
import { enhanceImagePrompt, getNegativePrompt } from "../../lib/image-prompts";
import { ImageGenerationResult, ImageRequestInput, VisualStyle, Platform } from "../../lib/types";
import { handleApiError } from "../../lib/error-handler";

/**
 * Server action to generate an image using Hugging Face API
 * Accepts a prompt and optional parameters, enhances the prompt,
 * and returns the generated image URL
 */
export async function generateImage({
  prompt,
  visualStyle = "realistic" as VisualStyle,
  platform = "instagram" as Platform,
  width,
  height,
  seed,
}: ImageRequestInput): Promise<ImageGenerationResult> {
  try {
    // Validate input
    if (!prompt || prompt.trim().length === 0) {
      return {
        imageUrl: null,
        prompt: "",
        visualStyle,
        error: "Prompt cannot be empty",
      };
    }

    // Enhance the prompt based on visual style
    const enhancedPrompt = enhanceImagePrompt(prompt, visualStyle);
    
    // Get negative prompt for better results
    const negativePrompt = getNegativePrompt(visualStyle);
    
    // Generate the image (note: Hugging Face API doesn't support width/height directly)
    // We'll use only the prompt, style, and negative prompt
    const imageUrl = await hfGenerateImage({
      prompt: enhancedPrompt,
      style: visualStyle,
      negativePrompt,
      seed,
    });

    // Return the result
    return {
      imageUrl,
      prompt: enhancedPrompt,
      visualStyle,
      error: imageUrl ? undefined : "Failed to generate image",
    };
  } catch (error) {
    // Handle and log the error
    const errorResponse = handleApiError(error, "Image generation failed");
    
    return {
      imageUrl: null,
      prompt,
      visualStyle,
      error: errorResponse.message,
    };
  }
}

/**
 * Generate an image based on the post content and visual prompt
 */
export async function generatePostImage(
  postContent: string,
  visualPrompt: string,
  visualStyle: VisualStyle = "realistic",
  platform: Platform = "instagram"
): Promise<string | null> {
  try {
    // Combine post content and visual prompt for better context
    const combinedPrompt = `${visualPrompt} ${postContent.substring(0, 100)}`;
    
    // Generate the image
    const result = await generateImage({
      prompt: combinedPrompt,
      visualStyle,
      platform,
    });
    
    return result.imageUrl;
  } catch (error) {
    console.error("Error generating post image:", error);
    return null;
  }
} 