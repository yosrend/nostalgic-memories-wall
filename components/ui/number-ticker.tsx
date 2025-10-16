"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface NumberTickerProps {
  value: number
  direction?: "up" | "down"
  delay?: number
  className?: string
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setDisplayValue(value)
        setIsAnimating(false)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [value, isAnimating])

  return (
    <div className={cn("relative inline-block", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={displayValue}
          initial={{ y: direction === "up" ? 20 : -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === "up" ? -20 : 20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="tabular-nums"
        >
          {displayValue.toLocaleString()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
