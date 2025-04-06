import OpenAI from 'openai';

// Initialize the OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Export the singleton instance to be used throughout the app
export default openai;

// Separate function to check if OpenAI API key is configured
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

// Custom error class for OpenAI API errors
export class OpenAIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'OpenAIError';
  }
} 