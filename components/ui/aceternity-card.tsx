"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AceternityCardProps {
  children: React.ReactNode
  className?: string
  index?: number
  isHovered?: boolean
  onHover?: (hovered: boolean) => void
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    rotate: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      bounce: 0.4,
      delay: 0,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    rotate: 0,
    transition: {
      duration: 0.2,
      type: "spring",
      bounce: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
}

export function AceternityCard({ 
  children, 
  className, 
  index = 0,
  isHovered = false,
  onHover
}: AceternityCardProps) {
  // Slight rotation for polaroid effect
  const rotation = (index % 3) - 1 // -1, 0, or 1 degree

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate={isHovered ? "hover" : "animate"}
      whileHover="hover"
      style={{
        transform: `rotate(${rotation}deg)`,
        perspective: 1000,
      }}
      onHoverStart={() => onHover?.(true)}
      onHoverEnd={() => onHover?.(false)}
      layout
    >
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          "bg-gradient-to-b from-amber-50/90 via-orange-50/90 to-yellow-50/90 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          "border-2 border-white/30 shadow-lg hover:shadow-2xl",
          "backdrop-blur-sm",
          className
        )}
      >
        {/* Polaroid-style border effect */}
        <div className="absolute inset-0 border-8 border-white/50 pointer-events-none" />
        <div className="absolute inset-0 border-2 border-gray-200/30 m-6 pointer-events-none" />
        
        {/* Tape effect */}
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-yellow-200/90 dark:bg-yellow-700/90 rotate-3 shadow-md"
          style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
        
        <CardContent className="p-6 h-full flex flex-col relative">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  )
}
