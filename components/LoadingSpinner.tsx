'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = 'medium', 
  className,
  text
}: LoadingSpinnerProps) {
  const sizeClass = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClass[size])} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  )
} 