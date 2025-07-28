'use client'

import { useEffect, useState } from 'react'
import './bgLayout.scss'

interface Star {
  id: number
  size: number
  top: number
  left: number
  duration: number
  delay: number
}

export const StarBackground = ({ children }: { children: React.ReactNode }) => {
  const [stars, setStars] = useState<Star[] | null>(null)

  useEffect(() => {
    const cached = localStorage.getItem('stars');
    if (cached) {
      try {
        setStars(JSON.parse(cached));
        return;
      } catch {
        
      }
    }

    const numStars = 50;
    const generated = Array.from({ length: numStars }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 3 + Math.random() * 3,
      delay: Math.random() * 5,
    }));

    setStars(generated);
    localStorage.setItem('stars', JSON.stringify(generated));
  }, [])

  return (
    <div className="star-background relative overflow-hidden min-h-screen w-[100%]">
      {stars &&
        stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      {children}
    </div>
  )
}
