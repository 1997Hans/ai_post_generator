"use client";

import { Post } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Calendar, CheckCircle, ExternalLink, ThumbsDown, ThumbsUp, Trash, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { approvePost, deletePost, rejectPost } from "@/app/actions/db-actions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { StatusDisplay } from './StatusDisplay';

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approved, setApproved] = useState(post.approved);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  
  const hashtags = Array.isArray(post.hashtags)
    ? post.hashtags
    : post.hashtags?.split(" ") || [];
  
  // Handle date formatting only on the client side
  useEffect(() => {
    setFormattedDate(formatDistanceToNow(new Date(post.created_at), { addSuffix: true }));
  }, [post.created_at]);
  
  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      // Force a page refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  }
  
  async function handleApprovalToggle() {
    try {
      setIsApproving(true);
      const result = await approvePost(post.id);
      
      if (result.success) {
        // Update local state
        const newApprovalState = !approved;
        setApproved(newApprovalState);
        toast.success(newApprovalState ? "Post approved" : "Post unapproved");
        
        // Force a refresh if we're approving to show updated UI
        if (newApprovalState) {
          // Wait a short moment to ensure toast is visible
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        toast.error("Failed to update post approval status");
      }
    } catch (error) {
      console.error("Failed to update post approval:", error);
      toast.error("Failed to update post approval");
    } finally {
      setIsApproving(false);
    }
  }
  
  async function handleRejectWithFeedback() {
    if (!feedback.trim()) {
      toast.error("Please provide feedback");
      return;
    }
    
    try {
      setIsRejecting(true);
      await rejectPost(post.id, feedback);
      toast.success("Post rejected with feedback");
      setOpen(false);
      // Force a page refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error("Failed to reject post:", error);
      toast.error("Failed to reject post");
      setIsRejecting(false);
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border border-muted-foreground/20 bg-background/70 backdrop-blur-sm hover:bg-background/80 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {formattedDate || <Skeleton className="h-4 w-20" />}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Approve</span>
              <Switch 
                checked={approved} 
                onCheckedChange={handleApprovalToggle}
                disabled={isApproving}
              />
            </div>
            {!approved && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-amber-500 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background/95 backdrop-blur-lg border-muted-foreground/20">
                  <DialogHeader>
                    <DialogTitle>Reject Post with Feedback</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="feedback">Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Please provide feedback on why this post was rejected"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={4}
                      className="bg-background/70 border-muted-foreground/20"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleRejectWithFeedback}
                      disabled={isRejecting}
                    >
                      {isRejecting ? (
                        <>
                          <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                          Rejecting...
                        </>
                      ) : (
                        <>Reject Post</>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-destructive bg-destructive/10 hover:bg-destructive/20"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Skeleton className="h-4 w-4 rounded-full" />
              ) : (
                <Trash className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Link href={`/dashboard/${post.id}`} className="flex-grow group">
        <CardContent className="p-4 pt-2 flex-grow relative">
          <div className="absolute top-4 right-4 z-10">
            {!approved && (
              <StatusDisplay tone={post.tone} approved={approved} />
            )}
          </div>
          
          {post.image_url ? (
            <div className="aspect-video w-full mb-4 rounded-md overflow-hidden bg-muted/30 group-hover:ring-2 ring-primary/20 transition-all">
              <img 
                src={post.image_url} 
                alt="Post visual" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video w-full mb-4 bg-muted/30 flex items-center justify-center rounded-md group-hover:ring-2 ring-primary/20 transition-all">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <p className="text-sm line-clamp-4 mb-3">{post.content}</p>
          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-secondary/50">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2 border-t border-muted-foreground/10 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <ThumbsUp className="mr-1 h-3 w-3" />
          0 likes
        </div>
        <div className="text-xs flex items-center gap-1 text-muted-foreground">
          <Link href={`/dashboard/${post.id}`} className="inline-flex items-center hover:text-primary transition-colors">
            View Details
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function PostItemSkeleton() {
  return (
    <Card className="h-full flex flex-col border border-muted-foreground/20 bg-background/70">
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-grow">
        <Skeleton className="aspect-video w-full mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1 mt-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t border-muted-foreground/10">
        <Skeleton className="h-4 w-16" />
      </CardFooter>
    </Card>
  );
} 