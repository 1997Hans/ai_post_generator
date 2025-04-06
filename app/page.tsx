import { Header } from "@/components/header";
import { PostForm } from "@/components/post-form";
import { StarField } from "@/components/star-field";

export default function Home() {
  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#0a081a" 
    }}>
      <StarField />
      <Header />
      <div style={{ 
        flex: 1, 
        padding: "48px 24px", 
        maxWidth: "1200px", 
        margin: "0 auto", 
        width: "100%",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          textAlign: "center",
          position: "relative",
          zIndex: 10
        }}>
          <h1 style={{
            fontSize: "64px",
            fontWeight: "700",
            margin: "24px 0",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            backgroundImage: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            animation: "float 6s infinite ease-in-out",
            textShadow: "0 0 40px rgba(143, 75, 222, 0.1)"
          }}>
            SOCIAL MEDIA<br/>POST GENERATOR
          </h1>
          
          <p style={{
            fontSize: "20px",
            color: "#a7a3bc",
            margin: "24px 0 40px 0"
          }}>
            Create engaging, professional social media content with AI assistance
          </p>
          
          <PostForm />
        </div>
      </div>
    </main>
  );
}