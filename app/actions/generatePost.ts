"use server";

import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { PostRequestInput, PostOutput } from '@/lib/types';
import { generatePostPrompt, getSystemPrompt } from '@/lib/prompts';
import { handleApiError } from '@/lib/error-handler';
import { generatePostImage } from './generateImage';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Generates a social media post using OpenAI API
 * Returns a streaming response for better UX
 */
export async function generatePost(input: PostRequestInput): Promise<Response> {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Please check your environment variables.");
    }

    // Basic input validation
    if (!input.topic) {
      throw new Error("Topic is required for post generation");
    }

    // Generate prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = generatePostPrompt({
      topic: input.topic,
      tone: input.tone,
      platform: input.platform,
      visualStyle: input.visualStyle,
      brandGuidelines: input.brandGuidelines,
      maxLength: input.maxLength,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      stream: true,
    });

    // Create a streaming response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: statusCode || 500,
        headers: { 'Content-Type': 'application/json' }
      }
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
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Please check your environment variables.");
    }

    // Basic input validation
    if (!input.topic) {
      throw new Error("Topic is required for post generation");
    }

    // Generate prompt
    const systemPrompt = getSystemPrompt();
    const userPrompt = generatePostPrompt({
      topic: input.topic,
      tone: input.tone,
      platform: input.platform,
      visualStyle: input.visualStyle,
      brandGuidelines: input.brandGuidelines,
      maxLength: input.maxLength,
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      stream: false,
    });

    // Extract and parse the content
    const content = response.choices[0]?.message.content || '';
    
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
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse AI response. Please try again.");
    }
  } catch (error) {
    const { message, statusCode } = handleApiError(error);
    throw new Error(message);
  }
} 