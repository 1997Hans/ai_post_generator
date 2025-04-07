'use client';

import { useState, FormEvent } from 'react';
import { Loader2, Send, Star } from 'lucide-react';
import { saveFeedback } from '@/app/actions/db-actions';

interface FeedbackFormProps {
  postId: string;
  onFeedbackSubmitted?: () => void;
}

export function FeedbackForm({ postId, onFeedbackSubmitted }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Save feedback to database
      const result = await saveFeedback(postId, rating, comment);
      
      if (result.success) {
        setIsSubmitted(true);
        onFeedbackSubmitted?.();
      } else {
        setError(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Thank You!</h3>
        <p className="text-muted-foreground">Your feedback has been submitted.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-6 space-y-4">
      <h3 className="text-lg font-medium">Rate this Post</h3>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">How would you rate this post?</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1 focus:outline-none"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={`h-6 w-6 ${
                  rating >= value
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm text-muted-foreground">
          Comments (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          placeholder="Share your thoughts about this post..."
        />
      </div>
      
      {error && (
        <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Submit Feedback
      </button>
    </form>
  );
} 