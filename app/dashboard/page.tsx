'use client';

import React from 'react';
import { PostHistoryList } from '@/components/history/PostHistoryList';
import Link from 'next/link';
import { PlusCircle, Lightbulb, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllPosts } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';
import { ApprovalHelpTooltip } from '@/components/post/PostDetailHeader';

export default function DashboardPage() {
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);
  const [lastRefreshTimeDisplay, setLastRefreshTimeDisplay] = useState('');
  
  // Function to refresh data from database
  const refreshData = () => {
    console.log('Refreshing data from database...');
    setIsLoading(true);
    setRefreshTrigger(prev => prev + 1);
    setLastRefresh(new Date());
    setShowRefreshAlert(false);
  };
  
  // Function to force refresh with no caching
  const forceRefreshData = async () => {
    try {
      console.log('Force refreshing data with no cache...');
      setIsLoading(true);
      
      // Generate timestamp within the function call to avoid hydration issues
      // This is safe because it's called directly from a user action
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/posts?nocache=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        next: { revalidate: 0 }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const posts = await response.json();
      console.log(`Force-loaded ${posts.length} posts from database:`, posts);
      
      // Log each post's approval status
      posts.forEach(post => {
        console.log(`[Dashboard] Post ${post.id}: approved=${post.approved}, Type: ${typeof post.approved}`);
      });
      
      setDbPosts(posts);
      setLastRefresh(new Date());
      setShowRefreshAlert(false);
    } catch (error) {
      console.error('Failed to force-refresh posts:', error);
      alert('Failed to refresh posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch posts from database on initial load and when triggered
  useEffect(() => {
    async function loadPostsFromDb() {
      try {
        console.log('Loading posts from database...');
        // Move the timestamp generation inside useEffect to avoid hydration mismatches
        const cacheBuster = `?timestamp=${new Date().getTime()}`;
        const response = await fetch(`/api/posts${cacheBuster}`, {
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
  }, [refreshTrigger]);
  
  // Function to notify user about potential database changes
  const showRefreshReminder = () => {
    setShowRefreshAlert(true);
  };

  // Update the time display on client-side only
  useEffect(() => {
    setLastRefreshTimeDisplay(lastRefresh.toLocaleTimeString());
  }, [lastRefresh]);

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
          <button 
            onClick={refreshData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(124, 58, 237, 0.1)",
              color: "#7c3aed",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <RefreshCw size={14} 
              className={isLoading ? "animate-spin" : ""} 
            />
            {isLoading ? "Refreshing..." : "Refresh from Database"}
          </button>
          
          <button 
            onClick={forceRefreshData}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <RefreshCw size={14} 
              className={isLoading ? "animate-spin" : ""} 
            />
            Force Reload
          </button>
          
          <ApprovalHelpTooltip />
          
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
      
      {/* Last refresh timestamp */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        fontSize: "12px",
        color: "#a7a3bc",
        marginBottom: "8px",
        gap: "8px"
      }}>
        <span>Last database sync: {lastRefreshTimeDisplay}</span>
        <span style={{ color: "#7c3aed", cursor: "help" }} title="The dashboard always shows data from the database. Refresh to see the latest changes.">ⓘ</span>
      </div>
      
      {/* Social Media Manager Instructions */}
      <div style={{
        backgroundColor: "rgba(124, 58, 237, 0.1)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}>
        <Lightbulb style={{ color: "#7c3aed", marginTop: "2px" }} size={20} />
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
            Social Media Manager Approval Guide
          </h3>
          <p style={{ fontSize: "14px", color: "#a7a3bc", lineHeight: "1.6" }}>
            You can now approve or reject posts directly from this dashboard! Each post card has <span style={{ color: "#4ade80" }}>Approve</span> and <span style={{ color: "#ef4444" }}>Reject</span> buttons to quickly review content. 
            Click the eye icon on any post to view details and provide feedback when rejecting content.
            <br/><br/>
            <strong style={{ color: "#7c3aed" }}>Important:</strong> All post statuses are stored in the database. When you approve or reject a post, you'll need to click "Refresh from Database" to ensure you're seeing the latest data.
          </p>
        </div>
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

      <style jsx global>{`
        /* Add animation for the loading spinner */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 