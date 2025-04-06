import { getGeminiModel } from './gemini';
import { openai } from './openai';
import { isGeminiConfigured } from './gemini';
import { PostRequestInput, Platform } from './types';
import { extractJSONFromString } from './utils';

/**
 * Hashtag categories for organization
 */
export type HashtagCategory = 
  | 'trending' 
  | 'industry' 
  | 'branded' 
  | 'campaign' 
  | 'location'
  | 'product'
  | 'community'
  | 'general';

/**
 * Structure for categorized hashtags
 */
export interface CategorizedHashtags {
  trending: string[];
  industry: string[];
  branded: string[];
  campaign: string[];
  location: string[];
  product: string[];
  community: string[];
  general: string[];
}

/**
 * Interface for hashtag generation results
 */
export interface HashtagGenerationResult {
  all: string[];        // All hashtags combined
  categorized: CategorizedHashtags; 
  recommended: string[]; // Top recommended hashtags
}

/**
 * Maximum hashtag recommendations by platform
 */
const PLATFORM_HASHTAG_LIMITS: Record<Platform, number> = {
  instagram: 30,
  twitter: 5,  // Now X, but less hashtags recommended
  linkedin: 3,
  facebook: 5
};

/**
 * Generate and categorize hashtags based on the post content and platform
 */
export async function generateHashtags(
  topic: string, 
  platform: Platform = 'instagram',
  existingContent?: string
): Promise<HashtagGenerationResult> {
  try {
    return isGeminiConfigured() 
      ? await generateHashtagsWithGemini(topic, platform, existingContent)
      : await generateHashtagsWithOpenAI(topic, platform, existingContent);
  } catch (error) {
    console.error('Error generating hashtags:', error);
    // Return basic hashtags if AI processing fails
    return {
      all: [`#${topic.replace(/\s+/g, '')}`, '#content'],
      categorized: createEmptyCategorizedHashtags(),
      recommended: [`#${topic.replace(/\s+/g, '')}`]
    };
  }
}

/**
 * Create empty categorized hashtags structure
 */
function createEmptyCategorizedHashtags(): CategorizedHashtags {
  return {
    trending: [],
    industry: [],
    branded: [],
    campaign: [],
    location: [],
    product: [],
    community: [],
    general: []
  };
}

/**
 * Generates hashtags using Google Gemini
 */
async function generateHashtagsWithGemini(
  topic: string,
  platform: Platform = 'instagram',
  existingContent?: string
): Promise<HashtagGenerationResult> {
  const model = getGeminiModel();
  
  const promptText = createHashtagPrompt(topic, platform, existingContent);
  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  
  return parseHashtagResponse(text, platform);
}

/**
 * Generates hashtags using OpenAI
 */
async function generateHashtagsWithOpenAI(
  topic: string,
  platform: Platform = 'instagram',
  existingContent?: string
): Promise<HashtagGenerationResult> {
  const promptText = createHashtagPrompt(topic, platform, existingContent);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert in social media hashtag strategy and optimization.' },
      { role: 'user', content: promptText }
    ],
    temperature: 0.7,
  });
  
  const text = response.choices[0]?.message?.content || '';
  return parseHashtagResponse(text, platform);
}

/**
 * Creates a prompt for AI to generate hashtags
 */
function createHashtagPrompt(
  topic: string,
  platform: Platform = 'instagram',
  existingContent?: string
): string {
  return `Generate relevant, effective hashtags for a ${platform} post about: "${topic}"
  
${existingContent ? `The post content is: "${existingContent}"` : ''}

The hashtags should:
- Be relevant to the topic
- Include a mix of popular and niche hashtags
- Follow ${platform} best practices
- Be organized by category
- Include ${PLATFORM_HASHTAG_LIMITS[platform]} hashtags total

Please format your response as JSON with the following structure:
{
  "categorized": {
    "trending": ["#trending1", "#trending2"],
    "industry": ["#industry1", "#industry2"],
    "branded": ["#brand1", "#brand2"],
    "campaign": ["#campaign1", "#campaign2"],
    "location": ["#location1", "#location2"],
    "product": ["#product1", "#product2"],
    "community": ["#community1", "#community2"],
    "general": ["#general1", "#general2"]
  },
  "recommended": ["#top1", "#top2", "#top3", "#top4", "#top5"]
}

Notes:
- Not all categories need to have hashtags
- The "recommended" field should contain the best hashtags to use (max ${PLATFORM_HASHTAG_LIMITS[platform]})
- All hashtags should start with #`;
}

/**
 * Parses the AI response into structured hashtag data
 */
function parseHashtagResponse(text: string, platform: Platform): HashtagGenerationResult {
  try {
    // Extract JSON from response if it's not pure JSON
    const jsonData = extractJSONFromString(text);
    
    if (jsonData?.categorized) {
      // Combine all hashtags into a single array
      const allHashtags = Object.values(jsonData.categorized)
        .flat()
        .filter(Boolean);
      
      // Use recommended hashtags if available, otherwise take from all hashtags
      const recommended = jsonData.recommended || 
        allHashtags.slice(0, PLATFORM_HASHTAG_LIMITS[platform]);
      
      // Ensure every hashtag starts with #
      const formatHashtag = (tag: string) => 
        tag.startsWith('#') ? tag : `#${tag}`;
      
      // Format and return the result
      const categorized: CategorizedHashtags = {
        trending: (jsonData.categorized.trending || []).map(formatHashtag),
        industry: (jsonData.categorized.industry || []).map(formatHashtag),
        branded: (jsonData.categorized.branded || []).map(formatHashtag),
        campaign: (jsonData.categorized.campaign || []).map(formatHashtag),
        location: (jsonData.categorized.location || []).map(formatHashtag),
        product: (jsonData.categorized.product || []).map(formatHashtag),
        community: (jsonData.categorized.community || []).map(formatHashtag),
        general: (jsonData.categorized.general || []).map(formatHashtag),
      };
      
      return {
        all: allHashtags.map(formatHashtag),
        categorized,
        recommended: recommended.map(formatHashtag),
      };
    }
  } catch (error) {
    console.error('Error parsing hashtag response:', error);
  }
  
  // Fallback if parsing fails
  const defaultTag = `#${topic.replace(/\s+/g, '')}`;
  const empty = createEmptyCategorizedHashtags();
  empty.general = [defaultTag];
  
  return {
    all: [defaultTag],
    categorized: empty,
    recommended: [defaultTag],
  };
} 