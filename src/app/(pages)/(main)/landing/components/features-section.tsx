"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Zap, Target, BarChart3, MessageSquare, TrendingUp, Sparkles, Brain } from "lucide-react"
import FeatureCarousel from "./feature-carousel"
import MotivationBanner from "./motivation-banner"

export default function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])
  const personalScheduleItems = [
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Khôi Phục Công Việc Hôm Qua",
      description:
        "Không bao giờ mất công việc quan trọng. Schedulr tự động khôi phục tất cả các tác vụ từ hôm qua với một cú nhấp chuột.",
      backgroundImage: "/images/recovery.webp",
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Tạo Công Việc Thông Minh",
      description:
        "Chỉ cần mô tả bằng lời nói, AI sẽ tạo công việc chi tiết. Tùy chỉnh phong cách: chuyên nghiệp, sáng tạo, hay tự do.",
      backgroundImage: "/images/ai.webp",
    },
    {
      icon: <Target className="w-10 h-10" />,
      title: "Quản Lý Mục Tiêu Trực Quan",
      description:
        "Đặt mục tiêu lớn, chia nhỏ thành công việc hàng ngày. Theo dõi tiến độ với biểu đồ trực quan và nhận gợi ý từ AI.",
      backgroundImage: "/images/target.jfif",
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Phân Tích Chi Tiết Theo Tuần",
      description:
        "Xem thống kê năng suất, thời gian làm việc, và hiệu suất hoàn thành. Nhận insights từ AI để cải thiện liên tục.",
      backgroundImage: "/images/analysis.webp",
    },
  ]

  const groupScheduleItems = [
    {
      icon: <Users className="w-10 h-10" />,
      title: "Tổ Chức Nhóm Hiệu Quả",
      description:
        "Quản lý công việc nhóm nhỏ một cách dễ dàng. Gán nhiệm vụ, theo dõi tiến độ, và đảm bảo mọi người đều trên cùng một trang.",
      backgroundImage: "/images/group.webp",
    },
    {
      icon: <Sparkles className="w-10 h-10" />,
      title: "AI Tạo Công Việc Từ Lời Nhắc",
      description:
        "Mô tả dự án chi tiết, AI sẽ tạo danh sách công việc hoàn chỉnh. Càng chi tiết lời nhắc, càng chất lượng công việc.",
      backgroundImage: "/images/gen_ai.webp",
    },
    {
      icon: <MessageSquare className="w-10 h-10" />,
      title: "Trợ Lý Ảo Thông Minh",
      description:
        "Hỏi trợ lý ảo về công việc nhóm bằng ngôn ngữ tự nhiên. Tìm kiếm ngữ nghĩa giúp bạn tìm thấy chính xác những gì cần.",
      backgroundImage: "/images/assistant.webp",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Biểu Đồ Burn-Down Tự Động",
      description:
        "Theo dõi tiến độ dự án với biểu đồ burn-down. Nhận cảnh báo khi nhóm chậm tiến độ và gợi ý tối ưu hóa từ AI.",
      backgroundImage: "/images/chart.webp",
    },
  ]

  return (
    <section ref={sectionRef} className="relative py-20 px-4 z-10 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Những Tính Năng Mạnh Mẽ</h2>
        <p className="text-[#C9D1D9] text-lg max-w-2xl mx-auto">Mọi thứ bạn cần để quản lý lịch và tăng năng suất</p>
      </div>

      {/* Motivation Banner */}
      <div className="mb-16">
        <MotivationBanner quote="Thời gian là tài sản quý giá nhất. Hãy dùng Schedulr để kiểm soát nó, không để nó kiểm soát bạn." />
      </div>

      {/* Personal Schedule Carousel */}
      <div
        className={`mb-20 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: "100ms" }}
      >
        <FeatureCarousel
          title="Lịch Cá Nhân"
          subtitle="Trợ lý thông minh của bạn để quản lý lịch cá nhân và mục tiêu"
          items={personalScheduleItems}
          color="#4DA8FF"
        />
      </div>

      {/* Motivation Banner */}
      <div className="mb-16">
        <MotivationBanner quote="Một nhóm được tổ chức tốt có thể thay đổi thế giới. Schedulr giúp bạn tổ chức nhóm của mình." />
      </div>

      {/* Group Schedule Carousel */}
      <div
        className={`transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <FeatureCarousel
          title="Lịch Nhóm"
          subtitle="Tổ chức và quản lý công việc nhóm hiệu quả với hỗ trợ AI"
          items={groupScheduleItems}
          color="#73D2DE"
        />
      </div>
    </section>
  )
}
