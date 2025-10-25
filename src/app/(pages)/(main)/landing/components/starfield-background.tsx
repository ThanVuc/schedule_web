"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  vx: number
  vy: number
  flickerSpeed: number
  baseOpacity: number
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    const starCount = 150
    let animationId: number
    let time = 0

    // lưu kích thước trước
    let prevWidth = window.innerWidth
    let prevHeight = window.innerHeight

    const createStars = () => {
      stars = []
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          opacity: Math.random() * 0.6 + 0.3,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          flickerSpeed: Math.random() * 0.05 + 0.02,
          baseOpacity: Math.random() * 0.6 + 0.3,
        })
      }
    }

    const resizeCanvas = () => {
      const newWidth = window.innerWidth
      const newHeight = window.innerHeight

      // tính tỉ lệ
      const ratioX = newWidth / prevWidth
      const ratioY = newHeight / prevHeight

      canvas.width = newWidth
      canvas.height = newHeight

      // cập nhật vị trí sao theo tỉ lệ
      stars.forEach(star => {
        star.x *= ratioX
        star.y *= ratioY
      })

      // cập nhật prev
      prevWidth = newWidth
      prevHeight = newHeight
    }

    // khởi tạo
    canvas.width = prevWidth
    canvas.height = prevHeight
    createStars()
    window.addEventListener("resize", resizeCanvas)

    const animate = () => {
      ctx.fillStyle = "rgba(10, 15, 28, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      time += 0.016

      stars.forEach((star) => {
        star.x += star.vx
        star.y += star.vy

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        star.opacity = star.baseOpacity + Math.sin(time * star.flickerSpeed) * star.baseOpacity * 0.5

        ctx.fillStyle = `rgba(77, 168, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
