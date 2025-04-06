"use client"

import { useState } from "react"
import { SparklesIcon } from "lucide-react"
import { useChat } from "ai/react"

export function PostForm() {
  const [activeTab, setActiveTab] = useState("create")
  const [prompt, setPrompt] = useState("")
  const [platform, setPlatform] = useState("instagram")
  const [tone, setTone] = useState("professional")

  const { messages, isLoading, handleSubmit: handleChatSubmit } = useChat({
    api: '/api/chat',
    body: {
      topic: prompt,
      tone,
      platform
    },
    onResponse: (response) => {
      console.log('Response received', response)
      setActiveTab("preview")
    },
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    handleChatSubmit(e)
  }

  return (
    <div style={{
      borderRadius: "16px",
      overflow: "hidden",
      padding: "4px",
      position: "relative",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
      backgroundColor: "rgba(20, 15, 35, 0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(91, 77, 168, 0.2)",
    }}>
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        opacity: 0.1,
        pointerEvents: "none",
        background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
        borderRadius: "inherit"
      }} />
      
      {/* Tabs */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "100%",
        marginBottom: "16px",
        position: "relative",
        zIndex: 1,
        backgroundColor: "rgba(22, 18, 50, 0.25)"
      }}>
        <button 
          onClick={() => setActiveTab("create")}
          style={{
            padding: "12px 16px",
            background: activeTab === "create" ? "rgba(31, 25, 56, 0.4)" : "transparent",
            border: "none",
            cursor: "pointer",
            color: activeTab === "create" ? "transparent" : "rgba(255, 255, 255, 0.6)",
            fontWeight: "500",
            fontSize: "16px",
            backgroundImage: activeTab === "create" 
              ? "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)" 
              : "none",
            backgroundClip: activeTab === "create" ? "text" : "none",
            WebkitBackgroundClip: activeTab === "create" ? "text" : "none",
          }}
        >
          Create Post
        </button>
        <button 
          onClick={() => setActiveTab("preview")}
          disabled={!prompt.trim()}
          style={{
            padding: "12px 16px",
            background: activeTab === "preview" ? "rgba(31, 25, 56, 0.4)" : "transparent",
            border: "none",
            cursor: !prompt.trim() ? "not-allowed" : "pointer",
            color: activeTab === "preview" ? "transparent" : "rgba(255, 255, 255, 0.6)",
            opacity: !prompt.trim() ? 0.5 : 1,
            fontWeight: "500",
            fontSize: "16px",
            backgroundImage: activeTab === "preview" 
              ? "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)" 
              : "none",
            backgroundClip: activeTab === "preview" ? "text" : "none",
            WebkitBackgroundClip: activeTab === "preview" ? "text" : "none",
          }}
        >
          Preview
        </button>
      </div>
      
      {/* Create Form */}
      {activeTab === "create" && (
        <div style={{ padding: "24px", position: "relative", zIndex: 1 }}>
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label 
                htmlFor="prompt" 
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "transparent",
                  backgroundImage: "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                }}
              >
                What would you like to post about?
              </label>
              <input
                id="prompt"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Announce our summer collection with beach vibes"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  height: "48px",
                  backgroundColor: "rgba(22, 18, 50, 0.3)",
                  border: "1px solid rgba(91, 77, 168, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "16px",
                  outline: "none",
                }}
                required
              />
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: "16px",
              marginBottom: "32px" 
            }}>
              <div>
                <label 
                  htmlFor="platform" 
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "transparent",
                    backgroundImage: "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Platform
                </label>
                <select
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    height: "40px",
                    backgroundColor: "rgba(22, 18, 50, 0.3)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px"
                  }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              
              <div>
                <label 
                  htmlFor="tone" 
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "transparent",
                    backgroundImage: "linear-gradient(to right, #ea4c89, #8f4bde, #4668ea)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Tone
                </label>
                <select
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    height: "40px",
                    backgroundColor: "rgba(22, 18, 50, 0.3)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                    backgroundSize: "16px"
                  }}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="exciting">Exciting</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative" }}>
                <div 
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "9999px",
                    opacity: 0.3,
                    animation: "pulse-glow 4s infinite ease-in-out",
                    boxShadow: "0 0 20px rgba(143, 75, 222, 0.5), 0 0 40px rgba(70, 104, 234, 0.3)"
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "16px 32px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(143, 75, 222, 0.15)",
                    border: "1px solid rgba(143, 75, 222, 0.3)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: !prompt.trim() ? "not-allowed" : "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    opacity: !prompt.trim() ? 0.7 : 1,
                  }}
                >
                  <SparklesIcon size={20} />
                  {isLoading ? "Generating..." : "Generate Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div style={{ padding: "24px", color: "white", position: "relative", zIndex: 1 }}>
          {messages.length > 1 ? (
            <div>
              <pre style={{ 
                whiteSpace: "pre-wrap",
                fontSize: "15px",
                fontFamily: "inherit",
                backgroundColor: "rgba(31, 25, 56, 0.4)",
                padding: "16px",
                borderRadius: "8px",
                maxHeight: "400px",
                overflow: "auto"
              }}>
                {messages[messages.length - 1].content}
              </pre>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                marginTop: "24px", 
                gap: "16px" 
              }}>
                <button
                  onClick={() => setActiveTab("create")}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(31, 25, 56, 0.4)",
                    border: "1px solid rgba(91, 77, 168, 0.3)",
                    color: "#a7a3bc",
                    cursor: "pointer"
                  }}
                >
                  Edit Prompt
                </button>
                
                <button
                  style={{
                    padding: "12px 24px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(143, 75, 222, 0.15)",
                    border: "1px solid rgba(143, 75, 222, 0.3)",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Copy Content
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#a7a3bc" 
            }}>
              {isLoading ? (
                <p>Generating your post...</p>
              ) : (
                <p>Generate a post to see the preview.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 