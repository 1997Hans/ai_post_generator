import { getGeminiModel } from './gemini';
import { openai } from './openai';
import { isGeminiConfigured } from './gemini';
import { Platform, ToneType } from './types';
import { extractJSONFromString } from './utils';

/**
 * Types of content improvements
 */
export type ImprovementCategory = 
  | 'engagement' 
  | 'clarity' 
  | 'brevity' 
  | 'emotional_appeal'
  | 'visual_compatibility'
  | 'call_to_action'
  | 'tone_consistency';

/**
 * Interface for improvement suggestion
 */
export interface ImprovementSuggestion {
  category: ImprovementCategory;
  description: string;
  exampleRevision: string;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Interface for content analysis result
 */
export interface ContentAnalysisResult {
  score: number; // 0-100 engagement score
  strengths: string[];
  improvements: ImprovementSuggestion[];
  keyMetrics: {
    readability: number; // 0-100
    emotionalImpact: number; // 0-100
    clarity: number; // 0-100
    engagement: number; // 0-100
  };
}

/**
 * Interface for improvement request
 */
export interface ContentImprovementRequest {
  content: string;
  platform: Platform;
  tone?: ToneType;
  visualStyle?: string;
  targetAudience?: string;
  improveCategories?: ImprovementCategory[];
}

/**
 * Analyzes content and provides improvement suggestions
 */
export async function analyzeContent(
  request: ContentImprovementRequest
): Promise<ContentAnalysisResult> {
  try {
    return isGeminiConfigured()
      ? await analyzeContentWithGemini(request)
      : await analyzeContentWithOpenAI(request);
  } catch (error) {
    console.error('Error analyzing content:', error);
    // Return basic analysis if AI processing fails
    return {
      score: 70, // Default mediocre score
      strengths: ['Content is complete'],
      improvements: [],
      keyMetrics: {
        readability: 70,
        emotionalImpact: 70,
        clarity: 70,
        engagement: 70
      }
    };
  }
}

/**
 * Analyzes content using Google Gemini
 */
async function analyzeContentWithGemini(
  request: ContentImprovementRequest
): Promise<ContentAnalysisResult> {
  const model = getGeminiModel();
  
  const promptText = createContentAnalysisPrompt(request);
  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  
  return parseContentAnalysisResponse(text);
}

/**
 * Analyzes content using OpenAI
 */
async function analyzeContentWithOpenAI(
  request: ContentImprovementRequest
): Promise<ContentAnalysisResult> {
  const promptText = createContentAnalysisPrompt(request);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert social media content analyst.' },
      { role: 'user', content: promptText }
    ],
    temperature: 0.5,
  });
  
  const text = response.choices[0]?.message?.content || '';
  return parseContentAnalysisResponse(text);
}

/**
 * Creates a prompt for content analysis
 */
function createContentAnalysisPrompt(request: ContentImprovementRequest): string {
  const { content, platform, tone, visualStyle, targetAudience, improveCategories } = request;
  
  let focusAreas = '';
  if (improveCategories && improveCategories.length > 0) {
    focusAreas = `\nFocus especially on these areas: ${improveCategories.join(', ')}.`;
  }
  
  return `Analyze this ${platform} post and provide detailed improvement suggestions:

"${content}"

Context:
${tone ? `- Intended tone: ${tone}` : ''}
${visualStyle ? `- Visual style: ${visualStyle}` : ''}
${targetAudience ? `- Target audience: ${targetAudience}` : ''}
- Platform: ${platform}${focusAreas}

For each suggestion:
1. Categorize it (engagement, clarity, brevity, emotional_appeal, visual_compatibility, call_to_action, tone_consistency)
2. Explain what could be improved
3. Provide an example revision
4. Rate the impact of the change (high/medium/low)

Also include:
- Overall engagement score (0-100)
- Key strengths of the post
- Metrics for readability, emotional impact, clarity, and engagement (0-100)

Please format your response as JSON with the following structure:
{
  "score": 85,
  "strengths": ["Clear message", "Good use of emojis", "..."],
  "improvements": [
    {
      "category": "engagement",
      "description": "Add a question to encourage responses",
      "exampleRevision": "Example of improved text here",
      "impact": "high"
    },
    ...
  ],
  "keyMetrics": {
    "readability": 80,
    "emotionalImpact": 70,
    "clarity": 90,
    "engagement": 75
  }
}`;
}

