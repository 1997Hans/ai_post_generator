"use server";

import { OpenAIStream, StreamingTextResponse } from "ai";
import openai, { OpenAIError, isOpenAIConfigured } from "@/lib/openai";
import { PostRequestInput, PostOutput } from "@/lib/types";
import { generatePostPrompt, getSystemPrompt } from "@/lib/prompts";

/**
 * Server action to generate a social media post using OpenAI
 * Supports streaming responses with Vercel AI SDK
 */
export async function generatePost(
  input: PostRequestInput
): Promise<StreamingTextResponse> {
  try {
    // Validate API configuration
    if (!isOpenAIConfigured()) {
      throw new OpenAIError(
        "OpenAI API key not configured. Please check your environment variables.",
        401
      );
    }

    // Basic input validation
    if (!input.topic) {
      throw new OpenAIError("Topic is required for post generation", 400);
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

    // Call OpenAI with streaming
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // Transform the response into a streaming response using Vercel AI SDK
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Handle and transform errors
    if (error instanceof OpenAIError) {
      throw error;
    }

    console.error("Error generating post:", error);
    
    // Handle rate limiting errors
    if (error.statusCode === 429) {
      throw new OpenAIError("Rate limit exceeded. Please try again later.", 429);
    }
    
    // Handle other API errors
    if (error.statusCode) {
      throw new OpenAIError(
        `OpenAI API error: ${error.message}`,
        error.statusCode
      );
    }
    
    // Generic error fallback
    throw new OpenAIError(
      "An unexpected error occurred while generating your post.",
      500
    );
  }
}

/**
 * Non-streaming version of the post generator
 * Used in scenarios where streaming is not needed
 */
export async function generatePostNonStreaming(
  input: PostRequestInput
): Promise<PostOutput> {
  try {
    // Validate API configuration
    if (!isOpenAIConfigured()) {
      throw new OpenAIError(
        "OpenAI API key not configured. Please check your environment variables.",
        401
      );
    }

    // Basic input validation
    if (!input.topic) {
      throw new OpenAIError("Topic is required for post generation", 400);
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

    // Call OpenAI without streaming
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    });

    // Parse the JSON response
    try {
      const content = completion.choices[0]?.message?.content || "";
      const parsedContent = JSON.parse(content) as PostOutput;
      
      return {
        mainContent: parsedContent.mainContent || "",
        caption: parsedContent.caption || "",
        hashtags: parsedContent.hashtags || [],
        visualPrompt: parsedContent.visualPrompt || "",
      };
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new OpenAIError("Failed to parse AI response. Please try again.", 500);
    }
  } catch (error) {
    // Handle and transform errors (same as streaming version)
    if (error instanceof OpenAIError) {
      throw error;
    }

    console.error("Error generating post:", error);
    
    if (error.statusCode === 429) {
      throw new OpenAIError("Rate limit exceeded. Please try again later.", 429);
    }
    
    if (error.statusCode) {
      throw new OpenAIError(
        `OpenAI API error: ${error.message}`,
        error.statusCode
      );
    }
    
    throw new OpenAIError(
      "An unexpected error occurred while generating your post.",
      500
    );
  }
} 