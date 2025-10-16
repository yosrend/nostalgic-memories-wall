"use client"

import { cn } from "@/lib/utils"

interface GridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: number[][]
  className?: string
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares = [[0, 0], [width * 2, height * 2]],
  className,
}: GridPatternProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      {squares.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          width="100%"
          height="100%"
          x={x}
          y={y}
          strokeWidth="0"
          className="animate-pulse duration-[2s] ease-in-out fill-purple-500/20"
        />
      ))}
    </svg>
  )
}
