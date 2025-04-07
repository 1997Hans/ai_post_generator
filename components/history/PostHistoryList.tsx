'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, Edit, Eye, Sparkles, RefreshCw, Database } from 'lucide-react';
import { Post } from '@/lib/types';
import { deletePost as deleteDbPost } from '@/app/actions/db-actions';
import { v4 as uuidv4 } from 'uuid';

interface PostHistoryListProps {
  dbPosts?: Post[];
  isDbLoading?: boolean;
}

export function PostHistoryList({ dbPosts = [], isDbLoading = false }: PostHistoryListProps) {
  const [normalizedDbPosts, setNormalizedDbPosts] = useState<Post[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
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
      
      console.log(`Loaded ${normalized.length} posts from database`);
      setNormalizedDbPosts(normalized);
    } else {
      setNormalizedDbPosts([]);
    }
  }, [dbPosts]);
  
  // Function to handle post deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(id);
    
    try {
      // Delete from database
      const result = await deleteDbPost(id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete post from database');
      }
      
      // Force reload window after database deletion
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post: ' + error.message);
    } finally {
      setIsDeleting(null);
    }
  };
  
  if (isDbLoading) {
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
  
  if (normalizedDbPosts.length === 0) {
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
          No posts found in database
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
            Your Post History ({normalizedDbPosts.length})
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
            <Database size={12} />
            Database
          </div>
        </div>
        
        <button
          onClick={() => window.location.reload()}
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
        {normalizedDbPosts.map((post) => (
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
                  onClick={() => handleDelete(post.id)}
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