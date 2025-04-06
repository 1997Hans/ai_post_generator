'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'
import { SavePostValues } from '@/lib/validations/post'
import { v4 as uuidv4 } from 'uuid'

export async function savePost(data: SavePostValues) {
  try {
    const postId = data.postId || uuidv4()
    
    const { error } = await supabase.from('posts').upsert({
      id: postId,
      content: data.content,
      image_url: data.imageUrl,
      hashtags: data.hashtags,
      prompt: data.prompt,
      refined_prompt: data.refinedPrompt || null,
      tone: data.tone,
      visual_style: data.visualStyle,
      updated_at: new Date().toISOString(),
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

export async function getPosts(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw new Error(error.message)
    
    return { posts: data, success: true }
  } catch (error) {
    console.error('Error getting posts:', error)
    return { 
      success: false, 
      posts: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
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
    const { error } = await supabase
      .from('posts')
      .update({ approved: true })
      .eq('id', postId)
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath(`/post/${postId}`)
    
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
    
    // Delete the post
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    if (deleteError) throw new Error(deleteError.message)
    
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