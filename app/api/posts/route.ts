import { NextRequest, NextResponse } from 'next/server';
import { getAllPostsUncached } from '@/app/actions/db-actions';

// Configure route to disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    console.log('[API] Fetching all posts with no cache');
    const posts = await getAllPostsUncached();
    
    // Log each post's approval status for debugging
    posts.forEach(post => {
      console.log(`[API] Post ${post.id}: approved=${post.approved}, Type: ${typeof post.approved}, Value: ${JSON.stringify(post.approved)}`);
      
      // Properly handle different representations of approved values
      if (post.approved === true || post.approved === 'true') {
        // Convert to proper boolean true
        post.approved = true;
        console.log(`[API] Post ${post.id} is APPROVED`);
      } else if (post.approved === false || post.approved === 'false') {
        // Convert to proper boolean false
        post.approved = false;
        console.log(`[API] Post ${post.id} is REJECTED`);
      } else {
        // Keep as null for pending state
        post.approved = null;
        console.log(`[API] Post ${post.id} is PENDING`);
      }
    });
    
    // Set no-cache headers
    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
} 