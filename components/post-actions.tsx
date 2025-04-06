"use client";

import { Post } from "@/lib/types";
import { approvePost, deletePost, rejectPost } from "@/app/actions/db-actions";
import { useState } from "react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { toast } from "sonner";
import { CheckCircle, ThumbsDown, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  post: Post;
}

export function PostActions({ post }: PostActionsProps) {
  const router = useRouter();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [openReject, setOpenReject] = useState(false);
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
      await approvePost(post.id);
      toast.success("Post approved successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to approve post:", error);
      toast.error("Failed to approve post");
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
      setOpenReject(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to reject post:", error);
      toast.error("Failed to reject post");
      setIsRejecting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleApprove}
        disabled={isApproving || post.approved}
        className="bg-green-600 hover:bg-green-700"
      >
        {isApproving ? (
          <>
            <Skeleton className="h-4 w-4 mr-2 rounded-full" />
            Approving...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            {post.approved ? "Approved" : "Approve"}
          </>
        )}
      </Button>
      
      <Dialog open={openReject} onOpenChange={setOpenReject}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            disabled={isRejecting}
            className="border-amber-500 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500"
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
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
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenReject(false)}>
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