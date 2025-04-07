'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPost, savePost } from '@/app/actions/db-actions';
import { EditPostForm } from '@/components/history/EditPostForm';
import { PostPreview } from '@/components/PostPreview';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching post with ID:', params.id);
        
        const response = await getPost(params.id);
        
        if (response.success && response.post) {
          console.log('Post found:', response.post);
          
          // Normalize the post data to ensure all fields are properly formatted
          const normalizedPost: Post = {
            id: response.post.id,
            content: response.post.content || '',
            prompt: response.post.prompt || 'Untitled Post',
            hashtags: Array.isArray(response.post.hashtags) ? response.post.hashtags : [],
            imageUrl: response.post.image_url || '',
            refinedPrompt: response.post.refined_prompt || null,
            tone: response.post.tone || '',
            visualStyle: response.post.visual_style || '',
            createdAt: response.post.created_at || new Date().toISOString(),
            updatedAt: response.post.updated_at || new Date().toISOString()
          };
          
          setPost(normalizedPost);
        } else {
          setError(response.error || 'Post not found. It may have been deleted or never existed.');
        }
      } catch (err) {
        setError('Error loading post data. Please try again later.');
        console.error('Failed to load post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [params.id]);
  
  const handleUpdatePost = async (updatedPost: Post) => {
    try {
      setIsSaving(true);
      console.log('Updating post in database:', updatedPost);
      
      // Create the database-compatible object
      const postData = {
        postId: updatedPost.id,
        content: updatedPost.content,
        imageUrl: updatedPost.imageUrl || '',
        hashtags: Array.isArray(updatedPost.hashtags) ? updatedPost.hashtags : [],
        prompt: updatedPost.prompt || 'Untitled Post',
        refinedPrompt: updatedPost.refinedPrompt || null,
        tone: updatedPost.tone || '',
        visualStyle: updatedPost.visualStyle || ''
      };
      
      // Save to database
      const result = await savePost(postData);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred while saving post');
      }
      
      console.log('Post updated successfully in database:', result.postId);
      setPost(updatedPost);
      
      // Redirect to view page
      router.push(`/post/${updatedPost.id}`);
    } catch (error) {
      console.error('Error saving post update:', error);
      alert('Failed to update post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
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
          <EditPostForm 
            post={post} 
            onUpdate={handleUpdatePost} 
            isSaving={isSaving} 
          />
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