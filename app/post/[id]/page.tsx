'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPost } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';
import { ArrowLeft, Edit, Copy, Download, Share, Calendar, Star } from 'lucide-react';

export default function PostPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.id;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const router = useRouter();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await getPost(postId);
        
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
            updatedAt: response.post.updated_at || new Date().toISOString()
          };
          
          setPost(normalizedPost);
        } else {
          setError(response.error || 'Post not found');
        }
      } catch (err) {
        setError('Error loading post data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
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
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Post Details</h1>
        
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
          
          <div style={{ fontSize: '14px', color: '#a090e9', marginBottom: '16px' }}>
            <span style={{ marginRight: '20px' }}>Tone: {post.tone || 'professional'}</span>
            <span>Style: {post.visualStyle || 'realistic'}</span>
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
    </div>
  );
} 