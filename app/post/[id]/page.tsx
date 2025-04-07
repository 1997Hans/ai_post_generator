'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPost, approvePost, rejectPost } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';
import { ArrowLeft, Edit, Copy, Download, Share, Calendar, Star, CheckCircle, XCircle } from 'lucide-react';
import { ApprovalStatusBadge } from '@/components/approval/ApprovalStatusBadge';
import { StatusDisplay } from '@/components/StatusDisplay';
import { toast } from 'sonner';

export default function PostPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.id;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await getPost(postId);
      console.log('Fetched post data:', response.post);
      
      if (response.success && response.post) {
        // Normalize the post data to ensure all fields are properly formatted
        const normalizedPost: Post = {
          id: response.post.id,
          content: response.post.content || '',
          prompt: response.post.prompt || 'Untitled Post',
          hashtags: Array.isArray(response.post.hashtags) ? response.post.hashtags : [],
          imageUrl: response.post.image_url || '',
          refinedPrompt: response.post.refined_prompt || null,
          tone: response.post.tone || '',
          visualStyle: response.post.visual_style || '',
          createdAt: response.post.created_at || new Date().toISOString(),
          updatedAt: response.post.updated_at || new Date().toISOString(),
          // Handle both string and boolean representations of approval status
          approved: response.post.approved === true || response.post.approved === 'true' 
            ? true 
            : response.post.approved === false || response.post.approved === 'false'
              ? false
              : null
        };
        
        console.log('Normalized post data:', normalizedPost);
        console.log('Approval status:', normalizedPost.approved, 'Type:', typeof normalizedPost.approved);
        setPost(normalizedPost);
      } else {
        setError(response.error || 'Post not found');
      }
    } catch (err) {
      setError('Error loading post data');
      console.error('Error in fetchPost:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPost();
  }, [postId]);
  
  // Add effect to log the post approved status when it changes
  useEffect(() => {
    if (post) {
      console.log('Post approval status:', post.approved);
    }
  }, [post?.approved]);
  
  const handleApprove = async () => {
    if (!post) return;
    
    try {
      setIsSubmitting(true);
      console.log('Approving post:', post.id);
      const result = await approvePost(post.id);
      console.log('Approval result:', result);
      
      if (result.success) {
        // Update local state immediately
        setPost(prev => {
          console.log('Updating state from:', prev?.approved, 'to: true');
          return prev ? {...prev, approved: true} : null;
        });
        
        // Also refetch to ensure we have the latest data from the server
        fetchPost();
        
        toast.success("Post approved successfully!");
      } else {
        toast.error(result.error || "Failed to approve post");
      }
    } catch (err) {
      toast.error("An error occurred while approving the post");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReject = async () => {
    if (!post) return;
    
    try {
      setIsSubmitting(true);
      console.log('Rejecting post:', post.id);
      const result = await rejectPost(post.id, rejectionFeedback);
      console.log('Rejection result:', result);
      
      if (result.success) {
        // Update local state immediately
        setPost(prev => {
          console.log('Updating state from:', prev?.approved, 'to: false');
          return prev ? {...prev, approved: false} : null;
        });
        
        // Also refetch to ensure we have the latest data from the server
        fetchPost();
        
        setShowRejectModal(false);
        toast.success("Post rejected successfully");
      } else {
        toast.error(result.error || "Failed to reject post");
      }
    } catch (err) {
      toast.error("An error occurred while rejecting the post");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>Loading...</div>;
  }
  
  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
        <p>{error || 'Post not found'}</p>
        <button 
          onClick={() => router.push('/dashboard')}
          style={{
            backgroundColor: '#5552fe',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            marginTop: '10px',
            cursor: 'pointer'
          }}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const containerStyle = {
    maxWidth: '1024px',
    margin: '0 auto',
    padding: '0 20px',
    color: 'white',
  };
  
  // Simple reject modal
  const RejectModal = () => {
    if (!showRejectModal) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#14122a',
          padding: '24px',
          borderRadius: '12px',
          width: '90%',
          maxWidth: '500px',
          border: '1px solid #2c2846',
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Rejection Feedback</h3>
          <p style={{ marginBottom: '12px', color: '#a090e9', fontSize: '14px' }}>
            Please provide feedback on why this post was rejected:
          </p>
          
          <textarea
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
            style={{
              width: '100%',
              minHeight: '100px',
              backgroundColor: '#0d0c1d',
              border: '1px solid #2c2846',
              borderRadius: '8px',
              padding: '12px',
              color: 'white',
              marginBottom: '16px',
              resize: 'vertical',
            }}
            placeholder="What needs to be improved?"
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={() => setShowRejectModal(false)}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid #2c2846',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={isSubmitting}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: isSubmitting ? 'default' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Rejecting...' : 'Reject Post'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, rgba(10, 8, 26, 0.8) 0%, rgba(10, 8, 26, 1) 100%)'
    }}>
      <div style={containerStyle}>
        <div style={{ display: 'flex', padding: '20px 0', marginBottom: '10px' }}>
          <Link 
            href="/dashboard" 
            style={{ 
              marginRight: '20px', 
              fontSize: '14px',
              color: '#a090e9', 
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={14} style={{ marginRight: '4px' }} />
            Back to Dashboard
          </Link>
          <Link 
            href={`/edit/${post.id}`} 
            style={{ 
              fontSize: '14px',
              color: '#a090e9',
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none'
            }}
          >
            <Edit size={14} style={{ marginRight: '4px' }} />
            Edit Post
          </Link>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Post Details</h1>
          <ApprovalStatusBadge approved={post.approved} variant="large" />
        </div>
        
        {post.imageUrl && (
          <div style={{ marginBottom: '24px' }}>
            <img 
              src={post.imageUrl} 
              alt={post.prompt} 
              style={{ 
                width: '100%', 
                maxHeight: '500px',
                objectFit: 'cover',
                borderRadius: '8px'
              }} 
            />
          </div>
        )}
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Content</h2>
          <p style={{ marginBottom: '16px', lineHeight: '1.5' }}>{post.content}</p>
          
          <div className="flex justify-end mb-4">
            {/* Only show tone and status if post is not approved */}
            {!post.approved && (
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-gray-400">{post.tone || 'casual'}</div>
                <ApprovalStatusBadge approved={post.approved} variant="detail" />
              </div>
            )}
          </div>
          
          {post.hashtags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {post.hashtags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(85, 82, 254, 0.2)',
                    color: '#a090e9',
                    padding: '4px 10px',
                    borderRadius: '15px',
                    fontSize: '12px'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Status-based action buttons */}
          {post.approved === null && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="w-full"
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'default' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Approve'}
              </button>
              
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isSubmitting}
                className="w-full"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'default' : 'pointer',
                  opacity: isSubmitting ? 0.7 : 1,
                  width: '100%',
                  maxWidth: '200px'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Reject'}
              </button>
            </div>
          )}
          
          {post.approved === true && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginTop: '24px',
              padding: '12px 16px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <span style={{ color: '#10b981', fontWeight: '500' }}>This post has been approved</span>
            </div>
          )}
          
          {post.approved === false && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginTop: '24px',
              padding: '12px 16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <span style={{ color: '#ef4444', fontWeight: '500' }}>This post has been rejected</span>
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Export Options</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '8px',
            marginBottom: '16px'
          }}>
            <button style={{ 
              padding: '16px 0',
              border: '1px solid #2c2846',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#14122a',
              color: 'white',
              cursor: 'pointer',
              height: '80px'
            }}>
              <Copy size={18} style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '12px' }}>Copy to Clipboard</span>
            </button>
            
            <button style={{ 
              padding: '16px 0',
              border: '1px solid #2c2846',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#14122a',
              color: 'white',
              cursor: 'pointer',
              height: '80px'
            }}>
              <Download size={18} style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '12px' }}>Download</span>
            </button>
            
            <button style={{ 
              padding: '16px 0',
              border: '1px solid #2c2846',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#14122a',
              color: 'white',
              cursor: 'pointer',
              height: '80px'
            }}>
              <Share size={18} style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '12px' }}>Share Link</span>
            </button>
            
            <button style={{ 
              padding: '16px 0',
              border: '1px solid #2c2846',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#14122a',
              color: 'white',
              cursor: 'pointer',
              height: '80px'
            }}>
              <Calendar size={18} style={{ marginBottom: '6px' }} />
              <span style={{ fontSize: '12px' }}>Schedule Post</span>
            </button>
          </div>
          
          <div style={{ 
            border: '1px solid #2c2846',
            borderRadius: '12px',
            padding: '24px',
            background: 'linear-gradient(to bottom, #14122a, #0F0D22)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                marginBottom: '12px',
                color: 'white',
                fontWeight: '500'
              }}>
                Platform
              </label>
              <div style={{
                position: 'relative'
              }}>
                <select style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  backgroundColor: 'rgba(10, 8, 26, 0.8)',
                  border: '1px solid #2c2846',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: 'white',
                  height: '50px',
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}>
                  <option value="" style={{ backgroundColor: '#0a081a' }}>Select a platform</option>
                  <option value="twitter" style={{ backgroundColor: '#0a081a' }}>Twitter</option>
                  <option value="instagram" style={{ backgroundColor: '#0a081a' }}>Instagram</option>
                  <option value="facebook" style={{ backgroundColor: '#0a081a' }}>Facebook</option>
                  <option value="linkedin" style={{ backgroundColor: '#0a081a' }}>LinkedIn</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6L8 10L12 6" stroke="#a090e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  marginBottom: '12px',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Date
                </label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input 
                    type="text" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      backgroundColor: '#0d0c1d',
                      border: '1px solid #2c2846',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: 'white',
                      height: '50px',
                      outline: 'none'
                    }}
                    placeholder="mm/dd/yyyy"
                  />
                </div>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '16px', 
                  marginBottom: '12px',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  Time
                </label>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input 
                    type="text" 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      backgroundColor: '#0d0c1d',
                      border: '1px solid #2c2846',
                      borderRadius: '8px',
                      fontSize: '16px',
                      color: 'white',
                      height: '50px',
                      outline: 'none'
                    }}
                    placeholder="--:-- --"
                  />
                </div>
              </div>
            </div>
            
            <button style={{ 
              width: '100%',
              padding: '14px',
              backgroundColor: '#5552fe',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '50px',
              boxShadow: '0 2px 10px rgba(85, 82, 254, 0.3)',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              Schedule Post
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Rate this Post</h2>
          
          <div style={{ 
            border: '1px solid #2c2846',
            borderRadius: '12px',
            padding: '24px',
            background: 'linear-gradient(to bottom, #14122a, #0F0D22)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
          }}>
            <p style={{ 
              fontSize: '16px', 
              color: '#a090e9', 
              marginBottom: '20px',
              fontWeight: '500'
            }}>
              How would you rate this post?
            </p>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '20px',
              marginBottom: '28px'
            }}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    fontSize: '36px',
                    color: rating && rating >= value ? '#FFD700' : '#2c2846',
                    transition: 'transform 0.1s ease',
                    transform: rating === value ? 'scale(1.1)' : 'scale(1)'
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '16px', 
                marginBottom: '12px',
                color: 'white',
                fontWeight: '500'
              }}>
                Comments (optional)
              </label>
              <div style={{ 
                backgroundColor: '#0d0c1d', 
                borderRadius: '8px',
                padding: '0',
                position: 'relative',
                border: '1px solid #2c2846'
              }}>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this post..."
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    color: 'white',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: '1.5'
                  }}
                ></textarea>
              </div>
              <div style={{ 
                textAlign: 'right',
                fontSize: '14px',
                color: '#a090e9',
                marginTop: '8px',
                paddingRight: '4px'
              }}>
                {comment.length}/500
              </div>
            </div>
            
            <button style={{ 
              width: '100%',
              padding: '14px',
              backgroundColor: '#5552fe',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              height: '50px',
              boxShadow: '0 2px 10px rgba(85, 82, 254, 0.3)',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              position: 'relative',
              overflow: 'hidden'
            }}>
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
      
      {/* Render the reject modal */}
      <RejectModal />
    </div>
  );
} 