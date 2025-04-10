import { Post } from '@/lib/types';
import Image from 'next/image';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useA11y } from '@/lib/hooks/useA11y';
import { useEffect } from 'react';

interface PostPreviewProps {
  post: Post;
  showActions?: boolean;
}

export function PostPreview({ post, showActions = true }: PostPreviewProps) {
  const { elementRef, announce } = useA11y<HTMLDivElement>({
    announceChanges: true,
    trapFocusEnabled: false,
  });

  // Announce to screen readers when post content changes
  useEffect(() => {
    announce('Post preview loaded with new content', 'polite');
  }, [post, announce]);

  return (
    <div 
      ref={elementRef}
      className="space-y-6 transition-all duration-300"
      tabIndex={0}
      role="region"
      aria-label="Post preview"
    >
      {post.imageUrl && (
        <div className="relative rounded-xl overflow-hidden shadow-md group">
          <div className="aspect-[4/3] md:aspect-[16/9] w-full relative">
            <img
              src={post.imageUrl}
              alt={post.prompt || "Generated post image"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
          </div>
          
          {showActions && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                aria-label="Like post"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button 
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                aria-label="Share post"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button 
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-colors"
                aria-label="Save post"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="space-y-5">
        <div className="space-y-3">
          <h3 id="content-heading" className="text-sm font-medium text-muted-foreground">Content</h3>
          <p 
            aria-labelledby="content-heading"
            className="text-base md:text-lg font-medium whitespace-pre-wrap leading-relaxed"
          >
            {post.content}
          </p>
        </div>
        
        {post.caption && (
          <div className="space-y-2">
            <h3 id="caption-heading" className="text-sm font-medium text-muted-foreground">Caption</h3>
            <p 
              aria-labelledby="caption-heading"
              className="text-sm md:text-base whitespace-pre-wrap italic text-muted-foreground"
            >
              {post.caption}
            </p>
          </div>
        )}
        
        {post.hashtags.length > 0 && (
          <div className="space-y-2">
            <h3 id="hashtags-heading" className="text-sm font-medium text-muted-foreground">Hashtags</h3>
            <div 
              className="flex flex-wrap gap-1.5"
              aria-labelledby="hashtags-heading"
              role="list"
            >
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  role="listitem"
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs md:text-sm font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2" aria-label="Post metadata">
            {post.tone && (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                Tone: {post.tone}
              </span>
            )}
            
            {post.visualStyle && (
              <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs">
                Style: {post.visualStyle}
              </span>
            )}
          </div>
          
          {showActions && (
            <div className="flex items-center gap-4" role="toolbar" aria-label="Post actions">
              <button className="flex items-center gap-1 text-xs hover:text-foreground transition-colors cursor-pointer" aria-label="Like">
                <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Like</span>
              </button>
              <button className="flex items-center gap-1 text-xs hover:text-foreground transition-colors cursor-pointer" aria-label="Comment">
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Comment</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 