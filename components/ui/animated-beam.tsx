"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

interface AnimatedBeamProps {
  className?: string
  containerRef: React.RefObject<HTMLElement>
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  curvature?: number
  reverse?: boolean
  pathLength?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const ref = useRef<SVGPathElement>(null)
  const pathLength = useMotionValue(0)
  const progress = useSpring(0, {
    stiffness: 400,
    damping: 40,
  })

  const svgX = useMotionValue(0)
  const svgY = useMotionValue(0)

  const startX = useMotionValue(0)
  const startY = useMotionValue(0)
  const endX = useMotionValue(0)
  const endY = useMotionValue(0)

  useEffect(() => {
    const calculatePath = () => {
      if (
        containerRef.current &&
        fromRef.current &&
        toRef.current
      ) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const fromRect = fromRef.current.getBoundingClientRect()
        const toRect = toRef.current.getBoundingClientRect()

        const containerCenterX = containerRect.left + containerRect.width / 2
        const containerCenterY = containerRect.top + containerRect.height / 2

        const fromCenterX = fromRect.left + fromRect.width / 2
        const fromCenterY = fromRect.top + fromRect.height / 2

        const toCenterX = toRect.left + toRect.width / 2
        const toCenterY = toRect.top + toRect.height / 2

        const relativeStartX = fromCenterX - containerCenterX + startXOffset
        const relativeStartY = fromCenterY - containerCenterY + startYOffset
        const relativeEndX = toCenterX - containerCenterX + endXOffset
        const relativeEndY = toCenterY - containerCenterY + endYOffset

        const svgLeft = Math.min(relativeStartX, relativeEndX) - 50
        const svgTop = Math.min(relativeStartY, relativeEndY) - 50
        const svgWidth = Math.abs(relativeEndX - relativeStartX) + 100
        const svgHeight = Math.abs(relativeEndY - relativeStartY) + 100

        svgX.set(svgLeft)
        svgY.set(svgTop)

        startX.set(relativeStartX - svgLeft)
        startY.set(relativeStartY - svgTop)
        endX.set(relativeEndX - svgLeft)
        endY.set(relativeEndY - svgTop)

        if (ref.current) {
          const path = ref.current
          const length = path.getTotalLength()
          pathLength.set(length)
        }
      }
    }

    calculatePath()

    const resizeObserver = new ResizeObserver(calculatePath)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [
    containerRef,
    fromRef,
    toRef,
    pathLength,
    svgX,
    svgY,
    startX,
    startY,
    endX,
    endY,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ])

  useEffect(() => {
    progress.set(0)
    const timer = setTimeout(() => {
      progress.set(reverse ? pathLength.get() : 0)
    }, 100)

    const animationTimer = setTimeout(() => {
      progress.set(reverse ? 0 : pathLength.get())
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(animationTimer)
    }
  }, [pathLength, progress, reverse, duration])

  const x1 = useTransform(startX, (value) => value)
  const y1 = useTransform(startY, (value) => value)
  const x2 = useTransform(endX, (value) => value)
  const y2 = useTransform(endY, (value) => value)

  return (
    <svg
      ref={ref}
      width="100%"
      height="100%"
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${svgX.get()}px, ${svgY.get()}px)`,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      <defs>
        <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
        </linearGradient>
        <filter id="beam-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - curvature} ${x2} ${y2}`}
        stroke="url(#beam-gradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#beam-glow)"
      />
      <motion.circle
        cx={x1}
        cy={y1}
        r="4"
        fill="#3b82f6"
        animate={{
          cx: x2,
          cy: y2,
        }}
        transition={{
          duration,
          ease: [0.4, 0, 0.2, 1],
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />
    </svg>
  )
}
