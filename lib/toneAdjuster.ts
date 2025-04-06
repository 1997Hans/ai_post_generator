import { getGeminiModel } from './gemini';
import { openai } from './openai';
import { isGeminiConfigured } from './gemini';
import { ToneType } from './types';
import { extractJSONFromString } from './utils';

/**
 * Interface for tone adjustment request
 */
export interface ToneAdjustmentRequest {
  content: string;
  currentTone?: ToneType;
  targetTone: ToneType;
  preserveHashtags?: boolean;
  preserveEmojis?: boolean;
}

/**
 * Interface for tone adjustment result
 */
export interface ToneAdjustmentResult {
  adjustedContent: string;
  tonalChanges: string[];
  preservedElements: {
    hashtags: string[];
    emojis: string[];
  };
}

/**
 * Tone characteristics for guidance
 */
export const TONE_CHARACTERISTICS: Record<ToneType, string> = {
  professional: 'formal, authoritative, knowledgeable, industry-appropriate, concise, evidence-based',
  friendly: 'warm, approachable, conversational, positive, inclusive, personal',
  humorous: 'witty, playful, clever, light-hearted, amusing, surprising',
  inspirational: 'uplifting, emotional, motivational, thought-provoking, encouraging, positive',
  informative: 'clear, educational, objective, factual, detailed, organized',
  casual: 'relaxed, colloquial, authentic, direct, simple, everyday language'
};

/**
 * Adjusts the tone of content
 */
export async function adjustTone(
  request: ToneAdjustmentRequest
): Promise<ToneAdjustmentResult> {
  try {
    return isGeminiConfigured()
      ? await adjustToneWithGemini(request)
      : await adjustToneWithOpenAI(request);
  } catch (error) {
    console.error('Error adjusting tone:', error);
    // Return original content if adjustment fails
    return {
      adjustedContent: request.content,
      tonalChanges: [],
      preservedElements: {
        hashtags: [],
        emojis: []
      }
    };
  }
}

/**
 * Adjusts tone using Google Gemini
 */
async function adjustToneWithGemini(request: ToneAdjustmentRequest): Promise<ToneAdjustmentResult> {
  const model = getGeminiModel();
  
  const promptText = createToneAdjustmentPrompt(request);
  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  
  return parseToneAdjustmentResponse(text, request.content);
}

/**
 * Adjusts tone using OpenAI
 */
async function adjustToneWithOpenAI(request: ToneAdjustmentRequest): Promise<ToneAdjustmentResult> {
  const promptText = createToneAdjustmentPrompt(request);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert copywriter specializing in tone adjustment for social media.' },
      { role: 'user', content: promptText }
    ],
    temperature: 0.7,
  });
  
  const text = response.choices[0]?.message?.content || '';
  return parseToneAdjustmentResponse(text, request.content);
}

/**
 * Creates a prompt for tone adjustment
 */
function createToneAdjustmentPrompt(request: ToneAdjustmentRequest): string {
  const { content, currentTone, targetTone, preserveHashtags = true, preserveEmojis = true } = request;
  
  return `Rewrite the following social media content to match a ${targetTone} tone:

"${content}"

${currentTone ? `Current tone: ${currentTone}` : ''}
Target tone: ${targetTone}

Tone characteristics to aim for: ${TONE_CHARACTERISTICS[targetTone]}

Requirements:
${preserveHashtags ? '- Preserve all hashtags (#)' : ''}
${preserveEmojis ? '- Preserve all emojis' : ''}
- Maintain the core message and meaning
- Keep approximately the same length

Please format your response as JSON with the following structure:
{
  "adjustedContent": "The rewritten content with adjusted tone",
  "tonalChanges": ["Description of change 1", "Description of change 2"],
  "preservedElements": {
    "hashtags": ["#hashtag1", "#hashtag2"],
    "emojis": ["😊", "🎉"]
  }
}`;
}

/**
 * Parses the tone adjustment response
 */
function parseToneAdjustmentResponse(text: string, originalContent: string): ToneAdjustmentResult {
  try {
    // Extract JSON from response if it's not pure JSON
    const jsonData = extractJSONFromString(text);
    
    if (jsonData?.adjustedContent) {
      return {
        adjustedContent: jsonData.adjustedContent,
        tonalChanges: jsonData.tonalChanges || [],
        preservedElements: {
          hashtags: jsonData.preservedElements?.hashtags || [],
          emojis: jsonData.preservedElements?.emojis || []
        }
      };
    }
  } catch (error) {
    console.error('Error parsing tone adjustment response:', error);
  }
  
  // Fallback if parsing fails
  return {
    adjustedContent: originalContent,
    tonalChanges: [],
    preservedElements: {
      hashtags: [],
      emojis: []
    }
  };
}

/**
 * Checks if a tone is suitable for a specific platform
 */
export function isToneSuitableForPlatform(tone: ToneType, platform: 'instagram' | 'twitter' | 'linkedin' | 'facebook'): boolean {
  // Platform-specific tone recommendations
  const platformToneRecommendations: Record<string, ToneType[]> = {
    instagram: ['friendly', 'casual', 'inspirational', 'humorous'],
    twitter: ['friendly', 'humorous', 'informative', 'casual'],
    linkedin: ['professional', 'informative', 'inspirational'],
    facebook: ['friendly', 'casual', 'informative', 'inspirational']
  };
  
  return platformToneRecommendations[platform].includes(tone);
}

/**
 * Suggests alternative tones for a platform
 */
export function suggestAlternativeTones(platform: string, currentTone: ToneType): ToneType[] {
  const allTones: ToneType[] = ['professional', 'friendly', 'humorous', 'inspirational', 'informative', 'casual'];
  
  // Platform-specific tone recommendations
  const platformToneRecommendations: Record<string, ToneType[]> = {
    instagram: ['friendly', 'casual', 'inspirational', 'humorous'],
    twitter: ['friendly', 'humorous', 'informative', 'casual'],
    linkedin: ['professional', 'informative', 'inspirational'],
    facebook: ['friendly', 'casual', 'informative', 'inspirational']
  };
  
  // Get recommended tones for platform
  const recommendedTones = platformToneRecommendations[platform] || allTones;
  
  // Filter out current tone
  return recommendedTones.filter(tone => tone !== currentTone);
} 