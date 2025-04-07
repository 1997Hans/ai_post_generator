import { getPost } from "@/app/actions/db-actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PostActions } from "@/components/post-actions";
import { ApprovalStatusBadge } from "@/components/approval/ApprovalStatusBadge";
import { FeedbackDialog } from "@/components/approval/FeedbackDialog";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const { post, success } = await getPost(params.id);
  
  if (!success || !post) {
    notFound();
  }
  
  const hashtags = Array.isArray(post.hashtags)
    ? post.hashtags
    : post.hashtags?.split(" ") || [];
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Post Details</h1>
        </div>
        <PostActions post={post} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Post Content</CardTitle>
              <ApprovalStatusBadge approved={post.approved} />
            </CardHeader>
            <CardContent>
              {post.image_url ? (
                <div className="aspect-video w-full mb-6 rounded-md overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt="Post visual" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full mb-6 bg-muted flex items-center justify-center rounded-md">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <p className="text-base mb-6 whitespace-pre-wrap">{post.content}</p>
              
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {hashtags.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground justify-between border-t p-4">
              <div>
                Created {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
              {post.updated_at !== post.created_at && (
                <div>
                  Updated {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Original Prompt</h3>
                <p className="text-sm bg-muted p-3 rounded-md font-mono whitespace-pre-wrap">
                  {post.prompt}
                </p>
              </div>
              
              {post.refined_prompt && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Refined Prompt</h3>
                  <p className="text-sm bg-muted p-3 rounded-md font-mono whitespace-pre-wrap">
                    {post.refined_prompt}
                  </p>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <h3 className="text-sm font-medium mb-1">Tone</h3>
                  <p className="text-sm">{post.tone || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Visual Style</h3>
                  <p className="text-sm">{post.visual_style || "Not specified"}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <FeedbackDialog postId={post.id} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 