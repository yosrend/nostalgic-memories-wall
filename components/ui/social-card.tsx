"use client";

import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Link as LinkIcon,
} from "lucide-react";
import { useState } from "react";

interface SocialCardProps {
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
  };
  content?: {
    text?: string;
    hashtag?: string;
    link?: {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    };
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
  };
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  className?: string;
}

export function SocialCard({
  author,
  content,
  engagement,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onMore,
  className
}: SocialCardProps) {
  const [isLiked, setIsLiked] = useState(engagement?.isLiked ?? false);
  const [isBookmarked, setIsBookmarked] = useState(engagement?.isBookmarked ?? false);
  const [likes, setLikes] = useState(engagement?.likes ?? 0);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-white/95 backdrop-blur-sm",
        "border border-gray-200",
        "rounded-2xl shadow-lg hover:shadow-xl transition-shadow",
        className
      )}
    >
      <div className="divide-y divide-zinc-200">
        <div className="p-6">
          {/* Author section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center ring-2 ring-white">
                {author?.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {author?.name?.slice(0, 2).toUpperCase() || 'AN'}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-900">
                  {author?.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  @{author?.username} · {author?.timeAgo}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onMore}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          {/* Content section */}
          <p className="text-zinc-600 mb-4">
            {content?.text}
          </p>

          {/* Hashtag display */}
          {content?.hashtag && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                #{content.hashtag}
              </span>
            </div>
          )}

          {/* Link preview */}
          {content?.link && (
            <div className="mb-4 rounded-2xl border border-zinc-200 overflow-hidden">
              <div className="p-4 bg-zinc-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white rounded-xl">
                    {content.link.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900">
                      {content.link.title}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {content.link.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement section */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors",
                  isLiked
                    ? "text-rose-600"
                    : "text-zinc-500 hover:text-rose-600"
                )}
              >
                <Heart
                  className={cn(
                    "w-5 h-5 transition-all",
                    isLiked && "fill-current scale-110"
                  )}
                />
                <span>{likes}</span>
              </button>
              <button
                type="button"
                onClick={onComment}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{engagement?.comments || 0}</span>
              </button>
              <button
                type="button"
                onClick={onShare}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>{engagement?.shares || 0}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-all",
                isBookmarked 
                  ? "text-yellow-500 bg-yellow-50" 
                  : "text-zinc-400 hover:bg-zinc-100"
              )}
            >
              <Bookmark className={cn(
                "w-5 h-5 transition-transform",
                isBookmarked && "fill-current scale-110"
              )} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
