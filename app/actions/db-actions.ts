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
      approved: null
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
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw new Error(error.message)
      
      return data || []
    } catch (error) {
      console.error('Database error:', error)
      return []
    }
  },
  ['all-posts'],
  { revalidate: 10 } // Cache for 10 seconds
)

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
  console.log(`[DB Action] Approving post ${postId}`);
  try {
    // Update the post in the database
    const { data, error } = await supabase
      .from('posts')
      .update({ approved: true })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error(`[DB Action] Error approving post ${postId}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Log the data we got back from the database
    console.log(`[DB Action] Post ${postId} approve response data:`, data);

    // Verify the update was successful - handle both string 'true' and boolean true
    if (!data || (data.approved !== true && data.approved !== 'true')) {
      console.error(`[DB Action] Post ${postId} approval verification failed, data:`, data);
      return {
        success: false,
        error: 'Post approval did not persist in database',
      };
    }

    // Revalidate paths to update the UI
    revalidatePath('/dashboard');
    revalidatePath('/post');
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      post: data,
    };
  } catch (error) {
    console.error(`[DB Action] Unexpected error approving post ${postId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function rejectPost(postId: string, feedbackText: string) {
  console.log(`[DB Action] Rejecting post ${postId} with feedback: ${feedbackText}`);
  try {
    // First, add feedback to the feedback table
    const feedbackId = uuidv4();
    const { error: feedbackError } = await supabase
      .from('feedback')
      .insert([
        {
          id: feedbackId,
          post_id: postId,
          feedback_text: feedbackText,
        },
      ]);

    if (feedbackError) {
      console.error(`[DB Action] Error adding feedback for post ${postId}:`, feedbackError);
      return {
        success: false,
        error: feedbackError.message,
      };
    }

    // Update the post in the database
    const { data, error } = await supabase
      .from('posts')
      .update({ approved: false })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error(`[DB Action] Error rejecting post ${postId}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Log the data we got back from the database
    console.log(`[DB Action] Post ${postId} reject response data:`, data);

    // Verify the update was successful - handle both string 'false' and boolean false
    if (!data || (data.approved !== false && data.approved !== 'false')) {
      console.error(`[DB Action] Post ${postId} rejection verification failed, data:`, data);
      return {
        success: false,
        error: 'Post rejection did not persist in database',
      };
    }

    // Revalidate paths to update the UI
    revalidatePath('/dashboard');
    revalidatePath('/post');
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      post: data,
    };
  } catch (error) {
    console.error(`[DB Action] Unexpected error rejecting post ${postId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function deletePost(postId: string) {
  try {
    // First delete related feedback entries
    const { error: feedbackError } = await supabase
      .from('feedback')
      .delete()
      .eq('post_id', postId);
      
    if (feedbackError) {
      console.error(`Error deleting feedback for post ${postId}:`, feedbackError);
      // Continue anyway to try to delete the post
    }
    
    // Then delete the post
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error(`Error deleting post ${postId}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/');

    return {
      success: true,
    };
  } catch (error) {
    console.error(`Unexpected error deleting post ${postId}:`, error);
    return {
      success: false,
      error: error.message,
    };
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

export async function updateFeedback(feedbackId: string, feedbackText: string) {
  try {
    const { error } = await supabase
      .from('feedback')
      .update({ feedback_text: feedbackText })
      .eq('id', feedbackId)
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/dashboard')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating feedback:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function getFeedback(postId: string) {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    
    return { feedback: data, success: true }
  } catch (error) {
    console.error('Error getting feedback:', error)
    return { 
      success: false, 
      feedback: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}

export async function addPostToHistory(
  title: string,
  content: string,
  prompt: string,
  refinedPrompt: string,
  hashtags: string,
  imageUrl: string
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          id: uuidv4(),
          title,
          content,
          prompt,
          refined_prompt: refinedPrompt,
          hashtags,
          image_url: imageUrl,
          approved: null,
        },
      ])
      .select();

    if (error) {
      console.error('Error adding post to history:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath('/dashboard');
    revalidatePath('/');

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Unexpected error adding post to history:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, feedback(id, feedback_text, created_at)')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching post ${id}:`, error);
      return null;
    }

    return data as Post;
  } catch (error) {
    console.error(`Unexpected error fetching post ${id}:`, error);
    return null;
  }
}

// Add a new function for the API endpoint that needs uncached data
export async function getAllPostsUncached(): Promise<Post[]> {
  try {
    console.log('[DB Action] Fetching all posts (uncached)');
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[DB Action] Error fetching posts:', error);
      throw new Error(error.message);
    }

    // Log post approval states for debugging
    posts?.forEach(post => {
      console.log(`[DB Action] Post ${post.id}: approved=${post.approved}`);
    });

    return posts || [];
  } catch (error) {
    console.error('[DB Action] Unexpected error fetching posts:', error);
    throw error;
  }
}

export async function savePostRating(postId: string, rating: number, comment: string = '') {
  try {
    const ratingId = uuidv4()
    const timestamp = new Date().toISOString()
    
    // Add rating to the new post_ratings table
    const { error } = await supabase
      .from('post_ratings')
      .insert({
        id: ratingId,
        post_id: postId,
        rating: rating,
        comment: comment,
        created_at: timestamp
      })
    
    if (error) throw new Error(error.message)
    
    revalidatePath('/post/[id]')
    revalidatePath('/dashboard')
    
    return { success: true, ratingId }
  } catch (error) {
    console.error('Error saving post rating:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 