import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware runs before any request
export function middleware(request: NextRequest) {
  const url = request.nextUrl.toString();
  
  // Handle all via.placeholder.com URLs
  if (url.includes('via.placeholder.com')) {
    console.log('Redirecting placeholder URL:', url);
    return NextResponse.redirect(new URL('/placeholder-image.svg', request.url));
  }
  
  // Handle example.com URLs
  if (url.includes('example.com')) {
    console.log('Redirecting example.com URL:', url);
    return NextResponse.redirect(new URL('/placeholder-image.svg', request.url));
  }
  
  // Allow all other requests to proceed
  return NextResponse.next();
}

// Limit middleware to specific paths
export const config = {
  matcher: [
    // Include image optimization requests to fix placeholder redirects
    '/((?!api|_next/static|favicon.ico).*)',
    '/_next/image(.*)' // Add this to catch image optimization requests
  ],
} 