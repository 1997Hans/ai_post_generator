'use server'

import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { Post } from '@/lib/types'

interface GeneratePostOptions {
  title?: string;
  platform?: string;
  visualStyle?: string;
  tone?: string;
}

// Generate an example post with default content
export async function generateExamplePost(options: GeneratePostOptions = {}) {
  const {
    title = "Example AI-Generated Post",
    platform = "Instagram",
    visualStyle = "minimal",
    tone = "casual",
  } = options;
  
  const placeholderContent = `This is an example social media post for ${platform}. It demonstrates the AI's ability to generate engaging content with a ${tone} tone and ${visualStyle} visual style.`;
  
  const hashtags = "#example #ai #socialmedia";
  const prompt = "Create an example social media post";
  
  try {
    const postId = uuidv4();
    
    const { error } = await supabase.from('posts').insert({
      id: postId,
      content: title + ": " + placeholderContent,
      image_url: "/placeholder-image.svg", // Use placeholder image
      hashtags,
      prompt,
      refined_prompt: prompt,
      tone,
      visual_style: visualStyle,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      approved: null
    });

    if (error) {
      console.error("Error generating example post:", error);
      return { success: false, error: error.message };
    }
    
    revalidatePath('/dashboard');
    return { success: true, postId };
  } catch (error) {
    console.error("Failed to generate example post:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 