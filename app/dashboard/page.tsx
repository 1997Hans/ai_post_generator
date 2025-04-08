'use client';

import React from 'react';
import { PostHistoryList } from '@/components/history/PostHistoryList';
import Link from 'next/link';
import { PlusCircle, Lightbulb, AlertCircle, CheckCircle, EyeIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllPosts } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';

export default function DashboardPage() {
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);
  const [showHelpDetails, setShowHelpDetails] = useState(false);
  
  // Function to notify user about potential database changes
  const showRefreshReminder = () => {
    setShowRefreshAlert(true);
  };

  // Fetch posts from database on initial load
  useEffect(() => {
    async function loadPostsFromDb() {
      try {
        console.log('Loading posts from database...');
        const response = await fetch(`/api/posts`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const posts = await response.json();
        console.log(`Loaded ${posts.length} posts from database`);
        setDbPosts(posts);
      } catch (error) {
        console.error('Failed to load posts from database:', error);
        try {
          // Fallback to regular function if API fails
          const posts = await getAllPosts();
          setDbPosts(posts);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPostsFromDb();
  }, []);

  return (
    <div style={{ 
      padding: "48px 24px", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      width: "100%",
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "8px"
          }}>Dashboard</h1>
          <p style={{
            color: "#a7a3bc",
            fontSize: "16px"
          }}>Manage and track all your generated posts</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#7c3aed",
              color: "white",
              padding: "10px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
              textDecoration: "none"
            }}
          >
            <PlusCircle size={16} style={{ marginRight: "8px" }} />
            Create New Post
          </Link>
        </div>
      </div>
      
      {/* Refresh alert when database changes might have occurred */}
      {showRefreshAlert && (
        <div style={{
          backgroundColor: "rgba(74, 222, 128, 0.1)",
          border: "1px solid rgba(74, 222, 128, 0.2)",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <CheckCircle size={16} style={{ color: "#10b981" }} />
          <p style={{ fontSize: "14px", color: "#10b981", margin: 0 }}>
            Status change saved successfully! The post status will remain the same even if you close or refresh the app.
          </p>
          <button
            onClick={() => setShowRefreshAlert(false)}
            style={{
              marginLeft: "auto",
              padding: "6px 12px",
              backgroundColor: "transparent",
              color: "#10b981",
              border: "1px solid #10b981",
              borderRadius: "4px",
              fontSize: "12px",
              cursor: "pointer"
            }}
          >
            Dismiss
          </button>
        </div>
      )}
      
      {/* Enhanced Social Media Manager Instructions */}
      <div style={{
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
      }}>
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px"
        }}>
          <Lightbulb style={{ color: "#7c3aed", marginTop: "2px" }} size={20} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
              Social Media Manager Approval Guide
            </h3>
            <p style={{ fontSize: "14px", color: "#a7a3bc", lineHeight: "1.6" }}>
              You can now approve or reject posts directly from this dashboard! Each post card has <span style={{ color: "#4ade80" }}>Approve</span> and <span style={{ color: "#ef4444" }}>Reject</span> buttons to quickly review content. 
              Click the eye icon on any post to view details and provide feedback when rejecting content.
            </p>
          </div>
          <button 
            onClick={() => setShowHelpDetails(!showHelpDetails)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(124, 58, 237, 0.2)",
              color: "#a7a3bc",
              border: "none",
              borderRadius: "6px",
              padding: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s, color 0.2s",
            }}
            aria-label={showHelpDetails ? "Hide detailed guide" : "Show detailed guide"}
            title={showHelpDetails ? "Hide detailed guide" : "Show detailed guide"}
          >
            {showHelpDetails ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        
        {showHelpDetails && (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "16px",
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "rgba(124, 58, 237, 0.05)",
            borderRadius: "6px",
            animation: "fadeIn 0.3s ease-in-out",
          }}>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#7c3aed", color: "white", width: "20px", height: "20px", borderRadius: "50%", marginRight: "8px", fontSize: "12px" }}>1</span>
                From the Dashboard
              </h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "28px" }}>
                <li style={{ fontSize: "14px", color: "#a7a3bc", marginBottom: "4px" }}>
                  Each post card has <span style={{ color: "#4ade80" }}>Approve</span> and <span style={{ color: "#ef4444" }}>Reject</span> buttons
                </li>
                <li style={{ fontSize: "14px", color: "#a7a3bc" }}>
                  Take action without opening the post details
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#7c3aed", color: "white", width: "20px", height: "20px", borderRadius: "50%", marginRight: "8px", fontSize: "12px" }}>2</span>
                From Post Details
              </h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "28px" }}>
                <li style={{ fontSize: "14px", color: "#a7a3bc", marginBottom: "4px" }}>
                  Click the <EyeIcon style={{ display: "inline", width: "14px", height: "14px", verticalAlign: "middle", marginRight: "2px" }} /> icon to view post details
                </li>
                <li style={{ fontSize: "14px", color: "#a7a3bc", marginBottom: "4px" }}>
                  Use the larger approval buttons in the detailed view
                </li>
                <li style={{ fontSize: "14px", color: "#a7a3bc" }}>
                  Leave feedback when rejecting a post
                </li>
              </ul>
            </div>
            
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "500", color: "white", marginBottom: "8px", display: "flex", alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "#7c3aed", color: "white", width: "20px", height: "20px", borderRadius: "50%", marginRight: "8px", fontSize: "12px" }}>3</span>
                Status Indicators
              </h4>
              <ul style={{ listStyleType: "disc", paddingLeft: "28px" }}>
                <li style={{ fontSize: "14px", color: "#a7a3bc", marginBottom: "4px" }}>
                  <span style={{ color: "#f59e0b" }}>Pending</span> - Awaiting review
                </li>
                <li style={{ fontSize: "14px", color: "#a7a3bc", marginBottom: "4px" }}>
                  <span style={{ color: "#4ade80" }}>Approved</span> - Ready for publishing
                </li>
                <li style={{ fontSize: "14px", color: "#a7a3bc" }}>
                  <span style={{ color: "#ef4444" }}>Rejected</span> - Needs improvements
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ flex: 1, position: "relative" }}>
        <PostHistoryList 
          dbPosts={dbPosts} 
          isDbLoading={isLoading}
          onStatusChange={() => {
            // Show alert to remind user to refresh without automatic refresh
            showRefreshReminder();
            // NO AUTOMATIC REFRESH - removed the setTimeout call
          }}
        />
      </div>
    </div>
  );
} 