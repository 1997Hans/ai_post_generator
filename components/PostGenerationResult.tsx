'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostOutput, PostRequestInput } from '@/lib/types';
import { PostPreview } from './PostPreview';
import { ExportOptions } from './export/ExportOptions';
import { Check, Save, Loader2, RefreshCw } from 'lucide-react';
import { saveGeneratedPost } from '@/app/actions/saveGeneratedPost';
import { savePost } from '@/app/actions/db-actions';
import { v4 as uuidv4 } from 'uuid';

interface PostGenerationResultProps {
  result: PostOutput;
  request: PostRequestInput;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export function PostGenerationResult({
  result,
  request,
  onRegenerate,
  isRegenerating
}: PostGenerationResultProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const convertToPost = async () => {
      try {
        console.log('Converting result to post', result);
        // Ensure result has an ID
        if (!result.id) {
          result.id = uuidv4();
        }
        
        const postData = await saveGeneratedPost(request, result);
        console.log('Post data generated:', postData);
        setPost(postData);
      } catch (error) {
        console.error('Error converting result to post:', error);
      }
    };
    
    convertToPost();
  }, [result, request]);
  
  const handleSavePost = async () => {
    if (!post) {
      console.error('Cannot save: post is null');
      setSaveError('Cannot save: post data is missing');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      console.log('Saving post to database:', post);
      
      // Make sure we have a proper post object with all required fields
      const completePost = {
        postId: post.id,
        content: post.content,
        imageUrl: post.imageUrl || '',
        hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
        prompt: post.prompt || request.prompt || 'Untitled Post',
        refinedPrompt: post.refinedPrompt || null,
        tone: post.tone || '',
        visualStyle: post.visualStyle || ''
      };
      
      // Save to database
      const result = await savePost(completePost);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred while saving post');
      }
      
      console.log('Post saved successfully to database:', result.postId);
      
      setIsSaved(true);
      setIsSaving(false);
      
      // Wait a moment before redirecting
      setTimeout(() => {
        router.push(`/post/${result.postId}`);
      }, 1000);
    } catch (error) {
      console.error('Error saving post:', error);
      setSaveError('Failed to save post: ' + (error.message || 'Unknown error'));
      setIsSaving(false);
    }
  };
  
  if (!post) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Generated Post</h2>
        <PostPreview post={post} />
        
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleSavePost}
            disabled={isSaving || isSaved}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaved ? 'Saved!' : 'Save Post'}
          </button>
          
          <button
            onClick={onRegenerate}
            disabled={isRegenerating || isSaved}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Regenerate
          </button>
          
          {saveError && (
            <div className="text-sm text-red-500">
              {saveError}
            </div>
          )}
          
          {isSaved && (
            <div className="text-sm text-muted-foreground">
              Redirecting to post...
            </div>
          )}
        </div>
      </div>
      
      {post && !isSaved && (
        <ExportOptions post={post} />
      )}
    </div>
  );
} 