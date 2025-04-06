"use client";

import { getPosts } from "@/app/actions/db-actions";
import { Post } from "@/lib/types";
import { useEffect, useState } from "react";
import { PostItem, PostItemSkeleton } from "@/components/post-item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, X } from "lucide-react";
import DashboardLoading from "@/components/dashboard-loading";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function DashboardContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Parse the query parameter from the URL on the client side
  useEffect(() => {
    const query = searchParams.get('query');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Fetch posts when the component mounts or search query changes
  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        const fetchedPosts = await getPosts(searchQuery);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, [searchQuery]);

  // Handle search form submission
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery) {
      router.push(`${pathname}?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(pathname);
    }
  }

  // Clear search and reset to all posts
  function handleClearSearch() {
    setSearchQuery('');
    router.push(pathname);
  }

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-semibold">All Posts ({posts.length})</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor your social media content</p>
        </div>
        <Link href="/">
          <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </Link>
      </div>
      
      <div className="w-full bg-background/30 backdrop-blur-sm border border-muted-foreground/20 rounded-lg p-4">
        <form onSubmit={handleSearch} className="relative max-w-full md:max-w-md">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search posts by content, hashtags, or prompt..."
              className="pl-10 bg-background/80 border-muted-foreground/20 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-16 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            <Button
              type="submit"
              className="ml-2 bg-primary hover:bg-primary/90"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      {posts.length === 0 ? (
        searchQuery ? (
          <EmptySearchState query={searchQuery} />
        ) : (
          <EmptyState />
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-background/50 backdrop-blur-sm border-muted-foreground/20 min-h-[300px] shadow-sm">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <PlusCircle className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium mb-2">No posts yet</h2>
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
        There are no posts in your database yet. Create your first post to get started.
      </p>
      <Button asChild className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white">
        <Link href="/">Create Your First Post</Link>
      </Button>
    </div>
  );
}

function EmptySearchState({ query }: { query: string }) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-background/50 backdrop-blur-sm border-muted-foreground/20 min-h-[300px] shadow-sm">
      <div className="bg-muted/30 p-4 rounded-full mb-4">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-lg font-medium mb-2">No results found</h2>
      <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
        No posts matching &quot;{query}&quot; were found. Try a different search term.
      </p>
      <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10">
        <Link href="/dashboard">View All Posts</Link>
      </Button>
    </div>
  );
} 