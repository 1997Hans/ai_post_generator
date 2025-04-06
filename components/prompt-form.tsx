"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "./loading-spinner"
import { SparklesIcon } from "lucide-react"

const promptSchema = z.object({
  prompt: z.string().min(3, {
    message: "Prompt must be at least 3 characters.",
  }),
  platform: z.string(),
  tone: z.string(),
})

type PromptFormValues = z.infer<typeof promptSchema>

const defaultValues: Partial<PromptFormValues> = {
  prompt: "",
  platform: "instagram",
  tone: "professional",
}

interface PromptFormProps {
  onSubmit: (data: FormData) => void
  isGenerating: boolean
}

export function PromptForm({ onSubmit, isGenerating }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues,
  })

  function handleSubmit(data: PromptFormValues) {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    onSubmit(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg gradient-text font-semibold">What would you like to post about?</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Announce our summer collection with beach vibes"
                  className="h-14 border-border/40 bg-muted/20 backdrop-blur-sm focus-visible:ring-primary/70"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gradient-text font-semibold">Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-border/40 bg-muted/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border/40 backdrop-blur-sm">
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="gradient-text font-semibold">Tone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 border-border/40 bg-muted/20 backdrop-blur-sm">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card border-border/40 backdrop-blur-sm">
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="exciting">Exciting</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="relative flex justify-center">
          <div className="animate-pulse-glow shadow-glow absolute inset-0 rounded-full opacity-30"></div>
          <Button type="submit" disabled={isGenerating} className="gradient-fill text-white py-6 px-8 rounded-full relative z-10">
            {isGenerating ? (
              <><LoadingSpinner className="mr-2" /> Generating...</>
            ) : (
              <><SparklesIcon className="mr-2 h-5 w-5" /> Generate Post</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}