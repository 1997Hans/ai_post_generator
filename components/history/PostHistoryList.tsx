'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, Edit, Eye, Sparkles, RefreshCw, Database, CheckCircle, XCircle } from 'lucide-react';
import { Post } from '@/lib/types';
import { deletePost as deleteDbPost, approvePost, rejectPost } from '@/app/actions/db-actions';
import { v4 as uuidv4 } from 'uuid';
import { ApprovalStatusBadge } from '../approval/ApprovalStatusBadge';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { RejectDialog } from './RejectDialog';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PostHistoryListProps {
  dbPosts?: Post[];
  isDbLoading?: boolean;
  onStatusChange?: () => void;
}

export function PostHistoryList({ 
  dbPosts = [], 
  isDbLoading = false,
  onStatusChange 
}: PostHistoryListProps) {
  const [normalizedDbPosts, setNormalizedDbPosts] = useState<Post[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState<string | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [localPostStates, setLocalPostStates] = useState<Record<string, { approved: boolean | null }>>({});
  
  // Normalize database posts to ensure all required fields are present
  useEffect(() => {
    if (dbPosts && dbPosts.length > 0) {
      // Map DB posts to ensure they have all required fields with valid values
      const normalized = dbPosts.map(post => {
        // Create default timestamp if missing
        const timestamp = new Date().toISOString();
        
        // DB field mapping - ensure all fields exist with proper format
        const localState = localPostStates[post.id];
        
        // Debug database value
        console.log(`[PostHistoryList] Raw DB value for post ${post.id}: approved=${JSON.stringify(post.approved)}`);
        
        // If we have a local state for this post, use it, otherwise use the database value
        // IMPORTANT: The === true comparison was causing problems with truthy values
        // Using a direct check instead
        let approvalState: boolean | null;
        
        if (localState !== undefined) {
          // Use local state if available
          approvalState = localState.approved;
        } else if (post.approved === true) {
          // Explicitly approved
          approvalState = true;
        } else if (post.approved === false) {
          // Explicitly rejected
          approvalState = false;
        } else {
          // Null or undefined = pending
          approvalState = null;
        }
        
        console.log(`[PostHistoryList] Post ${post.id}: DB approved=${post.approved}, local=${localState?.approved}, final=${approvalState}`);
        
        return {
          id: post.id || uuidv4(),
          content: post.content || '',
          prompt: post.prompt || 'Untitled Post',
          hashtags: Array.isArray(post.hashtags) ? post.hashtags : (post.hashtags ? post.hashtags.split(' ') : []),
          imageUrl: post.image_url || post.imageUrl || '',
          refinedPrompt: post.refined_prompt || post.refinedPrompt || null,
          tone: post.tone || '',
          visualStyle: post.visual_style || post.visualStyle || '',
          createdAt: post.created_at || post.createdAt || timestamp,
          updatedAt: post.updated_at || post.updatedAt || timestamp,
          approved: approvalState
        } as Post;
      });
      
      console.log(`Loaded ${normalized.length} posts from database`);
      setNormalizedDbPosts(normalized);
    } else {
      setNormalizedDbPosts([]);
    }
  }, [dbPosts, localPostStates]);
  
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
  
  // Function to handle post approval with improved UI feedback
  const handleApprove = async (id: string) => {
    try {
      console.log(`[PostHistoryList] Approving post ${id}`);
      setIsApproving(id);
      
      // Update local state immediately for responsive UI
      setLocalPostStates(prev => ({
        ...prev,
        [id]: { approved: true }
      }));
      
      // Update in database
      const result = await approvePost(id);
      console.log(`[PostHistoryList] Approval result:`, result);
      
      if (result.success) {
        console.log(`[PostHistoryList] Post ${id} approved successfully`);
        
        // Instead of refreshing parent component, update local data only
        // Update our local normalized posts to reflect the change
        setNormalizedDbPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === id 
              ? { ...post, approved: true } 
              : post
          )
        );
        
        // Only call onStatusChange if explicitly requested by the user
        // through a manual refresh button click
        // if (onStatusChange) {
        //   onStatusChange();
        // }
      } else {
        console.error(`[PostHistoryList] Failed to approve post ${id}`);
        // Revert local state on failure
        setLocalPostStates(prev => ({
          ...prev,
          [id]: { approved: null }
        }));
      }
    } catch (error) {
      console.error(`[PostHistoryList] Error approving post ${id}:`, error);
      // Revert local state on error
      setLocalPostStates(prev => ({
        ...prev,
        [id]: { approved: null }
      }));
    } finally {
      setIsApproving(null);
    }
  };
  
  // Function to handle post rejection with feedback and improved UI handling
  const handleReject = async (id: string, feedbackText: string) => {
    if (!feedbackText.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }
    
    try {
      console.log(`[PostHistoryList] Rejecting post ${id} with feedback: ${feedbackText}`);
      setIsRejecting(id);
      setShowRejectDialog(null);
      
      // Update local state immediately for responsive UI
      setLocalPostStates(prev => ({
        ...prev,
        [id]: { approved: false }
      }));
      
      // Update in database
      const result = await rejectPost(id, feedbackText);
      console.log(`[PostHistoryList] Rejection result:`, result);
      
      if (result.success) {
        console.log(`[PostHistoryList] Post ${id} rejected successfully`);
        
        // Instead of refreshing parent component, update local data only
        // Update our local normalized posts to reflect the change
        setNormalizedDbPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === id 
              ? { ...post, approved: false } 
              : post
          )
        );
        
        // Only call onStatusChange if explicitly requested by the user
        // through a manual refresh button click
        // if (onStatusChange) {
        //   onStatusChange();
        // }
      } else {
        console.error(`[PostHistoryList] Failed to reject post ${id}`);
        // Revert local state on failure
        setLocalPostStates(prev => ({
          ...prev,
          [id]: { approved: null }
        }));
      }
    } catch (error) {
      console.error(`[PostHistoryList] Error rejecting post ${id}:`, error);
      // Revert local state on error
      setLocalPostStates(prev => ({
        ...prev,
        [id]: { approved: null }
      }));
    } finally {
      setIsRejecting(null);
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
          onClick={() => {
            // Call parent refresh function if provided
            if (onStatusChange) {
              onStatusChange();
            }
          }}
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
          title="Get latest data from database"
        >
          <RefreshCw size={14} className={isDbLoading ? "animate-spin" : ""} />
          {isDbLoading ? "Loading..." : "Manual Refresh"}
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
                <div className="flex items-center gap-2">
                  <span>{post.tone || 'No tone'}</span>
                  <ApprovalStatusBadge approved={post.approved} />
                </div>
              </div>
              
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "flex-end", 
                gap: "8px", 
                marginTop: "16px" 
              }}>
                {/* Social Media Manager Approval Actions */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginRight: "auto"
                }}>
                  <button
                    onClick={() => handleApprove(post.id)}
                    disabled={isApproving === post.id || post.approved === true}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "4px",
                      backgroundColor: post.approved === true ? "rgba(74, 222, 128, 0.2)" : "rgba(74, 222, 128, 0.8)",
                      border: "none",
                      color: post.approved === true ? "rgba(74, 222, 128, 0.8)" : "white",
                      fontSize: "12px",
                      fontWeight: "500",
                      cursor: isApproving === post.id ? "wait" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: isApproving === post.id ? 0.7 : 1,
                      transition: "background-color 0.2s"
                    }}
                    title={post.approved ? "Post is approved" : "Approve this post"}
                  >
                    <CheckCircle size={12} />
                    {post.approved ? "Approved" : "Approve"}
                  </button>
                  
                  {/* Only show reject button if post is not approved */}
                  {post.approved !== true && (
                    <button
                      onClick={() => setShowRejectDialog(post.id)}
                      disabled={isRejecting === post.id}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        backgroundColor: "rgba(239, 68, 68, 0.8)",
                        border: "none",
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: isRejecting === post.id ? "wait" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        opacity: isRejecting === post.id ? 0.7 : 1,
                        transition: "background-color 0.2s"
                      }}
                      title="Reject this post with feedback"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  )}
                </div>
                
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
      
      {/* Rejection Dialog */}
      {showRejectDialog && (
        <RejectDialog
          isOpen={!!showRejectDialog}
          onClose={() => setShowRejectDialog(null)}
          onReject={(feedbackText) => {
            if (showRejectDialog) {
              handleReject(showRejectDialog, feedbackText);
            }
          }}
          isSubmitting={!!isRejecting}
        />
      )}
    </div>
  );
} 