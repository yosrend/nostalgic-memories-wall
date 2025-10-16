"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Post } from "@/lib/supabase/types"
import { toggleLike, hasUserLikedPost } from "@/lib/likes-service"
import format from "date-fns/format"

interface MemoryCardProps {
  post: Post
  index: number
  enableInteractions?: boolean
  adminMode?: boolean
}

export default function MemoryCard({ post, index, enableInteractions = true, adminMode = false }: MemoryCardProps) {
  const [localLikes, setLocalLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(false)
  const [showSuccess, setShowSuccess] = useState<string | false>(false)
  const [showError, setShowError] = useState("")

  // Random gradient variants for visual variety
  const gradients = [
    'from-[#C48EFF] to-[#FCCEED]',
    'from-[#FF6B6B] to-[#4ECDC4]', 
    'from-[#A8E6CF] to-[#7FD1B9]',
    'from-[#FF6B9D] to-[#C44569]',
    'from-[#667EEA] to-[#764BA2]',
    'from-[#F093FB] to-[#F5576C]',
    'from-[#4FACFE] to-[#00F2FE]',
    'from-[#43E97B] to-[#38F9D7]',
    'from-[#FA709A] to-[#FEE140]',
    'from-[#30CFD0] to-[#330867]',
    'from-[#FFB6AA] to-[#6D6875]',
    'from-[#8B5CF6] to-[#EC4899]'
  ]
  
  const randomGradient = gradients[index % gradients.length]
  
  // Random rotation and positioning inspired by Braydon Coyer's layout
  const rotations = [-3, -2, -1, 0, 1, 2, 3] // Degrees
  const randomRotate = rotations[index % rotations.length]
  
  // Fixed positions for 4 cards per row - always left to right alignment
  const cardInRowPosition = index % 4
  
  const positions = [
    { top: '1rem', left: '0.5rem' },      // Card 1: Top-left
    { top: '0.5rem', left: '6rem' },      // Card 2: Top-center  
    { top: '1.5rem', left: '11.5rem' },     // Card 3: Top-right-ish
    { top: '0.5rem', left: '17rem' }      // Card 4: Far-right
  ]
  
  // Random skew values for more interesting left/right tilt
  const skews = [-2, -1, 0, 1, 2] // Degrees of skew
  const randomSkew = skews[cardInRowPosition]

  // Check if user has already liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      const liked = await hasUserLikedPost(post.id)
      setIsLiked(liked)
    }
    checkLikeStatus()
  }, [post.id])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return format(date, 'MMM d, yyyy')
    }
  }

  const handleLike = async () => {
    if (!enableInteractions) return
    
    try {
      const result = await toggleLike(post.id)
      
      if (result.error) {
        setShowError(result.error)
        return
      }
      
      // Update local state with the response
      setLocalLikes(result.totalLikes)
      setIsLiked(result.liked)
      
      const message = result.liked ? "Memory liked!" : "Like removed!"
      setShowSuccess(message)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error('Error toggling like:', error)
      setShowError("Failed to toggle like")
    }
  }

  const handleComment = () => {
    if (!enableInteractions) return
    console.log('Comment on post:', post.id)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}?memory=${post.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MAHWA 2006 Memory",
          text: post.content,
          url: shareUrl
        })
      } catch (error) {
        // Handle user cancel or share error
        if ((error as Error).name !== 'AbortError' && (error as Error).name !== 'NotAllowedError') {
          // Fallback to clipboard if share fails for other reasons
          await navigator.clipboard.writeText(shareUrl)
          setShowSuccess("Link copied!")
          setTimeout(() => setShowSuccess(false), 2000)
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setShowSuccess("Link copied!")
        setTimeout(() => setShowSuccess(false), 2000)
      } catch (error) {
        setShowError("Failed to copy link")
        setTimeout(() => setShowError(""), 2000)
      }
    }
  }

  const handleBookmark = () => {
    console.log('Bookmark post:', post.id)
  }

  const handleMore = () => {
    console.log('More options for post:', post.id)
  }

  

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: randomRotate === 0 ? -2 : randomRotate + 2 }}
        animate={{ opacity: 1, scale: 1, rotate: randomRotate, top: 0 }}
        whileHover={{ 
          scale: 1.05, 
          rotate: 0, 
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-[#F7F7F8] rounded-xl border-2 border-[#A5AEB8/12] p-2.5 transition-all duration-300 shadow-[12px_12px_0px_0px_rgba(214,218,222,0.3)] w-[250px] h-[300px] flex flex-col"  
        style={{
          transform: `rotate(${randomRotate}deg) skewX(${randomSkew}deg)`
        }}
      >
        {/* Author Section */}
        <div className="flex items-start gap-2 mb-3">
          <div className="flex-shrink-0">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.is_anonymous ? 'Anonymous' : post.name || 'Memory Sharer'}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {(post.is_anonymous ? 'Anonymous' : post.name || 'Memory Sharer').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.is_anonymous ? 'Anonymous' : post.name || 'Memory Sharer'}
            </h3>
            <p className="text-xs text-gray-500">
              {getTimeAgo(post.created_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className={`mb-6 flex-1 overflow-hidden z-10 relative w-full h-full flex items-center justify-center bg-gradient-to-b ${randomGradient} rounded-md p-6 shadow-lg`}>
          <p className="font-bold text-xl text-center text-balance text-white line-clamp-6">
            {post.content}
          </p>
        </div>

        {/* Engagement */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <svg 
              className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">{localLikes}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2 py-1 text-gray-500 rounded hover:text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 10.326m9.032 4.026a9.001 9.001 0 01-7.432 0" />
            </svg>
            <span className="text-xs">Share</span>
          </button>
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {showSuccess}
        </motion.div>
      )}

      {showError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          {showError}
        </motion.div>
      )}
    </>
  )
}
