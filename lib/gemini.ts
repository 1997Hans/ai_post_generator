import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI client with API key from environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
console.log('Gemini API Key available:', !!apiKey);

const geminiClient = new GoogleGenerativeAI(apiKey);

// Get the Gemini Pro model
export function getGeminiModel() {
  if (!apiKey) {
    console.error('No Gemini API key found in environment variables');
    throw new GeminiError('Gemini API key is not configured', 401);
  }
  
  try {
    return geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });
  } catch (error) {
    console.error('Error creating Gemini model:', error);
    throw new GeminiError('Failed to initialize Gemini model: ' + (error.message || 'Unknown error'), 500);
  }
}

// Separate function to check if Gemini API key is configured
export function isGeminiConfigured(): boolean {
  const configured = !!process.env.GEMINI_API_KEY;
  console.log('Gemini API configured:', configured);
  return configured;
}

// Custom error class for Gemini API errors
export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GeminiError';
  }
} 