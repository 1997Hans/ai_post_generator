import { ReactNode } from 'react'
import { Lightbulb } from 'lucide-react'
import { Button } from '@/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ 
  title, 
  description, 
  icon = <Lightbulb className="h-12 w-12 text-yellow-500" />,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50 min-h-[300px]">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md mb-6">{description}</p>
      
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
} 