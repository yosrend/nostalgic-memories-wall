import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  className?: string
  size?: "sm" | "default" | "lg"
  text?: string
}

export function LoadingSpinner({ 
  className, 
  size = "default", 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8"
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-amber-600", sizeClasses[size])} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
  color?: string
}

export function LoadingDots({ className, color = "bg-amber-600" }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className={`w-2 h-2 rounded-full ${color} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${color} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${color} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  )
}

interface PageLoadingProps {
  message?: string
  minimal?: boolean
}

export function PageLoading({ message = "Loading memories...", minimal = false }: PageLoadingProps) {
  if (minimal) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner text={message} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <LoadingSpinner size="lg" />
        </div>
        <p className="text-lg text-muted-foreground mb-4">{message}</p>
        <LoadingDots className="mt-4" />
        
        <div className="mt-8 flex justify-center space-x-2">
          <div className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>📸</div>
          <div className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>🎓</div>
          <div className="text-3xl animate-bounce" style={{ animationDelay: '400ms' }}>✨</div>
        </div>
      </div>
    </div>
  )
}

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800 animate-pulse",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-amber-200 dark:bg-amber-800/50 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-amber-200 dark:bg-amber-800/50 rounded w-3/4"></div>
            <div className="h-3 bg-amber-200 dark:bg-amber-800/50 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-amber-200 dark:bg-amber-800/50 rounded"></div>
          <div className="h-3 bg-amber-200 dark:bg-amber-800/50 rounded w-5/6"></div>
          <div className="h-3 bg-amber-200 dark:bg-amber-800/50 rounded w-4/6"></div>
        </div>
      </div>
      
      {/* Polaroid-style border effect */}
      <div className="absolute inset-0 border-8 border-white/50 pointer-events-none" />
      <div className="absolute inset-0 border-2 border-amber-200/30 m-6 pointer-events-none" />
      
      {/* Tape effect */}
      <div 
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-yellow-300/50 dark:bg-yellow-700/50 rotate-3"
        style={{
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  )
}
