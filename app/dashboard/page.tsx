import { PostHistoryList } from '@/components/history/PostHistoryList';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div style={{ 
      padding: "48px 24px", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      width: "100%"
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{
            fontSize: "36px",
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
            padding: "8px 16px",
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
      
      <div>
        <PostHistoryList />
      </div>
    </div>
  );
} 