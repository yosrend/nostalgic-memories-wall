"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Post } from "@/lib/supabase/types"
import { Button } from "@/components/ui/button"
import { SubmissionModal } from "@/components/submission-modal"
import MemoryCard from "@/components/memory-card"
import { Plus } from "lucide-react"

export default function SimpleHome() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to immediately add new post (bypass cache delay)
  const handleNewPost = (newPost: any) => {
    console.log('🚀 Immediate post update (bypassing cache):', newPost.content?.substring(0, 30) + '...')
    setPosts(prev => {
      // Check if already exists to prevent duplicates
      if (prev.some(post => post.id === newPost.id)) {
        return prev
      }
      return [newPost, ...prev]
    })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('post-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: 'status=eq.approved'
        },
        (payload) => {
          console.log('🎉 New approved post:', payload)
          const newPost = payload.new as Post
          
          // Add the new post to the beginning of the list
          setPosts(prev => {
            // Check if it's already in the list (prevent duplicates)
            if (prev.some(post => post.id === newPost.id)) {
              return prev
            }
            return [newPost, ...prev]
          })
          
          // Optional: Show a subtle notification
          console.log('New Memory Added:', newPost.content?.substring(0, 50) + '...')
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Post updated:', payload)
          if (payload.new?.status === 'approved') {
            setPosts(prev => {
              const exists = prev.some(post => post.id === payload.new.id)
              if (exists) {
                return prev.map(post => 
                  post.id === payload.new.id ? payload.new as Post : post
                )
              } else {
                return [payload.new as Post, ...prev]
              }
            })
          } else {
            // Post was rejected/hidden
            setPosts(prev => prev.filter(post => post.id !== payload.new.id))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Post deleted:', payload)
          setPosts(prev => prev.filter(post => post.id !== payload.old.id))
        }
      )
      .subscribe((status, err) => {
        if (err) {
          console.error('Realtime subscription error:', err)
        } else {
          console.log('Realtime subscription status:', status)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Fallback polling every 30 seconds to ensure we don't miss updates
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Refreshing posts (fallback polling)')
      fetchPosts()
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchPosts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading memories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 relative">
        {/* Fixed Share Button - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          <SubmissionModal onSuccessfulSubmit={handleNewPost}>
            <Button 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-105"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Share Memory</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </SubmissionModal>
        </div>
        
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to MAHWA 2006
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            AI-Powered Memory Management System
          </p>
          <div className="flex justify-center">
            <p className="text-sm bg-green-500/20 px-6 py-2 rounded-full border border-green-400">
              ✅ Server Connected • Supabase Active
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            {posts.length} {posts.length === 1 ? 'Memory' : 'Memories'} Shared
          </h2>
          <p className="text-gray-600">
            Join our growing community and share your MAHWA 2006 memories!
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📸</div>
            <h3 className="text-2xl font-bold mb-4">No memories yet</h3>
            <p className="text-gray-600 mb-8">
              Be the first to share your MAHWA 2006 memories!
            </p>
            <SubmissionModal onSuccessfulSubmit={handleNewPost}>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105">
                <Plus className="h-5 w-5 mr-2" />
                Share Memory
              </Button>
            </SubmissionModal>
          </div>
        ) : (
          <div className="mx-auto" style={{ maxWidth: '1920px', padding: '0 4rem' }}>
            {/* Grid layout with 4 columns with more spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 py-16">
              {posts.map((post, index) => (
                <MemoryCard 
                  key={post.id}
                  post={post} 
                  index={index} 
                  enableInteractions={true} 
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
