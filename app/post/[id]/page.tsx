'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPostById } from '@/lib/storage';
import { PostPreview } from '@/components/PostPreview';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { ExportOptions } from '@/components/export/ExportOptions';

export default function PostPage({ params }: { params: { id: string } }) {
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
  
  const handleFeedbackSubmitted = () => {
    // In a real app, we might refresh the post data here
    console.log('Feedback submitted successfully');
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
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/dashboard" 
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        
        <Link
          href={`/edit/${post.id}`}
          className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Post
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-lg border bg-card p-6">
            <h1 className="text-xl font-semibold mb-4">Post Details</h1>
            <PostPreview post={post} />
          </div>
        </div>
        
        <div className="space-y-8">
          <ExportOptions post={post} />
          <FeedbackForm postId={post.id} onFeedbackSubmitted={handleFeedbackSubmitted} />
        </div>
      </div>
    </div>
  );
} 