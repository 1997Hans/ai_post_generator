'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, Edit, Eye, Sparkles, RefreshCw, Database, ToggleRight } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPostHistory, deletePost, debugStorage } from '@/lib/storage';
import { deletePost as deleteDbPost } from '@/app/actions/db-actions';
import { v4 as uuidv4 } from 'uuid';

interface PostHistoryListProps {
  dbPosts?: Post[];
  isDbLoading?: boolean;
}

export function PostHistoryList({ dbPosts = [], isDbLoading = false }: PostHistoryListProps) {
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const [displaySource, setDisplaySource] = useState<'local' | 'database'>('database');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [normalizedDbPosts, setNormalizedDbPosts] = useState<Post[]>([]);
  
  // Normalize database posts to ensure all required fields are present
  useEffect(() => {
    if (dbPosts && dbPosts.length > 0) {
      // Map DB posts to ensure they have all required fields with valid values
      const normalized = dbPosts.map(post => {
        // Create default timestamp if missing
        const timestamp = new Date().toISOString();
        
        // DB field mapping - ensure all fields exist with proper format
        return {
          id: post.id || uuidv4(),
          content: post.content || '',
          prompt: post.prompt || 'Untitled Post',
          hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
          imageUrl: post.image_url || post.imageUrl || '',
          refinedPrompt: post.refined_prompt || post.refinedPrompt || null,
          tone: post.tone || '',
          visualStyle: post.visual_style || post.visualStyle || '',
          createdAt: post.created_at || post.createdAt || timestamp,
          updatedAt: post.updated_at || post.updatedAt || timestamp
        } as Post;
      });
      
      console.log('Normalized DB posts:', normalized.length);
      setNormalizedDbPosts(normalized);
    } else {
      setNormalizedDbPosts([]);
    }
  }, [dbPosts]);
  
  // Load localStorage posts
  const loadLocalPosts = () => {
    try {
      console.log('🚀 Loading posts from localStorage...');
      
      // Debug the localStorage state
      debugStorage();
      
      // Get fresh data from localStorage
      const history = getPostHistory();
      console.log('✅ Loaded posts from storage:', history.posts.length);
      
      if (history.posts.length > 0) {
        // Show the first post for debugging
        console.log('📝 First post:', history.posts[0].id, history.posts[0].prompt);
      } else {
        console.log('⚠️ No posts found in localStorage');
      }
      
      setLocalPosts(history.posts);
    } catch (error) {
      console.error('❌ Failed to load posts:', error);
    } finally {
      setIsLocalLoading(false);
    }
  };
  
  // Function to log storage events for debugging
  const logStorageEvent = (event: StorageEvent | CustomEvent) => {
    if (event instanceof StorageEvent) {
      console.log('📢 Storage event:', event.key, event.newValue);
    } else if (event instanceof CustomEvent) {
      console.log('📢 Custom event:', event.type, event.detail);
    }
  };
  
  useEffect(() => {
    // Add browser info for debugging
    console.log('🌐 Browser:', navigator.userAgent);
    console.log('💾 localStorage available:', typeof window !== 'undefined' && !!window.localStorage);
    
    // Initial load
    loadLocalPosts();
    
    // Set up event listeners for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      console.log('🔄 Storage changed, reloading posts');
      logStorageEvent(event);
      loadLocalPosts();
    };
    
    const handleCustomEvent = (event: Event) => {
      console.log('🔄 Custom event triggered, reloading posts');
      if (event instanceof CustomEvent) {
        logStorageEvent(event);
      }
      loadLocalPosts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('postUpdated', handleCustomEvent);
    
    // Debug - check periodically for changes
    const intervalId = setInterval(() => {
      console.log('⏱️ Checking for posts periodically...');
      loadLocalPosts();
    }, 10000); // Check every 10 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('postUpdated', handleCustomEvent);
      clearInterval(intervalId);
    };
  }, []);
  
  // Detect when dbPosts change
  useEffect(() => {
    if (dbPosts.length > 0) {
      console.log(`📊 Received ${dbPosts.length} posts from database`);
    }
  }, [dbPosts]);
  
  // Function to handle post deletion
  const handleDelete = async (id: string, source: 'local' | 'database') => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(id);
    
    try {
      if (source === 'local') {
        // Delete from localStorage
        deletePost(id);
        // Force immediate UI update
        setLocalPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      } else {
        // Delete from database
        const result = await deleteDbPost(id);
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete post from database');
        }
        
        // Force reload window after database deletion
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post: ' + error.message);
    } finally {
      setIsDeleting(null);
    }
  };
  
  // For development: Add a test post on demand
  const addDemoPost = () => {
    try {
      console.log('📝 Adding demo post to localStorage...');
      
      // Generate a test post for development purposes
      const testPost: Post = {
        id: 'demo-post-' + Date.now(),
        prompt: 'Demo social media post',
        content: 'This is a sample social media post showing how our dashboard displays generated content. You can edit, view or delete this post using the buttons below.',
        hashtags: ['demo', 'socialmedia', 'content', 'ai'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tone: 'Professional',
        visualStyle: 'Modern'
      };
      
      // Save directly to localStorage
      const history = getPostHistory();
      history.posts.unshift(testPost);
      localStorage.setItem('post-generator-history', JSON.stringify(history));
      console.log('✅ Added demo post to localStorage');
      
      // Verify the post was saved
      setTimeout(() => {
        debugStorage();
        // Trigger reload
        loadLocalPosts();
      }, 500);
    } catch (error) {
      console.error('❌ Failed to add demo post:', error);
    }
  };

  // Toggle between database and localStorage
  const toggleDisplaySource = () => {
    setDisplaySource(prev => prev === 'local' ? 'database' : 'local');
  };
  
  // Show loading state if either source is loading
  const isLoading = (displaySource === 'local' && isLocalLoading) || 
                    (displaySource === 'database' && isDbLoading);
  
  // Get the appropriate posts array based on chosen source
  const posts = displaySource === 'local' ? localPosts : normalizedDbPosts;
  
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "32px",
        height: "100%",
        flex: 1
      }}>
        <div style={{ 
          height: "32px", 
          width: "32px", 
          borderRadius: "50%", 
          border: "4px solid rgba(124, 58, 237, 0.2)",
          borderTopColor: "#7c3aed",
          animation: "spin 1s linear infinite"
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        textAlign: "center",
        flex: 1,
        height: "100%",
        minHeight: "50vh"
      }}>
        <div style={{
          marginBottom: "24px",
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "rgba(124, 58, 237, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Sparkles size={28} style={{ color: "#7c3aed" }} />
        </div>
        
        <p style={{ color: "#a7a3bc", fontSize: "18px", marginBottom: "16px" }}>
          {displaySource === 'database' 
            ? "No posts found in database" 
            : "No post history yet in localStorage"}
        </p>
        
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <Link 
            href="/" 
            style={{
              backgroundColor: "#7c3aed",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              textDecoration: "none"
            }}
          >
            Create your first post
          </Link>
          
          <button
            onClick={addDemoPost}
            style={{
              backgroundColor: "transparent",
              color: "#7c3aed",
              border: "1px solid #7c3aed",
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            Add Demo Post
          </button>
        </div>

        {/* Data source toggle */}
        <button
          onClick={toggleDisplaySource}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            color: "#7c3aed",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer"
          }}
        >
          <ToggleRight size={16} />
          {displaySource === 'database' 
            ? "Switch to localStorage" 
            : "Switch to Database"}
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>
            Your Post History ({posts.length})
          </h2>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "rgba(124, 58, 237, 0.1)",
            color: "#7c3aed",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px"
          }}>
            {displaySource === 'database' ? (
              <>
                <Database size={12} />
                Database
              </>
            ) : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L2 22" />
                  <path d="M17 2H22V7" />
                  <path d="M2 17V22H7" />
                  <path d="M18 14C18 15.6569 16.6569 17 15 17C13.3431 17 12 15.6569 12 14C12 12.3431 13.3431 11 15 11C16.6569 11 18 12.3431 18 14Z" />
                  <path d="M18 22L15 17" />
                  <path d="M6 3L9 8" />
                </svg>
                localStorage
              </>
            )}
          </div>
          
          <button
            onClick={toggleDisplaySource}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "transparent",
              border: "none",
              color: "#7c3aed",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <ToggleRight size={14} />
            Switch
          </button>
        </div>
        
        <button
          onClick={displaySource === 'local' ? loadLocalPosts : () => window.location.reload()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "transparent",
            border: "none",
            color: "#7c3aed",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
        gap: "16px" 
      }}>
        {posts.map((post) => (
          <div 
            key={post.id}
            style={{
              backgroundColor: "rgba(24, 22, 43, 0.7)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(58, 46, 99, 0.4)",
              borderRadius: "12px",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
          >
            {post.imageUrl && (
              <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                <img 
                  src={post.imageUrl} 
                  alt={post.prompt}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease" 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              </div>
            )}
            
            {!post.imageUrl && (
              <div style={{ 
                aspectRatio: "16/9", 
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(234, 76, 137, 0.1) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "50%",
                  backgroundColor: "rgba(124, 58, 237, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Sparkles size={24} style={{ color: "#7c3aed" }} />
                </div>
              </div>
            )}
            
            <div style={{ padding: "16px" }}>
              <h3 style={{ 
                fontWeight: "500", 
                fontSize: "16px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {post.prompt}
              </h3>
              
              <div style={{ 
                marginTop: "8px", 
                fontSize: "14px", 
                color: "#a7a3bc",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical"
              }}>
                {post.content}
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                marginTop: "16px", 
                fontSize: "12px", 
                color: "#a7a3bc" 
              }}>
                <span>
                  {post.createdAt && !isNaN(new Date(post.createdAt).getTime()) 
                    ? format(new Date(post.createdAt), 'MMM d, yyyy')
                    : 'No date available'}
                </span>
                <span>
                  {post.tone || 'No tone'}
                </span>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "flex-end", 
                gap: "8px", 
                marginTop: "16px" 
              }}>
                <button
                  onClick={() => handleDelete(post.id, displaySource)}
                  disabled={isDeleting === post.id}
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: isDeleting === post.id ? "wait" : "pointer",
                    color: "#a7a3bc",
                    transition: "background-color 0.2s, color 0.2s",
                    opacity: isDeleting === post.id ? 0.5 : 1
                  }}
                  onMouseOver={(e) => {
                    if (isDeleting !== post.id) {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#a7a3bc";
                  }}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
                
                <Link 
                  href={`/edit/${post.id}`} 
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "transparent",
                    color: "#a7a3bc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#a7a3bc";
                  }}
                  aria-label="Edit"
                >
                  <Edit size={16} />
                </Link>
                
                <Link 
                  href={`/post/${post.id}`} 
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "transparent",
                    color: "#a7a3bc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    transition: "background-color 0.2s, color 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#a7a3bc";
                  }}
                  aria-label="View"
                >
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 