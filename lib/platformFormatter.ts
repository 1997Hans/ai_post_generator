import { Platform } from './types';

/**
 * Platform-specific character limits
 */
export const PLATFORM_CHARACTER_LIMITS: Record<Platform, number> = {
  instagram: 2200,   // Instagram caption limit
  twitter: 280,      // Twitter/X tweet limit
  linkedin: 3000,    // LinkedIn post limit
  facebook: 63206    // Facebook very high limit, but keeping reasonable
};

/**
 * Platform-specific hashtag recommendations
 */
export const PLATFORM_HASHTAG_RECOMMENDATIONS: Record<Platform, { min: number; max: number; }> = {
  instagram: { min: 5, max: 30 },  // Instagram most hashtag-friendly
  twitter: { min: 1, max: 3 },     // Twitter/X limited, fewer recommended
  linkedin: { min: 3, max: 5 },    // LinkedIn professional, moderate
  facebook: { min: 2, max: 5 }     // Facebook, fewer recommended
};

/**
 * Platform-specific line break handling
 */
export const PLATFORM_LINE_BREAKS: Record<Platform, {
  paragraphBreak: string;
  lineBreak: string;
  maxConsecutiveBreaks: number;
}> = {
  instagram: {
    paragraphBreak: '\n\n',
    lineBreak: '\n',
    maxConsecutiveBreaks: 3
  },
  twitter: {
    paragraphBreak: '\n',
    lineBreak: ' ',
    maxConsecutiveBreaks: 2
  },
  linkedin: {
    paragraphBreak: '\n\n',
    lineBreak: '\n',
    maxConsecutiveBreaks: 2
  },
  facebook: {
    paragraphBreak: '\n\n',
    lineBreak: '\n',
    maxConsecutiveBreaks: 3
  }
};

/**
 * Interface for formatting options
 */
export interface FormattingOptions {
  truncateIfNeeded?: boolean;  // Truncate content to fit platform limit
  preserveHashtags?: boolean;  // Keep hashtags if truncation needed
  optimizeLineBreaks?: boolean; // Format line breaks per platform
  addEllipsis?: boolean;       // Add ellipsis if truncated
  separateHashtags?: boolean;  // Put hashtags at the end (Instagram style)
}

/**
 * Default formatting options
 */
const DEFAULT_FORMATTING_OPTIONS: FormattingOptions = {
  truncateIfNeeded: true,
  preserveHashtags: true,
  optimizeLineBreaks: true,
  addEllipsis: true,
  separateHashtags: true
};

/**
 * Format post content according to platform-specific requirements
 */
export function formatForPlatform(
  content: string,
  platform: Platform,
  hashtags: string[] = [],
  options: FormattingOptions = DEFAULT_FORMATTING_OPTIONS
): string {
  // Create working copies
  let formattedContent = content;
  const hashtagsToAdd = [...hashtags];
  
  // Apply line break formatting if requested
  if (options.optimizeLineBreaks) {
    formattedContent = optimizeLineBreaks(formattedContent, platform);
  }
  
  // Extract hashtags already in content
  const contentHashtags = extractHashtags(formattedContent);
  
  // Remove duplicates from hashtags to add
  for (const tag of contentHashtags) {
    const index = hashtagsToAdd.findIndex(t => t.toLowerCase() === tag.toLowerCase());
    if (index !== -1) {
      hashtagsToAdd.splice(index, 1);
    }
  }
  
  // Combine content with hashtags according to platform best practices
  if (options.separateHashtags && platform === 'instagram' && hashtagsToAdd.length > 0) {
    // For Instagram, add a double line break and then hashtags
    formattedContent = `${formattedContent}\n\n${hashtagsToAdd.join(' ')}`;
  } else if (hashtagsToAdd.length > 0) {
    // For other platforms, just append hashtags with a space
    formattedContent = `${formattedContent} ${hashtagsToAdd.join(' ')}`;
  }
  
  // Check if we need to truncate
  const limit = PLATFORM_CHARACTER_LIMITS[platform];
  if (options.truncateIfNeeded && formattedContent.length > limit) {
    // We need to truncate
    if (options.preserveHashtags && hashtagsToAdd.length > 0) {
      // Reserve space for hashtags and ellipsis if needed
      const hashtagsString = hashtagsToAdd.join(' ');
      const reservedSpace = hashtagsString.length + (options.addEllipsis ? 4 : 0) + 1; // +1 for space
      
      // Truncate main content
      let truncatedContent = content.substring(0, limit - reservedSpace).trim();
      
      // Add ellipsis if requested
      if (options.addEllipsis) {
        truncatedContent += '...';
      }
      
      // Format with hashtags
      formattedContent = options.separateHashtags && platform === 'instagram'
        ? `${truncatedContent}\n\n${hashtagsString}`
        : `${truncatedContent} ${hashtagsString}`;
    } else {
      // Simple truncation with ellipsis
      formattedContent = formattedContent.substring(0, limit - (options.addEllipsis ? 3 : 0));
      if (options.addEllipsis) {
        formattedContent += '...';
      }
    }
  }
  
  return formattedContent;
}

/**
 * Format line breaks according to platform best practices
 */
function optimizeLineBreaks(content: string, platform: Platform): string {
  const { paragraphBreak, lineBreak, maxConsecutiveBreaks } = PLATFORM_LINE_BREAKS[platform];
  
  // Replace multiple consecutive line breaks with platform-specific paragraph break
  let formatted = content.replace(/\n{3,}/g, paragraphBreak);
  
  // Replace double line breaks with platform paragraph break
  formatted = formatted.replace(/\n\n/g, paragraphBreak);
  
  // Replace single line breaks with platform line break
  formatted = formatted.replace(/\n/g, lineBreak);
  
  return formatted;
}

/**
 * Extracts hashtags from content
 */
function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  return content.match(hashtagRegex) || [];
}

/**
 * Suggests an optimal number of hashtags for a platform
 */
export function suggestHashtagCount(platform: Platform): number {
  const { min, max } = PLATFORM_HASHTAG_RECOMMENDATIONS[platform];
  // Return a number in the middle of the range
  return Math.floor((min + max) / 2);
}

/**
 * Checks if content exceeds platform character limit
 */
export function exceedsPlatformLimit(content: string, platform: Platform): boolean {
  return content.length > PLATFORM_CHARACTER_LIMITS[platform];
}

/**
 * Returns remaining character count for platform
 */
export function getRemainingCharacters(content: string, platform: Platform): number {
  return PLATFORM_CHARACTER_LIMITS[platform] - content.length;
} 