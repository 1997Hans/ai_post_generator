'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, Edit, Eye } from 'lucide-react';
import { Post } from '@/lib/types';
import { getPostHistory, deletePost } from '@/lib/storage';

export function PostHistoryList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadPosts = () => {
    try {
      // Force reevaluation of localStorage data
      const history = getPostHistory();
      console.log('Loaded posts from storage:', history.posts.length);
      setPosts(history.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial load
    loadPosts();
    
    // Set up interval to check for changes
    const intervalId = setInterval(loadPosts, 1000);
    
    // Add event listeners for storage changes
    const handleStorageChange = () => {
      console.log('Storage changed, reloading posts');
      loadPosts();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('postUpdated', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('postUpdated', handleStorageChange);
    };
  }, []);
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
      // Force immediate UI update
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "32px" 
      }}>
        <div style={{ 
          height: "32px", 
          width: "32px", 
          borderRadius: "50%", 
          border: "4px solid rgba(124, 58, 237, 0.2)",
          borderTopColor: "#7c3aed",
          animation: "spin 1s linear infinite"
        }}></div>
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
        textAlign: "center"
      }}>
        <p style={{ color: "#a7a3bc", fontSize: "18px", marginBottom: "16px" }}>
          No post history yet
        </p>
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
      </div>
    );
  }
  
  return (
    <div style={{ marginBottom: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
        Your Post History
      </h2>
      
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
                <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
                <span>{post.tone || 'No tone'}</span>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "flex-end", 
                gap: "8px", 
                marginTop: "16px" 
              }}>
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    borderRadius: "50%",
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#a7a3bc",
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