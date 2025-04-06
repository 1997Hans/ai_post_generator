'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

export type ToneType = 'professional' | 'casual' | 'exciting' | 'friendly' | 'informative'
export type VisualStyle = 'realistic' | 'artistic' | 'minimalist' | 'vibrant' | 'custom'

interface PostState {
  prompt: string
  refinedPrompt: string | null
  tone: ToneType
  visualStyle: VisualStyle
  postContent: string | null
  imageUrl: string | null
  hashtags: string[] | null
  isGenerating: boolean
  isImageGenerating: boolean
  error: string | null
  brandingImage: string | null
}

type PostAction =
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_REFINED_PROMPT'; payload: string }
  | { type: 'SET_TONE'; payload: ToneType }
  | { type: 'SET_VISUAL_STYLE'; payload: VisualStyle }
  | { type: 'SET_POST_CONTENT'; payload: string }
  | { type: 'SET_IMAGE_URL'; payload: string }
  | { type: 'SET_HASHTAGS'; payload: string[] }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_IMAGE_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BRANDING_IMAGE'; payload: string }
  | { type: 'RESET_STATE' }

const initialState: PostState = {
  prompt: '',
  refinedPrompt: null,
  tone: 'professional',
  visualStyle: 'realistic',
  postContent: null,
  imageUrl: null,
  hashtags: null,
  isGenerating: false,
  isImageGenerating: false,
  error: null,
  brandingImage: null
}

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.payload }
    case 'SET_REFINED_PROMPT':
      return { ...state, refinedPrompt: action.payload }
    case 'SET_TONE':
      return { ...state, tone: action.payload }
    case 'SET_VISUAL_STYLE':
      return { ...state, visualStyle: action.payload }
    case 'SET_POST_CONTENT':
      return { ...state, postContent: action.payload }
    case 'SET_IMAGE_URL':
      return { ...state, imageUrl: action.payload }
    case 'SET_HASHTAGS':
      return { ...state, hashtags: action.payload }
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload }
    case 'SET_IMAGE_GENERATING':
      return { ...state, isImageGenerating: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_BRANDING_IMAGE':
      return { ...state, brandingImage: action.payload }
    case 'RESET_STATE':
      return { ...initialState, tone: state.tone, visualStyle: state.visualStyle }
    default:
      return state
  }
}

const PostContext = createContext<{
  state: PostState
  dispatch: React.Dispatch<PostAction>
}>({
  state: initialState,
  dispatch: () => null
})

export const PostProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(postReducer, initialState)

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePostContext = () => useContext(PostContext) 