'use server';

import { v4 as uuidv4 } from 'uuid';
import { Post, PostOutput, PostRequestInput } from '@/lib/types';

export async function saveGeneratedPost(
  request: PostRequestInput,
  result: PostOutput
): Promise<Post> {
  // Make sure the result has hashtags as an array
  const hashtags = Array.isArray(result.hashtags) 
    ? result.hashtags 
    : typeof result.hashtags === 'string'
      ? result.hashtags.split(/[,\s]+/).filter(tag => tag.trim() !== '')
      : [];
  
  // Create a timestamp for created/updated dates
  const timestamp = new Date().toISOString();
  
  // Construct the full post with all required fields
  const post: Post = {
    id: result.id || uuidv4(),
    prompt: request.prompt || 'Untitled Post',
    refinedPrompt: request.prompt, // In a real app, this would be the refined prompt
    content: result.content || '',
    caption: result.caption || '',
    hashtags: hashtags,
    imageUrl: result.imageUrl || '',
    tone: request.tone || '',
    visualStyle: request.visualStyle || '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  
  // In a real app with server components, we would save to a database here
  // For our client-side implementation, we'll return the post to be saved in localStorage
  
  return post;
} 