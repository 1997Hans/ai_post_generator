import { Post } from '@/lib/types';
import Image from 'next/image';

interface PostPreviewProps {
  post: Post;
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <div className="space-y-4">
      {post.imageUrl && (
        <div className="rounded-md overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.prompt}
            className="w-full object-cover aspect-video"
          />
        </div>
      )}
      
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Content</h3>
          <p className="mt-1 text-sm whitespace-pre-wrap">{post.content}</p>
        </div>
        
        {post.caption && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Caption</h3>
            <p className="mt-1 text-sm whitespace-pre-wrap">{post.caption}</p>
          </div>
        )}
        
        {post.hashtags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Hashtags</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {post.tone && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 mr-2">
                Tone: {post.tone}
              </span>
            )}
            
            {post.visualStyle && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1">
                Style: {post.visualStyle}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 