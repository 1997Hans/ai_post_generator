"use client"

import { useEffect, useState } from "react"

interface Star {
  size: number
  top: number
  left: number
  delay: number
  duration: number
  opacity: number
}

export function StarField() {
  const [stars, setStars] = useState<Star[]>([])
  
  useEffect(() => {
    // Generate stars only on the client side to avoid hydration issues
    const generatedStars = Array.from({ length: 100 }).map(() => ({
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.7 + 0.3
    }))
    
    setStars(generatedStars)
  }, [])
  
  if (stars.length === 0) return null
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star, i) => (
        <span 
          key={i}
          style={{
            position: 'absolute',
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: '#fff',
            boxShadow: '0 0 10px 0 rgba(255, 255, 255, 0.7)',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`
          }}
        />
      ))}
    </div>
  )
} 