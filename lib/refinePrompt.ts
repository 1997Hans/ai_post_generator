import { getGeminiModel } from './gemini';
import { openai } from './openai';
import { isGeminiConfigured } from './gemini';
import { PostRequestInput } from './types';
import { extractJSONFromString } from './utils';

/**
 * Interface for refined prompt results
 */
export interface RefinedPromptResult {
  enhancedPrompt: string;
  suggestedTopics: string[];
  focusKeywords: string[];
  audienceInsight: string;
}

/**
 * Refines a user's basic prompt into a more detailed, optimized version
 * Works with either OpenAI or Google Gemini, depending on configuration
 */
export async function refinePrompt(input: PostRequestInput): Promise<RefinedPromptResult> {
  try {
    return isGeminiConfigured() 
      ? await refinePromptWithGemini(input)
      : await refinePromptWithOpenAI(input);
  } catch (error) {
    console.error('Error refining prompt:', error);
    // Return basic refined result if AI processing fails
    return {
      enhancedPrompt: input.topic,
      suggestedTopics: [],
      focusKeywords: [],
      audienceInsight: '',
    };
  }
}

/**
 * Refines a prompt using Google Gemini API
 */
async function refinePromptWithGemini(input: PostRequestInput): Promise<RefinedPromptResult> {
  const model = getGeminiModel();
  
  const promptText = createRefinementPrompt(input);
  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  
  return parseRefinementResponse(text, input);
}

/**
 * Refines a prompt using OpenAI API
 */
async function refinePromptWithOpenAI(input: PostRequestInput): Promise<RefinedPromptResult> {
  const promptText = createRefinementPrompt(input);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert in refining social media content ideas into detailed, engaging prompts.' },
      { role: 'user', content: promptText }
    ],
    temperature: 0.7,
  });
  
  const text = response.choices[0]?.message?.content || '';
  return parseRefinementResponse(text, input);
}

/**
 * Creates a prompt for AI to refine user input
 */
function createRefinementPrompt(input: PostRequestInput): string {
  const { topic, tone, platform, brandGuidelines } = input;
  
  return `Please refine this social media post idea: "${topic}"
  
Create a detailed and optimized version that would make a great ${platform || 'social media'} post.
${tone ? `The tone should be ${tone}.` : ''}
${brandGuidelines ? `Consider these brand guidelines: ${brandGuidelines}` : ''}

Please format your response as JSON with the following structure:
{
  "enhancedPrompt": "A detailed, refined version of the original prompt",
  "suggestedTopics": ["Related topic 1", "Related topic 2", "Related topic 3"],
  "focusKeywords": ["keyword1", "keyword2", "keyword3"],
  "audienceInsight": "Brief insight about the target audience for this content"
}`;
}

/**
 * Parses the AI response into structured data
 */
function parseRefinementResponse(text: string, input: PostRequestInput): RefinedPromptResult {
  try {
    // Extract JSON from response if it's not pure JSON
    const jsonData = extractJSONFromString(text);
    
    if (jsonData?.enhancedPrompt) {
      return {
        enhancedPrompt: jsonData.enhancedPrompt,
        suggestedTopics: jsonData.suggestedTopics || [],
        focusKeywords: jsonData.focusKeywords || [],
        audienceInsight: jsonData.audienceInsight || '',
      };
    }
  } catch (error) {
    console.error('Error parsing refinement response:', error);
  }
  
  // Fallback if parsing fails
  return {
    enhancedPrompt: input.topic,
    suggestedTopics: [],
    focusKeywords: [],
    audienceInsight: '',
  };
} 