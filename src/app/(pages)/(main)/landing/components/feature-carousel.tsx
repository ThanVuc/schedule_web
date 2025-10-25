"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  icon: React.ReactNode
  title: string
  description: string
  backgroundImage?: string
}

interface FeatureCarouselProps {
  title: string
  subtitle: string
  items: CarouselItem[]
  color: string
  isLoading?: boolean
}

export default function FeatureCarousel({ title, subtitle, items, color, isLoading = false }: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useEffect(() => {
    if (!isAutoPlay || isLoading) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay, items.length, isLoading])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
    setIsAutoPlay(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
    setIsAutoPlay(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  if (isLoading) {
    return (
      <div className="relative w-full">
        <div className="text-center mb-8">
          <div className="h-8 bg-[#1c2333] rounded-lg w-48 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-[#1c2333] rounded-lg w-64 mx-auto animate-pulse" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm p-6 sm:p-8">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1c2333] animate-pulse" />
            <div className="flex-1 min-h-[220px] flex items-center justify-center">
              <div className="w-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1c2333] mx-auto mb-4 animate-pulse" />
                <div className="h-6 bg-[#1c2333] rounded-lg w-40 mx-auto mb-3 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-[#1c2333] rounded-lg w-full animate-pulse" />
                  <div className="h-4 bg-[#1c2333] rounded-lg w-5/6 mx-auto animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1c2333] animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{title}</h3>
        <p className="text-[#C9D1D9] text-sm">{subtitle}</p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm p-6 sm:p-8">
        {items[currentIndex]?.backgroundImage && (
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              backgroundImage: `url(${items[currentIndex].backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        {/* Animated Background Glow */}
        <div
          className="absolute inset-0 opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)`,
          }}
        />

        {/* Carousel Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-6">
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className="flex-shrink-0 p-2 rounded-full border border-[#4DA8FF]/30 hover:border-[#4DA8FF] hover:bg-[#4DA8FF]/10 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-[#4DA8FF] group-hover:scale-110 transition-transform" />
            </button>

            {/* Carousel Items */}
            <div className="flex-1 min-h-[220px] flex items-center justify-center">
              <div className="w-full">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-500 transform ${
                      index === currentIndex
                        ? "opacity-100 scale-100 translate-x-0"
                        : index < currentIndex
                          ? "opacity-0 scale-95 -translate-x-full absolute"
                          : "opacity-0 scale-95 translate-x-full absolute"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300"
                        style={{
                          background: `${color}20`,
                          color: color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-[#C9D1D9] text-sm leading-relaxed max-w-md mx-auto">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
              className="flex-shrink-0 p-2 rounded-full border border-[#4DA8FF]/30 hover:border-[#4DA8FF] hover:bg-[#4DA8FF]/10 transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-[#4DA8FF] group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex ? "w-6 h-1.5" : "w-1.5 h-1.5 hover:w-4"
                }`}
                style={{
                  backgroundColor: index === currentIndex ? color : `${color}40`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
