import { OpenAIError } from "./openai";
import { ErrorResponse } from "./types";

/**
 * Formats an error into a standardized ErrorResponse object
 */
export function formatError(error: unknown): ErrorResponse {
  if (error instanceof OpenAIError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: 'openai_error',
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: error.name,
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'unknown_error',
    statusCode: 500,
  };
}

/**
 * Helper to handle async errors in React components
 */
export async function handleAsyncError<T>(
  promise: Promise<T>,
  errorHandler?: (error: ErrorResponse) => void
): Promise<{ data: T | null; error: ErrorResponse | null }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    const formattedError = formatError(error);
    
    if (errorHandler) {
      errorHandler(formattedError);
    }
    
    return { data: null, error: formattedError };
  }
}

/**
 * Determines if an error is related to API rate limiting
 */
export function isRateLimitError(error: ErrorResponse): boolean {
  return error.statusCode === 429 || error.message.toLowerCase().includes('rate limit');
}

/**
 * Determines if an error is related to authentication
 */
export function isAuthError(error: ErrorResponse): boolean {
  return error.statusCode === 401 || error.statusCode === 403;
} 