/**
 * Parses the content analysis response
 */
function parseContentAnalysisResponse(text: string): ContentAnalysisResult {
  try {
    // Extract JSON from response if it's not pure JSON
    const jsonData = extractJSONFromString(text);
    
    if (jsonData?.score && jsonData?.improvements) {
      return {
        score: jsonData.score,
        strengths: jsonData.strengths || [],
        improvements: jsonData.improvements || [],
        keyMetrics: {
          readability: jsonData.keyMetrics?.readability || 70,
          emotionalImpact: jsonData.keyMetrics?.emotionalImpact || 70,
          clarity: jsonData.keyMetrics?.clarity || 70,
          engagement: jsonData.keyMetrics?.engagement || 70
        }
      };
    }
  } catch (error) {
    console.error('Error parsing content analysis response:', error);
  }
  
  // Fallback if parsing fails
  return {
    score: 70, // Default mediocre score
    strengths: ['Content is complete'],
    improvements: [],
    keyMetrics: {
      readability: 70,
      emotionalImpact: 70,
      clarity: 70,
      engagement: 70
    }
  };
}

/**
 * Applies a specific improvement suggestion to content
 */
export async function applyImprovement(
  content: string,
  improvement: ImprovementSuggestion,
  platform: Platform,
  tone?: ToneType
): Promise<string> {
  try {
    // If the improvement already includes an example revision, we can just return that
    if (improvement.exampleRevision && improvement.exampleRevision.length > 10) {
      return improvement.exampleRevision;
    }
    
    // Otherwise, use AI to apply the improvement
    return isGeminiConfigured()
      ? await applyImprovementWithGemini(content, improvement, platform, tone)
      : await applyImprovementWithOpenAI(content, improvement, platform, tone);
  } catch (error) {
    console.error('Error applying improvement:', error);
    // Return original content if improvement fails
    return content;
  }
}

/**
 * Applies improvement with Google Gemini
 */
async function applyImprovementWithGemini(
  content: string,
  improvement: ImprovementSuggestion,
  platform: Platform,
  tone?: ToneType
): Promise<string> {
  const model = getGeminiModel();
  
  const promptText = createImprovementApplicationPrompt(content, improvement, platform, tone);
  const result = await model.generateContent(promptText);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonData = extractJSONFromString(text);
    if (jsonData?.revisedContent) {
      return jsonData.revisedContent;
    }
  } catch (e) {
    // If JSON parsing fails, return the raw text
    return text.trim();
  }
  
  return text.trim();
}

/**
 * Applies improvement with OpenAI
 */
async function applyImprovementWithOpenAI(
  content: string,
  improvement: ImprovementSuggestion,
  platform: Platform,
  tone?: ToneType
): Promise<string> {
  const promptText = createImprovementApplicationPrompt(content, improvement, platform, tone);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an expert social media content editor.' },
      { role: 'user', content: promptText }
    ],
    temperature: 0.7,
  });
  
  const text = response.choices[0]?.message?.content || '';
  
  try {
    const jsonData = extractJSONFromString(text);
    if (jsonData?.revisedContent) {
      return jsonData.revisedContent;
    }
  } catch (e) {
    // If JSON parsing fails, return the raw text
    return text.trim();
  }
  
  return text.trim();
}

/**
 * Creates a prompt for applying an improvement
 */
function createImprovementApplicationPrompt(
  content: string,
  improvement: ImprovementSuggestion,
  platform: Platform,
  tone?: ToneType
): string {
  return `Revise this ${platform} post by applying a specific improvement:

Original content: "${content}"

Improvement to make:
- Category: ${improvement.category}
- Description: ${improvement.description}
${tone ? `- Maintain the ${tone} tone` : ''}

Please rewrite the entire post with this improvement applied. Keep hashtags, emojis, and overall message intact.

Please return your response in JSON format:
{
  "revisedContent": "The improved content here"
}`;
} 