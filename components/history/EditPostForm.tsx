'use client';

import { useState, FormEvent } from 'react';
import { Post } from '@/lib/types';
import { Loader2, RefreshCw, Save } from 'lucide-react';

interface EditPostFormProps {
  post: Post;
  onUpdate: (updatedPost: Post) => void;
  isSaving?: boolean;
}

export function EditPostForm({ post, onUpdate, isSaving = false }: EditPostFormProps) {
  const [formData, setFormData] = useState({
    prompt: post.prompt,
    content: post.content,
    caption: post.caption || '',
    hashtags: post.hashtags.join(' '),
    tone: post.tone || '',
    visualStyle: post.visualStyle || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Don't set local isSubmitting if parent is handling the saving state
    if (!isSaving) {
      setIsSubmitting(true);
    }
    
    try {
      const updatedPost: Post = {
        ...post,
        prompt: formData.prompt,
        content: formData.content,
        caption: formData.caption,
        hashtags: formData.hashtags.split(' ').filter(tag => tag.trim() !== ''),
        tone: formData.tone,
        visualStyle: formData.visualStyle,
        updatedAt: new Date().toISOString(),
      };
      
      onUpdate(updatedPost);
      
      // Only reset local state if parent is not handling saving
      if (!isSaving) {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      if (!isSaving) {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleRegenerate = async () => {
    setIsRegenerating(true);
    
    // In a real app, this would call the AI service to regenerate content
    // For now, we'll just simulate this with a timeout
    setTimeout(() => {
      const updatedPost: Post = {
        ...post,
        content: `Regenerated content based on prompt: ${formData.prompt}`,
        caption: `New caption for: ${formData.prompt}`,
        hashtags: ['regenerated', 'content', 'ai', 'awesome'],
        updatedAt: new Date().toISOString(),
      };
      
      onUpdate(updatedPost);
      setFormData({
        ...formData,
        content: updatedPost.content,
        caption: updatedPost.caption,
        hashtags: updatedPost.hashtags.join(' '),
      });
      
      setIsRegenerating(false);
    }, 2000);
  };
  
  // Determine if the save button should be disabled
  const saveButtonDisabled = isSaving || isSubmitting;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium">
          Prompt
        </label>
        <input
          type="text"
          id="prompt"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          required
          disabled={isSaving}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="tone" className="block text-sm font-medium">
            Tone
          </label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            disabled={isSaving}
          >
            <option value="">Select a tone</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="excited">Excited</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="visualStyle" className="block text-sm font-medium">
            Visual Style
          </label>
          <select
            id="visualStyle"
            name="visualStyle"
            value={formData.visualStyle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            disabled={isSaving}
          >
            <option value="">Select a style</option>
            <option value="realistic">Realistic</option>
            <option value="cartoon">Cartoon</option>
            <option value="minimalist">Minimalist</option>
            <option value="artistic">Artistic</option>
            <option value="3d">3D Render</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          required
          disabled={isSaving}
        />
      </div>
      
      <div>
        <label htmlFor="caption" className="block text-sm font-medium">
          Caption
        </label>
        <textarea
          id="caption"
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          disabled={isSaving}
        />
      </div>
      
      <div>
        <label htmlFor="hashtags" className="block text-sm font-medium">
          Hashtags (space separated)
        </label>
        <input
          type="text"
          id="hashtags"
          name="hashtags"
          value={formData.hashtags}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          disabled={isSaving}
        />
      </div>
      
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={saveButtonDisabled}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving || isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={isRegenerating || isSaving}
          className="flex items-center gap-2 rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Regenerate Content
        </button>
      </div>
    </form>
  );
} 