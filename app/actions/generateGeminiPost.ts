"use server";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiModel, GeminiError, isGeminiConfigured } from '@/lib/gemini';
import { PostRequestInput, PostOutput } from '@/lib/types';
import { generatePostPrompt, getSystemPrompt } from '@/lib/prompts';
import { generatePostImage } from './generateImage';

/**
 * Server action to generate a social media post using Google Gemini
 * Supports streaming responses with Vercel AI SDK
 */
export async function generateGeminiPost(
  input: PostRequestInput
): Promise<Response> {
  console.log('generateGeminiPost called with:', input);
  
  try {
    // Validate API configuration
    if (!isGeminiConfigured()) {
      console.error('Gemini API not configured');
      throw new GeminiError(
        "Gemini API key not configured. Please check your environment variables.",
        401
      );
    }

    // Basic input validation
    if (!input.topic) {
      console.error('Missing topic in input');
      throw new GeminiError("Topic is required for post generation", 400);
    }

    // Generate formatted prompt for the AI
    const userPrompt = generatePostPrompt({
      topic: input.topic,
      tone: input.tone,
      platform: input.platform,
      visualStyle: input.visualStyle,
      brandGuidelines: input.brandGuidelines,
      maxLength: input.maxLength,
    });
    
    console.log('Generated prompt:', userPrompt);

    // Get the Gemini model
    const model = getGeminiModel();
    console.log('Gemini model initialized successfully');

    // For now, use a non-streaming approach to simplify debugging
    try {
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      console.log('Generated content:', text.substring(0, 100) + '...');
      
      // Return a simple response for now
      return new Response(text, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (genError) {
      console.error('Generation error:', genError);
      throw new GeminiError(
        `Error during content generation: ${genError.message}`,
        500
      );
    }
  } catch (error) {
    // Handle and transform errors
    console.error('Error in generateGeminiPost:', error);
    
    if (error instanceof GeminiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode || 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Generic error fallback
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred while generating your post."
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * Non-streaming version of the post generator
 * Used in scenarios where streaming is not needed
 */
export async function generateGeminiPostNonStreaming(
  input: PostRequestInput
): Promise<PostOutput> {
  try {
    // Validate API configuration
    if (!isGeminiConfigured()) {
      throw new GeminiError(
        "Gemini API key not configured. Please check your environment variables.",
        401
      );
    }

    // Basic input validation
    if (!input.topic) {
      throw new GeminiError("Topic is required for post generation", 400);
    }

    // Generate formatted prompt for the AI
    const userPrompt = generatePostPrompt({
      topic: input.topic,
      tone: input.tone,
      platform: input.platform,
      visualStyle: input.visualStyle,
      brandGuidelines: input.brandGuidelines,
      maxLength: input.maxLength,
    });

    // Get the Gemini model
    const model = getGeminiModel();

    // Create a chat session
    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: getSystemPrompt() }] },
        { role: 'model', parts: [{ text: 'I understand. I will act as an expert social media content creator.' }] },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    // Send the message and get response
    const result = await chat.sendMessage(userPrompt);
    const content = result.response.text();

    // Parse the JSON response
    try {
      const parsedContent = JSON.parse(content) as PostOutput;
      
      // Generate image based on the visual prompt if available
      let imageUrl = null;
      if (parsedContent.visualPrompt) {
        imageUrl = await generatePostImage(
          parsedContent.mainContent,
          parsedContent.visualPrompt,
          input.visualStyle,
          input.platform
        );
      }
      
      return {
        mainContent: parsedContent.mainContent || "",
        caption: parsedContent.caption || "",
        hashtags: parsedContent.hashtags || [],
        visualPrompt: parsedContent.visualPrompt || "",
        imageUrl: imageUrl || undefined,
      };
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      throw new GeminiError("Failed to parse AI response. Please try again.", 500);
    }
  } catch (error) {
    // Handle and transform errors
    if (error instanceof GeminiError) {
      throw error;
    }

    console.error("Error generating post with Gemini:", error);
    
    throw new GeminiError(
      "An unexpected error occurred while generating your post.",
      500
    );
  }
} 