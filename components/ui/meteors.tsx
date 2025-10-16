"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MeteorsProps {
  number?: number
  className?: string
}

export function Meteors({ number = 20, className }: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<Array<{ top: number; left: number; animationDelay: number; animationDuration: number }>>([])

  useEffect(() => {
    const styles = Array.from({ length: number }, () => ({
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 100),
      animationDelay: Math.random() * 2 + 0.5,
      animationDuration: Math.floor(Math.random() * 2 + 1),
    }))
    setMeteorStyles(styles)
  }, [number])

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "pointer-events-none absolute block h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            className
          )}
          style={{
            top: `${style.top}%`,
            left: `${style.left}%`,
            animationDelay: `${style.animationDelay}s`,
            animationDuration: `${style.animationDuration}s`,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div className="pointer-events-none absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  )
}
