"use client"

import { useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number
      y: number
      length: number
      opacity: number
      speed: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 100 + 10,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 2 + 0.5,
      }))
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.moveTo(particle.x, particle.y)
        ctx.lineTo(particle.x + particle.length, particle.y)
        
        const gradient = ctx.createLinearGradient(
          particle.x,
          particle.y,
          particle.x + particle.length,
          particle.y
        )
        gradient.addColorStop(0, `rgba(139, 92, 246, 0)`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${particle.opacity})`)
        gradient.addColorStop(1, `rgba(236, 72, 153, 0)`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        particle.x += particle.speed
        particle.opacity -= 0.001

        if (particle.x > canvas.width || particle.opacity <= 0) {
          particle.x = -particle.length
          particle.y = Math.random() * canvas.height
          particle.opacity = Math.random() * 0.5 + 0.1
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 h-full w-full opacity-50",
        className
      )}
      style={{
        background: "transparent",
      }}
    />
  )
}
