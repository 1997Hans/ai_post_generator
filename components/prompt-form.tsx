"use client"

import * as React from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { LoadingSpinner } from "./loading-spinner"

interface PromptFormProps {
  onSubmit: (formData: FormData) => void
  isGenerating: boolean
}

export function PromptForm({ onSubmit, isGenerating }: PromptFormProps) {
  const [platform, setPlatform] = React.useState("instagram")
  const [tone, setTone] = React.useState("professional")
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Social Media Post</CardTitle>
        <CardDescription>
          Describe what you want to post about and our AI will generate content for you.
        </CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">What do you want to post about?</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="E.g., New product launch of our eco-friendly water bottles"
              className="min-h-32"
              disabled={isGenerating}
              required
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                name="platform"
                value={platform}
                onValueChange={setPlatform}
                disabled={isGenerating}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter / X</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select
                name="tone"
                value={tone}
                onValueChange={setTone}
                disabled={isGenerating}
              >
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isGenerating} 
            className="w-full"
          >
            {isGenerating ? (
              <>
                <LoadingSpinner className="mr-2" />
                Generating...
              </>
            ) : (
              "Generate Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}