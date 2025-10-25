"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import MotivationBanner from "./motivation-banner"

interface Testimonial {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Schedulr đã thay đổi cách nhóm của chúng tôi quản lý dự án. Chỉ riêng những hiểu biết từ AI đã tăng năng suất của chúng tôi lên 40%.",
    author: "Trần Thảo",
    role: "Quản Lý Dự Án",
    company: "TechCorp",
    avatar: "TT",
  },
  {
    quote:
      "Các tính năng lập lịch cá nhân thật tuyệt vời. Cuối cùng tôi cũng có thời gian trở lại nhờ khôi phục công việc thông minh.",
    author: "Nguyễn Minh",
    role: "Nhà Sáng Lập",
    company: "StartupHub",
    avatar: "NM",
  },
  {
    quote:
      "Đầu tư tốt nhất cho cộng tác nhóm. Biểu đồ burn-down và tóm tắt AI giúp chúng tôi tiết kiệm hàng giờ mỗi tuần.",
    author: "Lê Hương",
    role: "Trưởng Nhóm",
    company: "DesignStudio",
    avatar: "LH",
  },
]

interface TestimonialsSectionProps {
  isLoading?: boolean
}

export default function TestimonialsSection({ isLoading = false }: TestimonialsSectionProps) {
  const [visibleTestimonials, setVisibleTestimonials] = useState<boolean[]>([false, false, false])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleTestimonials([true, true, true])
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [isLoading])

  if (isLoading) {
    return (
      <section ref={sectionRef} className="relative py-12 px-4 z-10 max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="h-6 bg-[#1c2333] rounded-lg w-96 mx-auto animate-pulse" />
        </div>

        <div className="text-center mb-10">
          <div className="h-8 bg-[#1c2333] rounded-lg w-64 mx-auto mb-2 animate-pulse" />
          <div className="h-4 bg-[#1c2333] rounded-lg w-80 mx-auto animate-pulse" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="p-6 rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-full bg-[#1c2333] animate-pulse" />
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-[#1c2333] rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-[#1c2333] rounded-lg w-5/6 animate-pulse" />
                <div className="h-4 bg-[#1c2333] rounded-lg w-4/6 animate-pulse" />
              </div>
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
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative py-12 px-4 z-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <MotivationBanner quote="Những người thành công không quản lý thời gian tốt hơn - họ chỉ biết cách ưu tiên đúng. Schedulr giúp bạn làm điều đó." />
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Được Yêu Thích Bởi Các Nhóm</h2>
        <p className="text-[#C9D1D9] text-base">Xem những gì người dùng của chúng tôi nói về Schedulr</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl border border-[#4DA8FF]/20 bg-[#0A0F1C]/50 backdrop-blur-sm hover:border-[#73D2DE]/50 transition-all duration-500 ${
              visibleTestimonials[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#4DA8FF] text-[#4DA8FF]" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-[#C9D1D9] mb-4 italic text-sm">&ldquo;{testimonial.quote}&ldquo;</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4DA8FF] to-[#73D2DE] flex items-center justify-center text-white font-bold text-xs">
                {testimonial.avatar}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{testimonial.author}</p>
                <p className="text-[#C9D1D9] text-xs">
                  {testimonial.role} tại {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
