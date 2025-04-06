'use client'

import { useState } from 'react'
import { useToast as useToastUI } from '@/ui/use-toast'

interface UseToastOptions {
  duration?: number
}

export function useToast(options: UseToastOptions = {}) {
  const { duration = 3000 } = options
  const { toast } = useToastUI()
  const [isVisible, setIsVisible] = useState(false)

  const showToast = (
    title: string, 
    description?: string, 
    variant: 'default' | 'destructive' = 'default'
  ) => {
    if (isVisible) return
    
    setIsVisible(true)
    toast({
      title,
      description,
      variant,
      duration,
    })
    
    setTimeout(() => {
      setIsVisible(false)
    }, duration)
  }

  const showSuccess = (title: string, description?: string) => {
    showToast(title, description, 'default')
  }

  const showError = (title: string, description?: string) => {
    showToast(title, description, 'destructive')
  }

  return {
    showSuccess,
    showError,
    showToast,
    isVisible
  }
} 