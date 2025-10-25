import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-[#4DA8FF]/20 backdrop-blur-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4DA8FF] to-[#73D2DE] rounded-lg flex items-center justify-center font-bold text-white">
                S
              </div>
              <span className="text-lg font-bold text-white">Schedulr</span>
            </div>
            <p className="text-[#C9D1D9] text-sm">Lập lịch được hỗ trợ bởi AI cho cá nhân và nhóm.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sản Phẩm</h4>
            <ul className="space-y-2">
              {["Tính Năng", "Bảo Mật", "Lộ Trình", "Hỗ Trợ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#C9D1D9] hover:text-[#4DA8FF] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Công Ty</h4>
            <ul className="space-y-2">
              {["Về Chúng Tôi", "Blog", "Tuyển Dụng", "Liên Hệ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#C9D1D9] hover:text-[#4DA8FF] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Pháp Lý</h4>
            <ul className="space-y-2">
              {["Quyền Riêng Tư", "Điều Khoản", "Cookie", "Hỗ Trợ"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[#C9D1D9] hover:text-[#4DA8FF] transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#4DA8FF]/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#C9D1D9] text-sm">© {currentYear} Schedulr</p>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: Twitter, href: "#" },
              { icon: Github, href: "#" },
              { icon: Linkedin, href: "#" },
              { icon: Mail, href: "#" },
            ].map((social, index) => {
              const Icon = social.icon
              return (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg border border-[#4DA8FF]/30 flex items-center justify-center text-[#C9D1D9] hover:text-[#4DA8FF] hover:border-[#4DA8FF] transition-all duration-300 hover:shadow-lg hover:shadow-[#4DA8FF]/20 group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
