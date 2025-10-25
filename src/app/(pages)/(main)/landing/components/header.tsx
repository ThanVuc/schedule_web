"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Home, Clock, Users, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Trang Chủ", icon: Home },
    { label: "Lịch Trình", icon: Clock },
    { label: "Nhóm", icon: Users },
    { label: "Hỗ Trợ", icon: HelpCircle },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[rgba(10,15,28,0.8)] backdrop-blur-md border-b border-[#4DA8FF]/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4DA8FF] to-[#73D2DE] rounded-lg flex items-center justify-center font-bold text-white">
            <Calendar size={20} />
          </div>
          <span className="text-xl font-bold text-white hidden sm:inline">Schedulr</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href="#"
                className="flex items-center gap-2 text-[#C9D1D9] hover:text-[#4DA8FF] transition-colors relative group"
              >
                <Icon size={16} />
                <span>{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#4DA8FF] to-[#73D2DE] group-hover:w-full transition-all duration-300" />
              </Link>
            )
          })}
        </nav>

        {/* CTA Button */}
        <Button className="bg-white text-[#0A0F1C] hover:bg-[#4DA8FF] hover:text-white font-semibold rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#4DA8FF]/50">
          Đăng Nhập
        </Button>
      </div>
    </header>
  )
}
