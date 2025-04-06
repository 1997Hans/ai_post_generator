import { ToneType, VisualStyle } from './types';

/**
 * Generates a system prompt for the AI to create social media content
 */
export function getSystemPrompt(): string {
  return `You are an expert social media content creator who specializes in writing engaging, 
concise, and platform-optimized posts. Your writing is authentic, conversational, and tailored 
to the specified tone and audience. You understand character limits, formatting, and 
effective use of emojis and hashtags for maximum engagement.`;
}

/**
 * Interface for post generation request
 */
export interface PostPromptParams {
  topic: string;
  tone?: ToneType;
  visualStyle?: VisualStyle;
  platform?: 'instagram' | 'twitter' | 'linkedin' | 'facebook';
  brandGuidelines?: string;
  maxLength?: number;
}

/**
 * Generates the user prompt for post creation
 */
export function generatePostPrompt({
  topic,
  tone = 'friendly',
  platform = 'instagram',
  brandGuidelines = '',
  maxLength = 280,
  visualStyle = 'realistic',
}: PostPromptParams): string {
  let platformSpecifics = '';
  
  switch (platform) {
    case 'twitter':
      platformSpecifics = 'Keep it under 280 characters. Make it punchy and memorable.';
      break;
    case 'instagram':
      platformSpecifics = 'Create a captivating caption that works well with visual content. Include relevant emojis.';
      break;
    case 'linkedin':
      platformSpecifics = 'Keep it professional but engaging. Focus on industry insights and value.';
      break;
    case 'facebook':
      platformSpecifics = 'Aim for conversational engagement. Ask questions when appropriate.';
      break;
  }

  const toneGuidance = getToneGuidance(tone);
  const visualGuidance = `The post should pair well with ${visualStyle} style visuals.`;
  
  return `Create a compelling social media post about "${topic}" for ${platform}.
${platformSpecifics}
Tone: ${toneGuidance}
${brandGuidelines ? `Brand Guidelines: ${brandGuidelines}` : ''}
${visualGuidance}
Maximum length: ${maxLength} characters.

Please format your response as a JSON with these fields:
{
  "mainContent": "The primary post content",
  "caption": "A separate caption if appropriate for the platform",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "visualPrompt": "A detailed prompt to generate a matching visual"
}`;
}

/**
 * Gets specific guidance for different tone styles
 */
function getToneGuidance(tone: ToneType): string {
  switch (tone) {
    case 'professional':
      return 'Authoritative, knowledgeable, and business-appropriate.';
    case 'friendly':
      return 'Warm, conversational, and approachable.';
    case 'humorous':
      return 'Light-hearted, witty, and entertaining.';
    case 'inspirational':
      return 'Uplifting, motivational, and positive.';
    case 'informative':
      return 'Educational, clear, and fact-focused.';
    case 'casual':
      return 'Relaxed, informal, and authentic.';
    default:
      return 'Balanced and adaptable to context.';
  }
} 