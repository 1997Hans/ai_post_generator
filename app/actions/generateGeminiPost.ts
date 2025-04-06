"use server";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiModel, GeminiError, isGeminiConfigured } from '@/lib/gemini';
import { PostRequestInput, PostOutput } from '@/lib/types';
import { generatePostPrompt, getSystemPrompt } from '@/lib/prompts';
import { StreamingTextResponse, Message } from 'ai';

/**
 * Server action to generate a social media post using Google Gemini
 * Supports streaming responses with Vercel AI SDK
 */
export async function generateGeminiPost(
  input: PostRequestInput
): Promise<Response> {
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

    // Create a streaming chat session
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

    // Send the message and get streaming response
    const result = await chat.sendMessageStream(userPrompt);

    // Create a Response with ReadableStream for streaming
    const stream = new ReadableStream({
      async start(controller) {
        // Process the stream
        const textDecoder = new TextDecoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    // Return streaming response
    return new Response(stream);
  } catch (error) {
    // Handle and transform errors
    if (error instanceof GeminiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: error.statusCode || 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.error("Error generating post with Gemini:", error);
    
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
      
      return {
        mainContent: parsedContent.mainContent || "",
        caption: parsedContent.caption || "",
        hashtags: parsedContent.hashtags || [],
        visualPrompt: parsedContent.visualPrompt || "",
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