"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LoadingSpinner } from "./loading-spinner"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { X } from "lucide-react"

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

interface PostGenerationLoadingProps {
  message?: string
  className?: string
  platform?: string
  progress?: number
  onCancel?: () => void
}

export function PostGenerationLoading({
  message,
  className,
  platform = "social media",
  progress,
  onCancel,
}: PostGenerationLoadingProps) {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0])
  const [fact, setFact] = useState(socialMediaFacts[0])
  const [dots, setDots] = useState(".")
  
  // Rotate through loading messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => {
        const currentIndex = loadingMessages.indexOf(prev)
        const nextIndex = (currentIndex + 1) % loadingMessages.length
        return loadingMessages[nextIndex]
      })
    }, 3000)
    
    return () => clearInterval(messageInterval)
  }, [])
  
  // Rotate through social media facts
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFact(prev => {
        const currentIndex = socialMediaFacts.indexOf(prev)
        const nextIndex = (currentIndex + 1) % socialMediaFacts.length
        return socialMediaFacts[nextIndex]
      })
    }, 5000)
    
    return () => clearInterval(factInterval)
  }, [])
  
  // Animated dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : ".")
    }, 500)
    
    return () => clearInterval(dotsInterval)
  }, [])

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center space-y-8 p-8 text-center min-h-[400px] rounded-xl relative",
        className
      )}
      style={{
        backgroundColor: "rgba(20, 15, 35, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(91, 77, 168, 0.2)",
      }}
    >
      {onCancel && (
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white hover:bg-red-500/20"
          aria-label="Cancel generation"
        >
          <X size={18} />
        </Button>
      )}
      
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-lg opacity-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
        <LoadingSpinner 
          size="large" 
          className="relative z-10 p-8 bg-[#140F23] bg-opacity-50 rounded-full border border-purple-500/20"
        />
      </div>
      
      <div className="space-y-4 max-w-md">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea]">
          {message || `Generating your ${platform} post${dots}`}
        </h3>
        
        <p className="text-sm text-gray-300">{currentMessage}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4">
            <div 
              className="h-2.5 rounded-full bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea]"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-black/20 rounded-lg max-w-md border border-purple-500/10">
        <h4 className="text-sm font-medium mb-2 text-gray-300">Did you know?</h4>
        <p className="text-sm italic text-gray-400">{fact}</p>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#ea4c89] via-[#8f4bde] to-[#4668ea] w-[30%] animate-loading-bar"
          style={{ transformOrigin: "left" }}
        />
      </div>
      
      {onCancel && (
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="text-sm border-purple-500/20 bg-black/20 hover:bg-black/40"
          >
            Cancel Generation
          </Button>
        </div>
      )}
    </div>
  )
} 