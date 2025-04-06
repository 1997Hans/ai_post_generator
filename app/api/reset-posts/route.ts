import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { addSamplePosts } from '@/app/actions/add-sample-posts';

/**
 * API route to reset and recreate sample posts
 * This will delete all existing posts and add fresh sample posts
 */
export async function GET() {
  try {
    // Delete all existing posts
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .neq('id', ''); // Delete all rows
    
    if (deleteError) {
      throw new Error(`Failed to delete posts: ${deleteError.message}`);
    }
    
    // Add sample posts
    const result = await addSamplePosts();
    
    return NextResponse.json({
      success: true,
      message: 'Posts reset successfully',
      result
    });
  } catch (error) {
    console.error('Error resetting posts:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 