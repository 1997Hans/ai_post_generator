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

export const SavePostSchema = z.object({
  postId: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional().nullable(),
  hashtags: z.string().or(z.array(z.string())).default(''),
  prompt: z.string().min(1, 'Prompt is required'),
  refinedPrompt: z.string().optional().nullable(),
  tone: z.string().optional().nullable(),
  visualStyle: z.string().optional().nullable(),
  approved: z.boolean().optional().default(false)
})

export const FeedbackSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  feedbackText: z.string().min(1, 'Feedback text is required'),
  rating: z.number().min(1).max(5).optional()
})

export type SavePostValues = z.infer<typeof SavePostSchema>
export type FeedbackValues = z.infer<typeof FeedbackSchema> 