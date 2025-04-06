"use client"

import { useState } from "react"
import { SparklesIcon } from "lucide-react"

export function PostForm() {
  const [activeTab, setActiveTab] = useState("create")
  const [prompt, setPrompt] = useState("")
  const [platform, setPlatform] = useState("facebook")
  const [tone, setTone] = useState("friendly")
  const [errorMsg, setErrorMsg] = useState("")
  const [result, setResult] = useState<any>(null)

  // Use the direct fetch approach first to debug
  const [isLoading, setIsLoading] = useState(false)

  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard');
        // You could add a toast notification here
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Direct fetch function to manually control the API call
  const generatePost = async () => {
    if (!prompt.trim()) return
    
    console.log('Generating post with:', { prompt, tone, platform })
    setIsLoading(true)
    setErrorMsg("")
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: prompt,
          tone,
          platform,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
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
          setErrorMsg('Invalid response format from API');
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error generating post:', error)
      setErrorMsg(error.message || 'Failed to generate post')
    } finally {
      setIsLoading(false)
    }
  }

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
        <div>
          <form onSubmit={handleFormSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <h2 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                marginBottom: "8px",
                color: "#d8d4ea"
              }}>
                What would you like to post about?
              </h2>
              <div style={{ position: "relative" }}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Post about running era"
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
                    fontFamily: "inherit"
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: "flex", 
              gap: "24px", 
              marginBottom: "32px",
              flexWrap: "wrap"
            }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <h2 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "8px",
                  color: "#d8d4ea"
                }}>
                  Platform
                </h2>
                <div style={{ position: "relative" }}>
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
                      appearance: "none"
                    }}
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                  <div style={{ 
                    position: "absolute", 
                    right: "16px", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    pointerEvents: "none"
                  }}>
                    ▼
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <h2 style={{ 
                  fontSize: "16px", 
                  fontWeight: "600", 
                  marginBottom: "8px",
                  color: "#d8d4ea"
                }}>
                  Tone
                </h2>
                <div style={{ position: "relative" }}>
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
                      appearance: "none"
                    }}
                  >
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="informative">Informative</option>
                  </select>
                  <div style={{ 
                    position: "absolute", 
                    right: "16px", 
                    top: "50%", 
                    transform: "translateY(-50%)",
                    pointerEvents: "none"
                  }}>
                    ▼
                  </div>
                </div>
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
        <div>
          {result ? (
            <div>
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

              {result.visualPrompt && (
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
                    color: "#d8d4ea"
                  }}>
                    Visual Prompt
                  </h3>
                  <p style={{ 
                    fontSize: "16px", 
                    lineHeight: "1.6",
                    color: "white",
                    fontStyle: "italic"
                  }}>
                    {result.visualPrompt}
                  </p>
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