'use client'

import { useEffect } from 'react'
import { Button } from '@/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-red-200 rounded-lg bg-red-50 text-center">
      <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4 max-w-md">
        {error.message || 'An unexpected error occurred while processing your request.'}
      </p>
      <Button onClick={reset} variant="destructive">
        Try again
      </Button>
    </div>
  )
} 