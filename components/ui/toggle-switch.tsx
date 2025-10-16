"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  size = "md",
  className,
}: ToggleSwitchProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleToggle = async () => {
    if (disabled || isToggling) return
    
    setIsToggling(true)
    onChange(!checked)
    setTimeout(() => setIsToggling(false), 200)
  }

  const sizes = {
    sm: "h-5 w-9",
    md: "h-6 w-11", 
    lg: "h-7 w-13"
  }

  const thumbSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "relative p-0 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        sizes[size],
        className
      )}
      onClick={handleToggle}
      disabled={disabled}
    >
      <div
        className={cn(
          "relative inline-flex h-full w-full items-center rounded-full transition-colors duration-200",
          checked
            ? "bg-green-600 dark:bg-green-500"
            : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <motion.span
          className={cn(
            "inline-block rounded-full bg-white shadow-lg transition-transform",
            thumbSizes[size]
          )}
          animate={{
            x: checked ? "calc(100% - 100%)" : "0%"
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        
        {/* Status indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          <span
            className={cn(
              "text-xs font-medium transition-opacity",
              checked ? "opacity-0" : "opacity-100 text-gray-500"
            )}
          >
            OFF
          </span>
          <span
            className={cn(
              "text-xs font-medium transition-opacity", 
              checked ? "opacity-100 text-white" : "opacity-0"
            )}
          >
            ON
          </span>
        </div>
      </div>
    </Button>
  )
}
