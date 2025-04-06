export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          content: string
          image_url: string
          hashtags: string[]
          prompt: string
          refined_prompt: string | null
          tone: string
          visual_style: string
          user_id: string | null
          approved: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          content: string
          image_url: string
          hashtags: string[]
          prompt: string
          refined_prompt?: string | null
          tone: string
          visual_style: string
          user_id?: string | null
          approved?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          content?: string
          image_url?: string
          hashtags?: string[]
          prompt?: string
          refined_prompt?: string | null
          tone?: string
          visual_style?: string
          user_id?: string | null
          approved?: boolean
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          post_id: string
          feedback_text: string
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          post_id: string
          feedback_text: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          post_id?: string
          feedback_text?: string
          user_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string | null
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 