'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { SavePostValues } from '@/lib/validations/post'
import { v4 as uuidv4 } from 'uuid'
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { Post } from '@/lib/types'

export async function savePost(data: SavePostValues) {
  try {
    const postId = data.postId || uuidv4()
    const timestamp = new Date().toISOString()
    
    const { error } = await supabase.from('posts').upsert({
      id: postId,
      content: data.content,
      image_url: data.imageUrl,
      hashtags: data.hashtags,
      prompt: data.prompt,
      refined_prompt: data.refinedPrompt || null,
      tone: data.tone,
      visual_style: data.visualStyle,
      updated_at: timestamp,
      created_at: timestamp,
      approved: false
    })

    if (error) throw new Error(error.message)
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    return { success: true, postId }
  } catch (error) {
    console.error('Error saving post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

// Cache the posts fetch to avoid unnecessary database hits
export const getAllPosts = unstable_cache(
  async (): Promise<Post[]> => {
    try {
      // Use supabase for now to match existing implementation
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      
      return data || []
    } catch (error) {
      console.error("Database error:", error);
      return [];
    }
  },
  ['posts-list'],
  { tags: ['posts'], revalidate: 60 } // Cache for 60 seconds
);

// Function to get posts with optional search query
export async function getPosts(query?: string): Promise<Post[]> {
  try {
    if (!query) {
      return getAllPosts();
    }
    
    // If we have a search query, we need to filter the posts
    // Use supabase to match existing implementation
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .or(`content.ilike.%${query}%,prompt.ilike.%${query}%,hashtags.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    
    return data || []
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

export async function getPost(postId: string) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single()
    
    if (error) throw new Error(error.message)
    
    return { post: data, success: true }
  } catch (error) {
    console.error('Error getting post:', error)
    return { 
      success: false, 
      post: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function approvePost(postId: string) {
  try {
    // Get current state to toggle
    const { data: post, error: getError } = await supabase
      .from('posts')
      .select('approved')
      .eq('id', postId)
      .single()
    
    if (getError) throw new Error(getError.message)
    
    // Toggle approved state
    const { error } = await supabase
      .from('posts')
      .update({ approved: !post?.approved })
      .eq('id', postId)
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/${postId}`)
    
    return { success: true }
  } catch (error) {
    console.error('Error approving post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function rejectPost(postId: string, feedbackText: string) {
  try {
    const feedbackId = uuidv4()
    
    // Add feedback
    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        id: feedbackId,
        post_id: postId,
        feedback_text: feedbackText
      })
    
    if (feedbackError) throw new Error(feedbackError.message)
    
    // Update the post to mark as not approved
    const { error: updateError } = await supabase
      .from('posts')
      .update({ 
        approved: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
    
    if (updateError) throw new Error(updateError.message)
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error rejecting post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function deletePost(postId: string) {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function saveFeedback(postId: string, rating: number, comment: string = '') {
  try {
    const feedbackId = uuidv4()
    const timestamp = new Date().toISOString()
    
    // Add feedback to database
    const { error } = await supabase
      .from('feedback')
      .insert({
        id: feedbackId,
        post_id: postId,
        rating: rating,
        feedback_text: comment,
        created_at: timestamp
      })
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/post/[id]')
    revalidatePath('/dashboard')
    
    return { success: true, feedbackId }
  } catch (error) {
    console.error('Error saving feedback:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 