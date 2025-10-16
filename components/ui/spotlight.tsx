"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  size?: number
  color?: string
}

export function Spotlight({
  className,
  size = 400,
  color = "rgba(139, 92, 246, 0.15)",
}: SpotlightProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
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
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${size}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${color}, transparent)`,
        }}
      />
    </div>
  )
}
