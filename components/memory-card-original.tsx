"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Post } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Heart, MessageCircle, Share2, User, Settings } from "lucide-react"
import { AceternityCard } from "@/components/ui/aceternity-card"
import { GlareEffect } from "@/components/ui/glare-effect"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { cn } from "@/lib/utils"
import format from "date-fns/format"
import Image from "next/image"

interface MemoryCardProps {
  post: Post
  index: number
  enableInteractions?: boolean
  adminMode?: boolean
  onToggleVisibility?: (postId: string, isVisible: boolean) => void
  visibilityLoading?: string | null
}

const actionButtonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  hover: { scale: 1.1, rotate: 5 },
  tap: { scale: 0.95 },
}

export function MemoryCard({ post, index, enableInteractions = true, adminMode = false, onToggleVisibility, visibilityLoading }: MemoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement like functionality
    console.log("Like post:", post.id)
  }

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement comment functionality
    console.log("Comment on post:", post.id)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Implement share functionality
    console.log("Share post:", post.id)
  }

  const handleCardClick = () => {
    if (enableInteractions) {
      setExpanded(!expanded)
    }
  }

  return (
    <AceternityCard
      index={index}
      isHovered={isHovered}
      onHover={setIsHovered}
      className="min-h-[280px] group"
      onClick={handleCardClick}
    >
      {/* Memory Image */}
      {post.image_url && (
        <div className="mb-4 -mx-6 -mt-6 h-48 relative overflow-hidden rounded-t-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-10" />
          <Image
            src={post.image_url}
            alt="Memory image"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Quick actions overlay */}
          {enableInteractions && (
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-2 right-2 left-2 z-20"
                >
                  <div className="flex gap-2 justify-end">
                    <motion.div variants={actionButtonVariants}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md"
                        onClick={handleLike}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div variants={actionButtonVariants}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md"
                        onClick={handleComment}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </motion.div>
                    <motion.div variants={actionButtonVariants}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Memory Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.image_url || undefined} />
            <AvatarFallback>
              {post.is_anonymous ? null : post.name?.charAt(0)?.toUpperCase()}
              {post.is_anonymous && <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {post.is_anonymous ? 'Anonymous' : (post.name || 'Anonymous')}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>

        {/* Memory Text */}
        <div className="relative">
          <p className={cn(
            "text-sm leading-relaxed transition-all duration-300",
            expanded ? "line-clamp-none" : "line-clamp-2"
          )}>
            {post.content}
          </p>
          {!expanded && post.content.length > 100 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="text-xs text-muted-foreground mt-1"
            >
              {"Read more..."}
            </motion.p>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {/* TODO: Replace with actual reaction count */}
              {post.likes_count || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {/* TODO: Replace with actual comment count */}
              0
            </span>
            
            
          </div>
          
          {/* Expansion indicator */}
          {post.content.length > 100 && enableInteractions && (
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-muted-foreground"
              >
                ‼
              </Button>
            </motion.div>
          )}
        </div>

        {/* Visibility Toggle - Admin Only */}
        {adminMode && onToggleVisibility && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Settings className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Show on Homepage:</span>
            </div>
            <ToggleSwitch
              checked={post.is_visible}
              onChange={(checked) => onToggleVisibility(post.id, checked)}
              disabled={visibilityLoading === `visibility-${post.id}`}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    <GlareEffect 
        glareSize={150} 
        opacity={0.3} 
        className="absolute inset-0 rounded-lg" 
      />
    </AceternityCard>
  )
}
