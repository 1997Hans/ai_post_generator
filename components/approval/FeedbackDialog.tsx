'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getFeedback } from '@/app/actions/db-actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';

interface FeedbackItem {
  id: string;
  post_id: string;
  feedback_text: string;
  created_at: string;
}

interface FeedbackDialogProps {
  postId: string;
}

export function FeedbackDialog({ postId }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function loadFeedback() {
    if (!open) return;
    
    try {
      setIsLoading(true);
      const result = await getFeedback(postId);
      
      if (result.success && result.feedback) {
        setFeedback(result.feedback);
      } else {
        console.error('Failed to load feedback:', result.error);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadFeedback();
  }, [open, postId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          View Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Feedback History</DialogTitle>
          <DialogDescription>
            View feedback provided for this post
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            </div>
          ) : feedback.length > 0 ? (
            feedback.map((item) => (
              <div key={item.id} className="rounded-md border p-4">
                <div className="text-sm text-muted-foreground mb-2">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </div>
                <div className="text-sm whitespace-pre-wrap">{item.feedback_text}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No feedback has been provided for this post.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 