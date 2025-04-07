'use client';

import { PostHistoryList } from '@/components/history/PostHistoryList';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllPosts } from '@/app/actions/db-actions';
import { Post } from '@/lib/types';

export default function DashboardPage() {
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch posts from database
  useEffect(() => {
    async function loadPostsFromDb() {
      try {
        console.log('Loading posts from database...');
        const posts = await getAllPosts();
        console.log(`Loaded ${posts.length} posts from database`);
        setDbPosts(posts);
      } catch (error) {
        console.error('Failed to load posts from database:', error);
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
      
      <div style={{ flex: 1, position: "relative" }}>
        <PostHistoryList 
          dbPosts={dbPosts} 
          isDbLoading={isLoading} 
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