"use client"

import * as React from "react"
import { PromptForm } from "./prompt-form"
import { PostPreview } from "./post-preview"
import { useToast } from "./ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Suspense, useCallback, useTransition } from "react"
import { PostSkeleton } from "./PostSkeleton"
import { ErrorBoundary } from "./ErrorBoundary"
import { useAnalytics } from "../lib/hooks/useAnalytics"
import { measureGenerationTime } from "../lib/utils"
import { X, Loader2 } from "lucide-react"
import { Button } from "./ui/button"

export function PostGenerator() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isPending, startTransition] = useTransition()
  const [postContent, setPostContent] = React.useState<{
    text: string
    image?: string
    hashtags: string[]
  } | null>(null)
  const [activeTab, setActiveTab] = React.useState("create")
  const [generationProgress, setGenerationProgress] = React.useState(0)
  const [currentPlatform, setCurrentPlatform] = React.useState("social media")
  const [currentMessage, setCurrentMessage] = React.useState("Crafting the perfect words for your audience...")
  const [currentFact, setCurrentFact] = React.useState("Posts with images get 2.3x more engagement than those without.")
  const { toast } = useToast()
  const { trackPostGeneration, trackPostApproval } = useAnalytics()
  
  // Reference to store the abort controller for cancellation
  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Loading messages for the generation process
  const loadingMessages = React.useMemo(() => [
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
  ], [])

  // Interesting social media facts to display
  const socialMediaFacts = React.useMemo(() => [
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
  ], [])

  // Progress simulation
  React.useEffect(() => {
    if (isGenerating) {
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
  }, [isGenerating, generationProgress])

  // Rotate through loading messages
  React.useEffect(() => {
    if (!isGenerating) return

    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 3000)
    
    return () => clearInterval(messageInterval)
  }, [isGenerating, loadingMessages])
  
  // Rotate through social media facts
  React.useEffect(() => {
    if (!isGenerating) return

    const factInterval = setInterval(() => {
      setCurrentFact(prev => {
        const currentIndex = socialMediaFacts.indexOf(prev)
        const nextIndex = (currentIndex + 1) % socialMediaFacts.length
        return socialMediaFacts[nextIndex]
      })
    }, 5000)
    
    return () => clearInterval(factInterval)
  }, [isGenerating, socialMediaFacts])

  const handleCancelGeneration = useCallback(() => {
    // Abort the API request if possible
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    
    // Reset the loading state
    setIsGenerating(false)
    setGenerationProgress(0)
    
    toast({
      title: "Generation cancelled",
      description: "Post generation has been cancelled.",
    })
  }, [toast])

  const handleGeneratePost = useCallback(async (formData: FormData) => {
    try {
      // Immediately set generating state to true to show loading screen
      setIsGenerating(true)
      const startTime = performance.now()
      
      const prompt = formData.get("prompt") as string
      const platform = formData.get("platform") as string
      const tone = formData.get("tone") as string
      
      // Store platform for loading screen
      setCurrentPlatform(platform || "social media")
      
      if (!prompt) {
        toast({
          title: "Error",
          description: "Please enter a prompt",
          variant: "destructive",
        })
        setIsGenerating(false)
        return
      }
      
      // Create a new AbortController for this request
      abortControllerRef.current = new AbortController()
      const signal = abortControllerRef.current.signal
      
      // This would normally be a server action call to generate content with signal
      // For now it's just a placeholder that returns after a delay
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, 5000)
          
          // Add an event listener to abort the timeout if the signal is aborted
          signal.addEventListener('abort', () => {
            clearTimeout(timeout)
            reject(new DOMException('Generation cancelled by user', 'AbortError'))
          })
        })
        
        const content = {
          text: `Generated post about "${prompt}" for ${platform} with a ${tone} tone. This is a placeholder for the actual AI-generated content that would come from OpenAI or another model.`,
          hashtags: ["#AI", "#SocialMedia", "#ContentCreation"],
          image: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?q=80&w=1374&auto=format&fit=crop"
        }
        
        setPostContent(content)
        
        // Track generation metrics
        const responseTime = measureGenerationTime('post-generator', startTime)
        trackPostGeneration({
          promptLength: prompt.length,
          responseTime,
          hasImage: !!content.image,
          postLength: content.text.length,
          hashtagCount: content.hashtags.length,
          provider: 'placeholder', // Would be 'openai', 'gemini', etc.
        })
        
        toast({
          title: "Success",
          description: "Post generated successfully!",
        })
        
        // Auto-switch to preview tab after generation
        startTransition(() => {
          setActiveTab("preview")
        })
      } catch (error) {
        if ((error as any)?.name === 'AbortError') {
          // This is an expected error from cancellation, no need to show an error toast
          console.log('Generation was cancelled')
          return
        }
        throw error // Re-throw unexpected errors
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate post",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
      abortControllerRef.current = null
    }
  }, [toast, trackPostGeneration, startTransition])

  const handleRefinePost = useCallback(() => {
    toast({
      description: "Refining post... This would trigger another AI call",
    })
  }, [toast])

  const handleApprovePost = useCallback(() => {
    // In a real implementation, this would save to your database
    trackPostApproval('placeholder-post-id')
    toast({
      title: "Post Approved",
      description: "Post has been approved and saved",
    })
  }, [toast, trackPostApproval])

  return (
    <div className="space-y-6 relative">
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="rounded-xl p-1 overflow-hidden relative shadow-lg"
        style={{
          backgroundColor: "rgba(20, 15, 35, 0.6)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(91, 77, 168, 0.2)",
        }}
      >
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
          style={{
            background: "linear-gradient(90deg, #ea4c89 0%, #8f4bde 50%, #4668ea 100%)",
            borderRadius: "inherit"
          }}
        />
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-[#16123240] relative z-10">
          <TabsTrigger 
            value="create" 
            className="data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ea4c89] data-[state=active]:via-[#8f4bde] data-[state=active]:to-[#4668ea] data-[state=active]:bg-[#1f193860]"
            disabled={isGenerating}
          >
            Create Post
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            disabled={!postContent || isGenerating}
            className="data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ea4c89] data-[state=active]:via-[#8f4bde] data-[state=active]:to-[#4668ea] data-[state=active]:bg-[#1f193860]"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="space-y-4 p-4 relative z-10">
          <ErrorBoundary fallback="There was an error loading the form. Please try again.">
            <PromptForm 
              onSubmit={handleGeneratePost} 
              isGenerating={isGenerating || isPending} 
            />
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="preview" className="p-4 relative z-10">
          <ErrorBoundary fallback="There was an error loading the preview. Please try again.">
            <Suspense fallback={<PostSkeleton />}>
              {postContent && (
                <PostPreview 
                  post={postContent} 
                  onRefine={handleRefinePost}
                  onApprove={handleApprovePost}
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>

      {/* Loading Overlay - Only appears when isGenerating is true */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#140F23] border border-purple-500/20 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleCancelGeneration}
              className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500/20"
              aria-label="Cancel generation"
            >
              <X size={18} />
            </Button>
            
            {/* Spinner */}
            <div className="flex flex-col items-center justify-center space-y-8 py-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-lg opacity-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
                <div className="relative z-10 p-8 bg-[#140F23] bg-opacity-50 rounded-full border border-purple-500/20">
                  <Loader2 className="h-10 w-10 animate-spin text-transparent bg-clip-text bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea]" />
                </div>
              </div>
              
              {/* Title and message */}
              <div className="space-y-4 text-center">
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea]">
                  Generating your {currentPlatform} post...
                </h3>
                
                <p className="text-sm text-gray-300">{currentMessage}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4">
                  <div 
                    className="h-2.5 rounded-full bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea] transition-all duration-300"
                    style={{ width: `${Math.min(Math.max(generationProgress, 0), 100)}%` }}
                  />
                </div>
              </div>
              
              {/* Fact box */}
              <div className="p-4 bg-black/30 rounded-lg max-w-md border border-purple-500/10">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Did you know?</h4>
                <p className="text-sm italic text-gray-400">{currentFact}</p>
              </div>
              
              {/* Cancel button */}
              <Button
                variant="outline"
                onClick={handleCancelGeneration}
                className="mt-4 text-sm border-purple-500/20 bg-black/20 hover:bg-black/40"
              >
                Cancel Generation
              </Button>
            </div>
            
            {/* Bottom animation bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea] w-[30%]"
                style={{ 
                  animation: "loading-bar 2s infinite linear",
                  transformOrigin: "left" 
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}