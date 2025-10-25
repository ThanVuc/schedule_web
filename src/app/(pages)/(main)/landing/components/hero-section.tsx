"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative flex items-center justify-center px-4 pt-20 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className={`inline-block mb-6 px-4 py-2 rounded-full bg-[#4DA8FF]/10 border border-[#4DA8FF]/30 transition-all duration-700 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <span className="text-[#4DA8FF] text-sm font-medium">✨ Lập Lịch Được Hỗ Trợ Bởi AI</span>
        </div>

        <h1
          className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Lập Lịch Thông Minh Cùng{" "}
          <span className="bg-gradient-to-r from-[#4DA8FF] to-[#73D2DE] bg-clip-text text-transparent">Schedulr</span>
        </h1>

        <p
          className={`text-lg sm:text-xl text-[#C9D1D9] mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          Quản lý lịch cá nhân và nhóm, theo dõi mục tiêu, và tối ưu hóa năng suất với những hiểu biết được hỗ trợ bởi
          AI.
        </p>

        <div
          className={`mb-8 text-center transition-all duration-700 delay-250 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-[#73D2DE] font-semibold text-lg italic">
            &quot;Bứt phá giới hạn, chinh phục mục tiêu, thay đổi cuộc sống&quot;
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Button 
          className="bg-gradient-to-r from-[#4DA8FF] to-[#73D2DE] text-white font-semibold px-8 py-6 rounded-full text-lg hover:shadow-lg hover:shadow-[#4DA8FF]/50 transition-all duration-300 hover:scale-105 group">
            Bắt Đầu Miễn Phí
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="border-[#4DA8FF]/50 text-[#4DA8FF] hover:bg-[#4DA8FF]/10 font-semibold px-8 py-6 rounded-full text-lg transition-all duration-300 bg-transparent"
          >
            Tìm Hiểu Thêm
          </Button>
        </div>
      </div>
    </section>
  )
}
