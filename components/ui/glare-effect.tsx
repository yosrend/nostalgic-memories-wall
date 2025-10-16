"use client"

import { useMotionValue, useSpring } from "framer-motion"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlareEffectProps {
  className?: string
  glareSize?: number
  opacity?: number
  color?: string
}

export function GlareEffect({
  className,
  glareSize = 200,
  opacity = 0.8,
  color = "white",
}: GlareEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 400, damping: 40 })
  const springY = useSpring(mouseY, { stiffness: 400, damping: 40 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        mouseX.set(x)
        mouseY.set(y)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [mouseX, mouseY])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(${glareSize}px circle at ${springX}px ${springY}px, ${color}, transparent)`,
          opacity,
          mixBlendMode: "overlay",
          willChange: "transform",
        }}
      />
    </div>
  )
}
