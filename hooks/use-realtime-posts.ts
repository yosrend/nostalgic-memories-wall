"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Post } from '@/lib/supabase/types'

export function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      setPosts(data || [])
    }

    fetchPosts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          console.log('Real-time post change:', payload)
          
          switch (payload.eventType) {
            case 'INSERT':
              setPosts(prev => [payload.new as Post, ...prev])
              break
            case 'UPDATE':
              setPosts(prev => 
                prev.map(post => 
                  post.id === payload.new?.id ? payload.new as Post : post
                )
              )
              break
            case 'DELETE':
              setPosts(prev => 
                prev.filter(post => post.id !== payload.old.id)
              )
              break
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return posts
}
