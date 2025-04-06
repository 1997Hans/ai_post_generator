import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI client with API key from environment variable
const geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Get the Gemini Pro model
export function getGeminiModel() {
  return geminiClient.getGenerativeModel({
    model: 'gemini-1.5-pro',
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
}

// Separate function to check if Gemini API key is configured
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// Custom error class for Gemini API errors
export class GeminiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'GeminiError';
  }
} 