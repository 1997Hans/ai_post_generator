import { NextResponse } from 'next/server';
import { fixAllImageUrls } from '@/app/actions/fix-all-images';

/**
 * API route to run maintenance tasks
 * Use with caution - this can modify data
 */
export async function GET() {
  // Check for maintenance mode/admin authorization here if needed
  try {
    // Fix all image URLs in the database
    const result = await fixAllImageUrls();
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 500 
    });
  } catch (error) {
    console.error('Error running maintenance task:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 