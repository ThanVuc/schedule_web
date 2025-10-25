"use client"

export default function SkeletonTestimonial() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-6 rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm">
          {/* Stars Skeleton */}
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#1c2333] animate-pulse" />
            ))}
          </div>

          {/* Quote Skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-[#1c2333] rounded-lg w-full animate-pulse" />
            <div className="h-4 bg-[#1c2333] rounded-lg w-5/6 animate-pulse" />
            <div className="h-4 bg-[#1c2333] rounded-lg w-4/6 animate-pulse" />
          </div>

          {/* Author Skeleton */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1c2333] animate-pulse flex-shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-[#1c2333] rounded-lg w-24 mb-1 animate-pulse" />
              <div className="h-3 bg-[#1c2333] rounded-lg w-32 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
