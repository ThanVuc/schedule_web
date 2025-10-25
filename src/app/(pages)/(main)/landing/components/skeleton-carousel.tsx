"use client"

export default function SkeletonCarousel() {
  return (
    <div className="relative w-full">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-[#1c2333] rounded-lg w-48 mx-auto mb-2 animate-pulse" />
        <div className="h-4 bg-[#1c2333] rounded-lg w-64 mx-auto animate-pulse" />
      </div>

      {/* Carousel Container Skeleton */}
      <div className="relative overflow-hidden rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-6">
          {/* Left Arrow Skeleton */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1c2333] animate-pulse" />

          {/* Content Skeleton */}
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

          {/* Right Arrow Skeleton */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1c2333] animate-pulse" />
        </div>

        {/* Dots Skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1c2333] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
