"use client";

import { Post } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, Calendar, ExternalLink, ThumbsDown, ThumbsUp, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { deletePost } from "@/app/actions/db-actions";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Link from "next/link";

interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
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

  return (
    <Card className="h-full flex flex-col overflow-hidden border border-muted-foreground/20 bg-background/70 backdrop-blur-sm hover:bg-background/80 transition-colors">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {formattedDate || <Skeleton className="h-4 w-20" />}
          </div>
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
      </CardHeader>
      <Link href={`/dashboard/${post.id}`} className="flex-grow group">
        <CardContent className="p-4 pt-2 flex-grow">
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