"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

interface PostPreviewProps {
  post: {
    text: string
    image?: string
    hashtags: string[]
  }
  onRefine: () => void
  onApprove: () => void
}

export function PostPreview({ post, onRefine, onApprove }: PostPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex flex-col space-y-4 p-6">
            <div className="space-y-2">
              <p className="whitespace-pre-line text-base">{post.text}</p>
              
              {post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {post.hashtags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {post.image && (
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt="Generated post image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRefine}>
          Refine Post
        </Button>
        <Button onClick={onApprove}>
          Approve Post
        </Button>
      </CardFooter>
    </Card>
  )
}