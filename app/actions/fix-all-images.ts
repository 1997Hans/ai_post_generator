'use server'

import { supabase } from '@/lib/supabase'
import { sanitizeImageUrl } from '@/lib/types'

/**
 * This action finds and fixes all problematic image URLs in the database
 */
export async function fixAllImageUrls() {
  try {
    // First get all posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, image_url')
    
    if (error) throw new Error(`Error fetching posts: ${error.message}`)
    
    if (!posts || posts.length === 0) {
      console.log('No posts found to fix')
      return { success: true, fixedCount: 0 }
    }
    
    let fixedCount = 0
    
    // Process each post
    for (const post of posts) {
      // Check if the image URL needs to be fixed
      const sanitizedUrl = sanitizeImageUrl(post.image_url)
      
      // If the URL was changed by sanitizeImageUrl, update it in the database
      if (sanitizedUrl !== post.image_url) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ image_url: sanitizedUrl })
          .eq('id', post.id)
        
        if (updateError) {
          console.error(`Error updating post ${post.id}:`, updateError)
        } else {
          fixedCount++
          console.log(`Fixed image URL for post ${post.id}`)
        }
      }
    }
    
    // Don't call revalidatePath here as it causes errors when called during render
    
    return { success: true, fixedCount }
  } catch (error) {
    console.error('Error fixing image URLs:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
} 