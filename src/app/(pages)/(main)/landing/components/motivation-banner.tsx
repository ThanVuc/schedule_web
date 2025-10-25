"use client"

import { useEffect, useRef, useState } from "react"
import { Zap } from "lucide-react"

interface MotivationBannerProps {
  quote: string
  author?: string
}

export default function MotivationBanner({ quote, author }: MotivationBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative py-12 px-6 sm:px-12 rounded-2xl border border-[#73D2DE]/30 bg-gradient-to-r from-[#4DA8FF]/10 to-[#73D2DE]/10 backdrop-blur-sm overflow-hidden transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#4DA8FF] rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#73D2DE] rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative z-10 flex items-start gap-4">
        <Zap className="w-6 h-6 text-[#73D2DE] flex-shrink-0 mt-1" />
        <div>
          <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed italic">{quote}</p>
          {author && <p className="text-[#C9D1D9] text-sm mt-3">— {author}</p>}
        </div>
      </div>
    </div>
  )
}
