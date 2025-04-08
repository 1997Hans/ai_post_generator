"use client"

import { useState, useEffect } from "react"
import { SparklesIcon, CheckCircle, X, Loader2 } from "lucide-react"
import { savePost } from "@/app/actions/db-actions"
import { useToast } from "@/lib/hooks/useToast"

// Loading messages for the generation process
const loadingMessages = [
  "Crafting the perfect words for your audience...",
  "Analyzing trends to make your post shine...",
  "Optimizing hashtags for maximum reach...",
  "Adding a sprinkle of creativity...",
  "Finding the perfect tone for your brand...",
  "Polishing your post to perfection...",
  "Brewing social media magic...",
  "Tailoring content for your platform...",
  "Curating engagement-worthy content...",
  "Making your social media manager proud..."
]

// Interesting social media facts to display
const socialMediaFacts = [
  "Posts with images get 2.3x more engagement than those without.",
  "The best time to post on Instagram is typically between 10am-3pm.",
  "Using relevant hashtags can increase engagement by up to 12.6%.",
  "The ideal LinkedIn post is around 100 words.",
  "Videos on Twitter get 10x more engagement than static images.",
  "Questions in Facebook posts get 2x more comments than statements.",
  "TikTok videos under 15 seconds have the highest completion rates.",
  "73% of marketers believe social media is somewhat or very effective.",
  "User-generated content has 4.5% higher conversion rates.",
  "Engagement rates typically drop after the 3rd hashtag on LinkedIn."
]

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

  // Direct fetch approach first to debug
  const [isLoading, setIsLoading] = useState(false)
  
  // Loading animation states
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0])
  const [currentFact, setCurrentFact] = useState(socialMediaFacts[0])
  
  // Style objects with responsive adjustments
  const formContainerStyle = {
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    gap: "32px"
  } as React.CSSProperties;

  const selectionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    width: "100%"
  } as React.CSSProperties;

  // Ensure dropdown select elements are fully visible on mobile devices
  const dropdownStyle = {
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
  } as React.CSSProperties;

  // Fix action buttons layout on mobile
  const mobileButtonsStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "24px"
  } as React.CSSProperties;
  
  // Progress simulation
  useEffect(() => {
    if (isLoading) {
      setGenerationProgress(0)
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          // Slow down progress as it gets closer to 100%
          const increment = Math.max(1, 10 * (1 - prev / 100))
          const nextProgress = prev + increment
          return nextProgress > 95 ? 95 : nextProgress
        })
      }, 300)
      return () => clearInterval(interval)
    } else if (generationProgress > 0 && generationProgress < 100) {
      // Complete the progress bar when generation is done
      setGenerationProgress(100)
    }
  }, [isLoading, generationProgress])

  // Rotate through loading messages
  useEffect(() => {
    if (!isLoading) return

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 3000)
    
    return () => clearInterval(messageInterval)
  }, [isLoading])
  
  // Rotate through social media facts
  useEffect(() => {
    if (!isLoading) return

    const factInterval = setInterval(() => {
      setCurrentFact(prev => {
        const currentIndex = socialMediaFacts.indexOf(prev)
        const nextIndex = (currentIndex + 1) % socialMediaFacts.length
        return socialMediaFacts[nextIndex]
      })
    }, 5000)
    
    return () => clearInterval(factInterval)
  }, [isLoading])

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

  // Handle cancellation of post generation
  const handleCancelGeneration = () => {
    // Abort fetch or any pending operations
    setIsLoading(false)
    setGenerationProgress(0)
    showSuccess("Generation cancelled")
  }

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

  // Add CSS to handle mobile responsiveness globally
  useEffect(() => {
    // Add responsive styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @media (max-width: 768px) {
        h1 {
          font-size: 40px !important;
        }
        
        textarea, select {
          font-size: 14px !important;
        }
        
        .generate-button {
          padding: 12px 24px !important;
        }
        
        .form-container {
          gap: 20px !important;
        }
      }
      
      @media (max-width: 480px) {
        h1 {
          font-size: 32px !important;
        }
        
        textarea {
          min-height: 100px !important;
        }
        
        .loading-content {
          max-width: 100% !important;
          padding: 1rem 0.5rem !important;
        }
        
        .selection-grid {
          grid-template-columns: 1fr !important;
          gap: 16px !important;
        }
        
        .dropdown-select {
          font-size: 14px !important;
          padding: 10px 14px !important;
        }
        
        .button-group {
          flex-direction: column !important;
          gap: 12px !important;
        }
      }
      
      /* Loading modal animation */
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { opacity: 0.3; transform: scale(0.95); }
        50% { opacity: 0.5; transform: scale(1.05); }
        100% { opacity: 0.3; transform: scale(0.95); }
      }
      
      @keyframes loading-bar {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
      
      @keyframes pulse-glow {
        0% { opacity: 0.2; transform: scale(0.95); }
        50% { opacity: 0.4; transform: scale(1.05); }
        100% { opacity: 0.2; transform: scale(0.95); }
      }
      
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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
      <div className="tabs-container" style={{ 
        display: "flex", 
        borderBottom: "1px solid rgba(91, 77, 168, 0.2)",
        marginBottom: "24px",
        overflowX: "auto",
        width: "100%",
        WebkitOverflowScrolling: "touch"
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
            cursor: "pointer",
            whiteSpace: "nowrap"
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
            opacity: result ? 1 : 0.5,
            whiteSpace: "nowrap"
          }}
        >
          Preview
        </button>
      </div>
      
      {/* Create Tab */}
      {activeTab === "create" && (
        <div style={{ maxWidth: "100%", width: "100%" }}>
          <form 
            onSubmit={handleFormSubmit}
            className="form-container"
            style={formContainerStyle}
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

            <div className="selection-grid" style={selectionGridStyle}>
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
                    className="dropdown-select"
                    style={dropdownStyle}
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
                    className="dropdown-select"
                    style={dropdownStyle}
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
                    className="dropdown-select"
                    style={dropdownStyle}
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
                  className="generate-button"
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
        <div style={{ width: "100%", maxWidth: "100%" }}>
          {result ? (
            <div style={{ width: "100%" }}>
              {/* Image display with responsive adjustments */}
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
                  maxHeight: "550px",
                  width: "100%",
                  maxWidth: "100%"
                }}>
                  <img
                    src={result.imageUrl}
                    alt={result.caption || "Generated image"}
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      borderRadius: "12px"
                    }}
                  />
                </div>
              )}

              {/* Content boxes with responsive spacing */}
              <div style={{ 
                backgroundColor: "rgba(29, 23, 52, 0.5)",
                border: "1px solid rgba(91, 77, 168, 0.2)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "24px",
                width: "100%",
                maxWidth: "100%",
                overflowWrap: "break-word",
                wordWrap: "break-word"
              }}>
                <h2 style={{ 
                  fontSize: "20px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Main Content
                </h2>
                <p style={{
                  fontSize: "16px",
                  color: "#d8d4ea",
                  lineHeight: 1.6,
                  marginBottom: "16px"
                }}>
                  {result.mainContent}
                </p>

                <h2 style={{ 
                  fontSize: "20px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Caption
                </h2>
                <p style={{
                  fontSize: "16px",
                  color: "#d8d4ea",
                  lineHeight: 1.6,
                  marginBottom: "16px"
                }}>
                  {result.caption}
                </p>

                <h2 style={{ 
                  fontSize: "20px", 
                  fontWeight: "600", 
                  marginBottom: "12px",
                  color: "#d8d4ea"
                }}>
                  Hashtags
                </h2>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  width: "100%"
                }}>
                  {result.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "rgba(29, 23, 52, 0.5)",
                        border: "1px solid rgba(91, 77, 168, 0.2)",
                        borderRadius: "8px",
                        padding: "4px 8px",
                        color: "#d8d4ea",
                        fontSize: "14px",
                        maxWidth: "100%",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
                      }}
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="button-group" style={mobileButtonsStyle}>
                <button
                  onClick={() => copyToClipboard(result.mainContent)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "#d8d4ea",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Copy Content
                </button>
                <button
                  onClick={handleImageDownload}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "#d8d4ea",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Download Image
                </button>
                <button
                  onClick={handleSavePost}
                  disabled={saveStatus === "saving"}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "#d8d4ea",
                    fontSize: "16px",
                    cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
                    opacity: saveStatus === "saving" ? 0.7 : 1,
                    transition: "all 0.2s ease"
                  }}
                >
                  {saveStatus === "saving" ? "Saving..." : "Save to Database"}
                </button>
              </div>

              {/* Reset button */}
              <div style={{
                display: "flex",
                justifyContent: "center"
              }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "#d8d4ea",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Create New Post
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: "40px", 
              color: "#a7a3bc" 
            }}>
              <p style={{ fontSize: "18px", marginBottom: "24px" }}>
                No preview available. Please generate a post first.
              </p>
              <button
                onClick={() => setActiveTab("create")}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(29, 23, 52, 0.5)",
                  border: "1px solid rgba(91, 77, 168, 0.2)",
                  color: "#d8d4ea",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                Create Post
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay with responsive styling */}
      {isLoading && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem",
          overflowX: "hidden",
          width: "100vw",
          height: "100vh",
          boxSizing: "border-box"
        }}>
          <div style={{
            backgroundColor: "rgba(20, 15, 35, 0.8)",
            borderRadius: "1rem",
            border: "1px solid rgba(91, 77, 168, 0.2)",
            padding: "2rem",
            maxWidth: "32rem",
            width: "100%",
            position: "relative",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            {/* Close button */}
            <button 
              onClick={handleCancelGeneration}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "transparent",
                border: "none",
                color: "#a7a3bc",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1
              }}
              aria-label="Cancel generation"
            >
              <X size={18} />
            </button>
            
            {/* Content */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem"
            }}>
              {/* Spinner */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  inset: "-0.5rem",
                  borderRadius: "50%",
                  opacity: 0.5,
                  animation: "pulse 2s infinite ease-in-out",
                  background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
                  filter: "blur(1rem)"
                }} />
                <div style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "2rem",
                  backgroundColor: "rgba(20, 15, 35, 0.5)",
                  borderRadius: "50%",
                  border: "1px solid rgba(91, 77, 168, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Loader2 size={40} style={{
                    animation: "spin 2s linear infinite",
                    background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent"
                  }} />
                </div>
              </div>
              
              {/* Text content with responsive maxWidth */}
              <div 
                className="loading-content" 
                style={{ 
                  textAlign: "center", 
                  maxWidth: "28rem"
                }}
              >
                <h3 style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent"
                }}>
                  Generating your {platform} post...
                </h3>
                
                <p style={{ color: "#a7a3bc", marginBottom: "1.5rem" }}>
                  {currentMessage}
                </p>
                
                {/* Progress bar */}
                <div style={{
                  width: "100%",
                  height: "0.5rem",
                  backgroundColor: "rgba(29, 23, 52, 0.5)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                  marginBottom: "2rem"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${generationProgress}%`,
                    background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
                    borderRadius: "9999px",
                    transition: "width 0.3s ease"
                  }} />
                </div>
                
                {/* Facts box */}
                <div style={{
                  backgroundColor: "rgba(20, 15, 35, 0.6)",
                  border: "1px solid rgba(91, 77, 168, 0.1)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  marginBottom: "1.5rem"
                }}>
                  <h4 style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                    color: "#d8d4ea"
                  }}>
                    Did you know?
                  </h4>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#a7a3bc",
                    fontStyle: "italic"
                  }}>
                    {currentFact}
                  </p>
                </div>
                
                {/* Cancel button */}
                <button
                  onClick={handleCancelGeneration}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(29, 23, 52, 0.5)",
                    border: "1px solid rgba(91, 77, 168, 0.2)",
                    color: "#d8d4ea",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancel Generation
                </button>
              </div>
            </div>
            
            {/* Bottom animation bar */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: "30%",
                background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
                animation: "loading-bar 2s infinite linear",
                transformOrigin: "left"
              }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}