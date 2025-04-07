'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPost } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';

export default function PostPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const postId = unwrappedParams.id;
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }
  
  if (error || !post) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>{error || 'Post not found'}</p>
        <button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <Link href="/dashboard" style={{ marginRight: '20px', fontSize: '14px' }}>
          Back to Dashboard
        </Link>
        <Link href={`/edit/${post.id}`} style={{ fontSize: '14px' }}>
          Edit Post
        </Link>
      </div>
      
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Post Details</h1>
      
      {post.imageUrl && (
        <div style={{ marginBottom: '20px' }}>
          <img 
            src={post.imageUrl} 
            alt={post.prompt} 
            style={{ 
              width: '100%', 
              maxHeight: '500px',
              objectFit: 'cover'
            }} 
          />
        </div>
      )}
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Content</h2>
        <p style={{ marginBottom: '15px' }}>{post.content}</p>
        
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          <span style={{ marginRight: '20px' }}>Tone: {post.tone || 'casual'}</span>
          <span>Style: {post.visualStyle || 'cinematic'}</span>
        </div>
        
        {post.hashtags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '15px' }}>
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: 'inherit',
                  padding: '3px 8px',
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
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px' }}>Export Options</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button style={{ 
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent'
          }}>
            <span style={{ fontSize: '12px', marginTop: '5px' }}>Copy to Clipboard</span>
          </button>
          
          <button style={{ 
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent'
          }}>
            <span style={{ fontSize: '12px', marginTop: '5px' }}>Download</span>
          </button>
          
          <button style={{ 
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent'
          }}>
            <span style={{ fontSize: '12px', marginTop: '5px' }}>Share Link</span>
          </button>
          
          <button style={{ 
            padding: '10px',
            border: '1px solid #333',
            borderRadius: '5px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'transparent'
          }}>
            <span style={{ fontSize: '12px', marginTop: '5px' }}>Schedule Post</span>
          </button>
        </div>
        
        <div style={{ 
          border: '1px solid #333',
          borderRadius: '5px',
          padding: '15px',
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
              Platform
            </label>
            <select style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#222',
              border: '1px solid #333',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              <option value="">Select a platform</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
                Date
              </label>
              <input 
                type="date" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  backgroundColor: '#222',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
                Time
              </label>
              <input 
                type="time" 
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  backgroundColor: '#222',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
          
          <button style={{ 
            width: '100%',
            padding: '10px',
            backgroundColor: '#5552fe',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'medium'
          }}>
            Schedule Post
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Rate this Post</h2>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          How would you rate this post?
        </p>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '5px',
                cursor: 'pointer'
              }}
            >
              ★
            </button>
          ))}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>
            Comments (optional)
          </label>
          <textarea
            rows={3}
            placeholder="Share your thoughts about this post..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#222',
              border: '1px solid #333',
              borderRadius: '5px',
              fontSize: '14px',
              resize: 'none'
            }}
          ></textarea>
          <div style={{ textAlign: 'right', fontSize: '12px', color: '#666', marginTop: '5px' }}>
            0/500
          </div>
        </div>
        
        <button style={{ 
          width: '100%',
          padding: '10px',
          backgroundColor: '#5552fe',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 'medium'
        }}>
          Submit Feedback
        </button>
      </div>
    </div>
  );
} 