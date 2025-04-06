"use client"

import * as React from "react"
import { PromptForm } from "./prompt-form"
import { PostPreview } from "./post-preview"
import { useToast } from "./ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export function PostGenerator() {
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [postContent, setPostContent] = React.useState<{
    text: string
    image?: string
    hashtags: string[]
  } | null>(null)
  const { toast } = useToast()

  async function handleGeneratePost(formData: FormData) {
    try {
      setIsGenerating(true)
      
      const prompt = formData.get("prompt") as string
      const platform = formData.get("platform") as string
      const tone = formData.get("tone") as string
      
      if (!prompt) {
        toast({
          title: "Error",
          description: "Please enter a prompt",
          variant: "destructive",
        })
        return
      }
      
      // This would normally be a server action call to generate content
      // For now it's just a placeholder that returns after a delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setPostContent({
        text: `Generated post about "${prompt}" for ${platform} with a ${tone} tone. This is a placeholder for the actual AI-generated content that would come from OpenAI or another model.`,
        hashtags: ["#AI", "#SocialMedia", "#ContentCreation"],
        image: "https://images.unsplash.com/photo-1569396116180-210c182bedb8?q=80&w=1374&auto=format&fit=crop"
      })
      
      toast({
        title: "Success",
        description: "Post generated successfully!",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate post",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleRefinePost() {
    toast({
      description: "Refining post... This would trigger another AI call",
    })
  }

  function handleApprovePost() {
    toast({
      title: "Post Approved",
      description: "Post has been approved and saved",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="create" 
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
          >
            Create Post
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            disabled={!postContent}
            className="data-[state=active]:text-transparent data-[state=active]:bg-clip-text data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ea4c89] data-[state=active]:via-[#8f4bde] data-[state=active]:to-[#4668ea] data-[state=active]:bg-[#1f193860]"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="space-y-4 p-4 relative z-10">
          <PromptForm 
            onSubmit={handleGeneratePost} 
            isGenerating={isGenerating} 
          />
        </TabsContent>
        <TabsContent value="preview" className="p-4 relative z-10">
          {postContent && (
            <PostPreview 
              post={postContent} 
              onRefine={handleRefinePost}
              onApprove={handleApprovePost}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}