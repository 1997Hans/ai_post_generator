"use client"

import { useState } from "react"
import { SparklesIcon, CheckCircle } from "lucide-react"
import { savePost } from "@/app/actions/db-actions"
import { useToast } from "@/lib/hooks/useToast"

export function PostForm() {
  const [activeTab, setActiveTab] = useState("create")
  const [prompt, setPrompt] = useState("")
  const [platform, setPlatform] = useState("facebook")
  const [tone, setTone] = useState("friendly")
  const [visualStyle, setVisualStyle] = useState("realistic")
  const [errorMsg, setErrorMsg] = useState("")
  const [result, setResult] = useState<any>(null)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [savedPostId, setSavedPostId] = useState<string | null>(null)
  
  // Use toast for notifications
  const { showSuccess, showError } = useToast()

  // Use the direct fetch approach first to debug
  const [isLoading, setIsLoading] = useState(false)

  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        showSuccess("Copied to clipboard");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Handle saving post to database
  const handleSavePost = async () => {
    if (!result) return;
    
    try {
      setSaveStatus("saving");
      
      const postData = {
        content: result.mainContent,
        imageUrl: result.imageUrl || '',
        hashtags: result.hashtags || [],
        prompt: prompt,
        refinedPrompt: result.visualPrompt || null,
        tone: tone,
        visualStyle: visualStyle
      };
      
      console.log('Saving post to database:', postData);
      
      const { success, postId, error } = await savePost(postData);
      
      if (success && postId) {
        setSaveStatus("saved");
        setSavedPostId(postId);
        showSuccess("Post saved to database");
      } else {
        throw new Error(error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setSaveStatus("idle");
      showError("Failed to save post", error.message);
    }
  };

  // Handle image download
  const handleImageDownload = () => {
    if (!result?.imageUrl) return;
    
    // Create a filename based on the prompt
    const filename = `${prompt.trim().substring(0, 20).replace(/\s+/g, '-').toLowerCase()}-${new Date().getTime()}.jpg`;
    
    // Check if it's a data URL (base64)
    if (result.imageUrl.startsWith('data:image')) {
      // For data URLs
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For regular URLs, fetch the image first
      fetch(result.imageUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
          console.error('Error downloading image:', error);
        });
    }
  };

  // Direct fetch function to manually control the API call
  const generatePost = async () => {
    if (!prompt.trim()) return
    
    console.log('Generating post with:', { prompt, tone, platform, visualStyle })
    setIsLoading(true)
    setErrorMsg("")
    
    try {
      // Try to make the API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: prompt,
          tone,
          platform,
          visualStyle,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate content. Status: ' + response.status)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data && data.content) {
        try {
          // Parse the JSON content from the response
          const parsedContent = JSON.parse(data.content);
          setResult(parsedContent);
          setActiveTab("preview");
        } catch (parseError) {
          console.error('Error parsing response JSON:', parseError);
          useLocalMockData();
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating post:', error)
      // Use mock data instead of showing error
      useLocalMockData();
    } finally {
      setIsLoading(false)
    }
  }

  // Fallback to local mock data if API fails
  const useLocalMockData = () => {
    console.log('Using local mock data for:', prompt);
    
    // Simple mock data based on the prompt
    const mockResult = {
      mainContent: `Here's a compelling post about "${prompt}". This would typically be generated by AI, but we're using mock data for now.`,
      caption: `${prompt} - Discover more about this exciting topic!`,
      hashtags: [
        prompt.replace(/\s+/g, ''),
        "SocialMedia",
        "ContentCreation", 
        "DigitalMarketing"
      ],
      imageUrl: "https://via.placeholder.com/600x400?text=Sample+Image",
      visualPrompt: `A beautiful visual representing ${prompt}`
    };
    
    setResult(mockResult);
    setActiveTab("preview");
  }

  // Reset the form to create a new post
  const handleReset = () => {
    setPrompt("");
    setResult(null);
    setSaveStatus("idle");
    setSavedPostId(null);
    setActiveTab("create");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault()
    generatePost()
  }

  return (
    <div>
      {/* Error message display */}
      {errorMsg && (
        <div style={{
          padding: "12px 16px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "rgba(220, 38, 38, 0.1)", 
          border: "1px solid rgba(220, 38, 38, 0.2)",
          color: "#ef4444"
        }}>
          <p>{errorMsg}</p>
        </div>
      )}
    
      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        borderBottom: "1px solid rgba(91, 77, 168, 0.2)",
        marginBottom: "24px"
      }}>
        <button
          onClick={() => setActiveTab("create")}
          style={{
            padding: "12px 16px",
            fontWeight: activeTab === "create" ? "600" : "400",
            color: activeTab === "create" ? "#8f4bde" : "#a7a3bc",
            borderBottom: activeTab === "create" ? "2px solid #8f4bde" : "2px solid transparent",
            background: "none",
            borderLeft: "none", 
            borderRight: "none",
            borderTop: "none",
            cursor: "pointer"
          }}
        >
          Create Post
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          disabled={!result}
          style={{
            padding: "12px 16px",
            fontWeight: activeTab === "preview" ? "600" : "400",
            color: activeTab === "preview" ? "#8f4bde" : "#a7a3bc",
            borderBottom: activeTab === "preview" ? "2px solid #8f4bde" : "2px solid transparent",
            background: "none",
            borderLeft: "none", 
            borderRight: "none",
            borderTop: "none",
            cursor: result ? "pointer" : "not-allowed",
            opacity: result ? 1 : 0.5
          }}
        >
          Preview
        </button>
      </div>
      
      {/* Create Tab */}
      {activeTab === "create" && (
        <div style={{ maxWidth: "100%" }}>
          <form 
            onSubmit={handleFormSubmit}
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0",
              display: "flex",
              flexDirection: "column",
              gap: "32px"
            }}
          >
            <div style={{ width: "100%" }}>
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                marginBottom: "12px",
                color: "#d8d4ea"
              }}>
                What would you like to post about?
              </h2>
              <div style={{ position: "relative", width: "100%" }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., New product launch, Summer collection, Eco-friendly initiative, Company milestone..."
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "white",
                    fontSize: "16px",
                    minHeight: "120px",
                    resize: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              width: "100%"
            }}>
              <div>
                <h2 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Platform
                </h2>
                <div style={{ position: "relative", width: "100%" }}>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(29, 23, 52, 0.5)",
                      border: "1px solid rgba(91, 77, 168, 0.2)",
                      color: "white",
                      fontSize: "16px",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%238f4bde' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      fontFamily: "inherit",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
              </div>

              <div>
                <h2 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Tone
                </h2>
                <div style={{ position: "relative", width: "100%" }}>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(29, 23, 52, 0.5)",
                      border: "1px solid rgba(91, 77, 168, 0.2)",
                      color: "white",
                      fontSize: "16px",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%238f4bde' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      fontFamily: "inherit",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="informative">Informative</option>
                  </select>
                </div>
              </div>

              <div>
                <h2 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Visual Style
                </h2>
                <div style={{ position: "relative", width: "100%" }}>
                  <select
                    value={visualStyle}
                    onChange={(e) => setVisualStyle(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(29, 23, 52, 0.5)",
                      border: "1px solid rgba(91, 77, 168, 0.2)",
                      color: "white",
                      fontSize: "16px",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%238f4bde' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      fontFamily: "inherit",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="realistic">Realistic Photo</option>
                    <option value="artistic">Artistic</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="illustrated">Illustrated</option>
                    <option value="cinematic">Cinematic</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
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
                    background: "linear-gradient(90deg, rgba(143, 75, 222, 0.8) 0%, rgba(70, 104, 234, 0.8) 100%)",
                    border: "1px solid rgba(143, 75, 222, 0.3)",
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: !prompt.trim() ? "not-allowed" : "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.2s ease",
                    opacity: !prompt.trim() ? 0.7 : 1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)"
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg 
                        className="animate-spin" 
                        style={{ 
                          width: "20px", 
                          height: "20px", 
                          marginRight: "8px" 
                        }} 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon style={{ width: "20px", height: "20px" }} />
                      Generate Post
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div>
          {result ? (
            <div>
              {/* Image display */}
              {result.imageUrl && (
                <div style={{ 
                  marginBottom: "24px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                  background: "linear-gradient(to bottom, rgba(29, 23, 52, 0.3), rgba(29, 23, 52, 0.6))",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: "550px"
                }}>
                  <img 
                    src={result.imageUrl} 
                    alt="Generated visual"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      maxWidth: "100%",
                      maxHeight: "550px",
                      display: "block"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    zIndex: 10
                  }}>
                    <button
                      onClick={handleImageDownload}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        fontSize: "14px",
                        cursor: "pointer",
                        backdropFilter: "blur(4px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              )}

              <div style={{ 
                backgroundColor: "rgba(29, 23, 52, 0.5)",
                border: "1px solid rgba(91, 77, 168, 0.2)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px"
              }}>
                <h3 style={{ 
                  fontSize: "18px", 
                  fontWeight: "600", 
                  marginBottom: "16px",
                  color: "#d8d4ea",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span>Main Content</span>
                  <button 
                    onClick={() => copyToClipboard(result.mainContent)}
                    style={{
                      backgroundColor: "rgba(143, 75, 222, 0.1)",
                      border: "1px solid rgba(143, 75, 222, 0.2)",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    Copy
                  </button>
                </h3>
                <p style={{ 
                  fontSize: "16px", 
                  lineHeight: "1.6",
                  color: "white"
                }}>
                  {result.mainContent}
                </p>
              </div>

              {result.caption && (
                <div style={{ 
                  backgroundColor: "rgba(29, 23, 52, 0.5)",
                  border: "1px solid rgba(91, 77, 168, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px"
                }}>
                  <h3 style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    marginBottom: "16px",
                    color: "#d8d4ea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <span>Caption</span>
                    <button 
                      onClick={() => copyToClipboard(result.caption)}
                      style={{
                        backgroundColor: "rgba(143, 75, 222, 0.1)",
                        border: "1px solid rgba(143, 75, 222, 0.2)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Copy
                    </button>
                  </h3>
                  <p style={{ 
                    fontSize: "16px", 
                    lineHeight: "1.6",
                    color: "white"
                  }}>
                    {result.caption}
                  </p>
                </div>
              )}

              {result.hashtags && result.hashtags.length > 0 && (
                <div style={{ 
                  backgroundColor: "rgba(29, 23, 52, 0.5)",
                  border: "1px solid rgba(91, 77, 168, 0.2)",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px"
                }}>
                  <h3 style={{ 
                    fontSize: "18px", 
                    fontWeight: "600", 
                    marginBottom: "16px",
                    color: "#d8d4ea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <span>Hashtags</span>
                    <button 
                      onClick={() => copyToClipboard(result.hashtags.map(h => `#${h}`).join(' '))}
                      style={{
                        backgroundColor: "rgba(143, 75, 222, 0.1)",
                        border: "1px solid rgba(143, 75, 222, 0.2)",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                    >
                      Copy
                    </button>
                  </h3>
                  <div style={{ 
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px"
                  }}>
                    {result.hashtags.map((tag, index) => (
                      <span 
                        key={index}
                        style={{
                          backgroundColor: "rgba(70, 104, 234, 0.1)",
                          border: "1px solid rgba(70, 104, 234, 0.2)",
                          borderRadius: "4px",
                          padding: "4px 8px",
                          fontSize: "14px",
                          color: "#a7a3bc"
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Save to Database Button */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                marginTop: "32px" 
              }}>
                {saveStatus === "saved" ? (
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    color: "rgb(16, 185, 129)",
                    fontSize: "16px"
                  }}>
                    <CheckCircle size={20} />
                    <span>Saved to Database</span>
                  </div>
                ) : (
                  <button
                    onClick={handleSavePost}
                    disabled={saveStatus === "saving"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(143, 75, 222, 0.15)",
                      border: "1px solid rgba(143, 75, 222, 0.3)",
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                      opacity: saveStatus === "saving" ? 0.7 : 1
                    }}
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H14L21 10V19C21 20.1046 20.1046 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 3V7H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Save to Database
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Create new post button (shows only after saving) */}
              {saveStatus === "saved" && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  marginTop: "16px" 
                }}>
                  <button
                    onClick={handleReset}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(91, 77, 168, 0.1)",
                      border: "1px solid rgba(91, 77, 168, 0.2)",
                      color: "#a7a3bc",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Create New Post
                  </button>
                </div>
              )}
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