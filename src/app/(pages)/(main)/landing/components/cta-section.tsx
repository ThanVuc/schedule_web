"use client"

import { ArrowRight, Zap } from "lucide-react"
import MotivationBanner from "./motivation-banner"
import { Button } from "@/components/ui"

export default function CTASection() {
  return (
    <section className="relative py-20 px-4 z-10 max-w-4xl mx-auto">
      <div className="mb-12">
        <MotivationBanner quote="Không có thời gian để lãng phí. Hãy hành động ngay hôm nay, thay đổi cuộc sống ngày mai." />
      </div>

      <div className="rounded-2xl border border-[#4DA8FF]/30 bg-gradient-to-r from-[#4DA8FF]/10 to-[#73D2DE]/10 backdrop-blur-sm p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 blur-3xl">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#4DA8FF] rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#73D2DE] rounded-full blur-3xl opacity-20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-[#73D2DE]" />
            <span className="text-[#73D2DE] font-semibold">Bứt Phá Giới Hạn</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Sẵn Sàng Lập Lịch Thông Minh?</h2>
          <p className="text-[#C9D1D9] text-lg mb-8 max-w-2xl mx-auto">
            Tham gia hàng nghìn nhóm đang sử dụng Schedulr để tăng năng suất, chinh phục mục tiêu, và thay đổi cách họ
            làm việc.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#4DA8FF] to-[#73D2DE] text-white font-semibold px-8 py-6 rounded-full text-lg hover:shadow-lg hover:shadow-[#4DA8FF]/50 transition-all duration-300 hover:scale-105 group">
              Bắt Đầu Dùng Thử Miễn Phí
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-[#4DA8FF]/50 text-[#4DA8FF] hover:bg-[#4DA8FF]/10 font-semibold px-8 py-6 rounded-full text-lg transition-all duration-300 bg-transparent"
            >
              Lên Lịch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
