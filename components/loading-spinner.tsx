import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={cn("animate-spin", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="url(#spinner-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon-glow"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea4c89" />
            <stop offset="50%" stopColor="#8f4bde" />
            <stop offset="100%" stopColor="#4668ea" />
          </linearGradient>
        </defs>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    </div>
  )
}