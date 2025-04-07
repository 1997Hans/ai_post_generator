"use client";

import { Post } from "@/lib/types";
import { approvePost, deletePost, rejectPost } from "@/app/actions/db-actions";
import { useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, ThumbsDown, Trash, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const router = useRouter();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast.success("Post deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete post:", error);
      toast.error("Failed to delete post");
      setIsDeleting(false);
    }
  }
  
  async function handleApprove() {
    try {
      setIsApproving(true);
      const result = await approvePost(post.id);
      
      if (result.success) {
        router.refresh();
      } else {
        console.error('Failed to approve post:', result.error);
      }
    } catch (error) {
      console.error('Error approving post:', error);
    } finally {
      setIsApproving(false);
    }
  }
  
  async function handleReject() {
    try {
      setIsRejecting(true);
      const result = await rejectPost(post.id, feedback);
      
      if (result.success) {
        setShowRejectDialog(false);
        router.refresh();
      } else {
        console.error('Failed to reject post:', result.error);
      }
    } catch (error) {
      console.error('Error rejecting post:', error);
    } finally {
      setIsRejecting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={post.approved ? "outline" : "default"}
        className={cn(
          "transition-all",
          post.approved ? "bg-muted hover:bg-muted/80" : "bg-green-600 hover:bg-green-700 text-white"
        )}
        disabled={isApproving}
        onClick={handleApprove}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        {post.approved ? "Unapprove" : "Approve"}
      </Button>
      
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            disabled={isRejecting}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Post</DialogTitle>
            <DialogDescription>
              Provide feedback on why this post was rejected. This will help with future post generation.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter feedback on why this post was rejected..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRejectDialog(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Submit Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="destructive" 
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            Deleting...
          </>
        ) : (
          <>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </>
        )}
      </Button>
    </div>
  );
} 