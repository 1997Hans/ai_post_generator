import { z } from 'zod'
import { ToneType, VisualStyle } from '../context/PostContext'

export const promptFormSchema = z.object({
  prompt: z
    .string()
    .min(3, { message: 'Prompt must be at least 3 characters' })
    .max(300, { message: 'Prompt must be less than 300 characters' }),
  tone: z.enum(['professional', 'casual', 'exciting', 'friendly', 'informative'] as const),
  visualStyle: z.enum(['realistic', 'artistic', 'minimalist', 'vibrant', 'custom'] as const),
  brandingImage: z.string().optional()
})

export type PromptFormValues = z.infer<typeof promptFormSchema>

export const postOutputSchema = z.object({
  content: z.string(),
  imagePrompt: z.string(),
  hashtags: z.array(z.string())
})

export type PostOutput = z.infer<typeof postOutputSchema>

export const feedbackSchema = z.object({
  feedback: z
    .string()
    .min(5, { message: 'Feedback must be at least 5 characters' })
    .max(500, { message: 'Feedback must be less than 500 characters' }),
  postId: z.string()
})

export type FeedbackValues = z.infer<typeof feedbackSchema>

export const savePostSchema = z.object({
  postId: z.string().optional(),
  content: z.string(),
  imageUrl: z.string(),
  hashtags: z.array(z.string()),
  prompt: z.string(),
  refinedPrompt: z.string().optional(),
  tone: z.enum(['professional', 'casual', 'exciting', 'friendly', 'informative'] as const),
  visualStyle: z.enum(['realistic', 'artistic', 'minimalist', 'vibrant', 'custom'] as const)
})

export type SavePostValues = z.infer<typeof savePostSchema> 