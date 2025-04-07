'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPostById, savePost } from '@/lib/storage';
import { EditPostForm } from '@/components/history/EditPostForm';
import { PostPreview } from '@/components/PostPreview';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const fetchPost = () => {
      try {
        const foundPost = getPostById(params.id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError('Post not found. It may have been deleted or never existed.');
        }
      } catch (err) {
        setError('Error loading post data. Please try again later.');
        console.error('Failed to load post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Small delay to ensure localStorage has the latest data
    const timer = setTimeout(fetchPost, 100);
    return () => clearTimeout(timer);
  }, [params.id]);
  
  const handleUpdatePost = (updatedPost: Post) => {
    try {
      savePost(updatedPost);
      setPost(updatedPost);
      // Create a custom event to notify other components
      window.dispatchEvent(new Event('postUpdated'));
    } catch (error) {
      console.error('Error saving post update:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-lg">
        <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-lg border">
          <p className="text-muted-foreground text-lg mb-4">{error || 'Post not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <Link 
          href={`/post/${post.id}`} 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Post
        </Link>
        
        <h1 className="text-2xl font-bold">Edit Post</h1>
        
        <div className="w-24"></div> {/* Spacer for centered title */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <EditPostForm post={post} onUpdate={handleUpdatePost} />
        </div>
        
        <div className="lg:sticky lg:top-20">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-medium mb-4">Preview</h2>
            <PostPreview post={post} />
          </div>
        </div>
      </div>
    </div>
  );
} 