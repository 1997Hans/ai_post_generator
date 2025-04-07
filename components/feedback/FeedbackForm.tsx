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
  const [hoveredRating, setHoveredRating] = useState<number>(0);
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
      <div className="rounded-xl border bg-card p-6 text-center space-y-3 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Thank You!</h3>
        <p className="text-muted-foreground">Your feedback has been submitted and will help improve future posts.</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Rate this Post</h3>
        <p className="text-sm text-muted-foreground">Your feedback helps us create better content</p>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm font-medium">How would you rate this post?</p>
        <div className="flex items-center justify-center gap-1 py-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-all duration-200 transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${value} stars`}
            >
              <Star
                className={`h-8 w-8 transition-all duration-200 ${
                  (hoveredRating ? hoveredRating >= value : rating >= value)
                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-md'
                    : 'text-muted-foreground/50'
                }`}
              />
            </button>
          ))}
        </div>
        <div className="text-center text-sm font-medium text-muted-foreground">
          {rating === 1 && "Not great"}
          {rating === 2 && "Could be better"}
          {rating === 3 && "Good"}
          {rating === 4 && "Very good"}
          {rating === 5 && "Excellent!"}
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium">
          Comments (optional)
        </label>
        <div className="relative">
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
            placeholder="Share your thoughts about this post..."
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
            {comment.length}/500
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md flex items-start space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="flex items-center justify-center gap-2 w-full rounded-md bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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