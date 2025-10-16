"use server"

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string, userId: string) {
  const supabase = createServerClient()
  
  try {
    // Check if user already liked this post
    const { data: existingLike } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    
    let newLikesCount: number
    
    if (existingLike) {
      //Unlike the post
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)
      
      // Decrement likes count
      newLikesCount = await updateLikesCount(postId, -1)
    } else {
      // Like the post
      await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }])
      
      // Increment likes count
      newLikesCount = await updateLikesCount(postId, +1)
    }
    
    revalidatePath('/')
    revalidatePath('/dashboard')
    
    return { 
      success: true, 
      liked: !existingLike,
      likesCount: newLikesCount
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    throw error
  }
}

async function updateLikesCount(postId: string, increment: number): Promise<number> {
  const supabase = createServerClient()
  
  try {
    // Get current likes count
    const { data: post } = await supabase
      .from('posts')
      .select('likes_count')
      .eq('id', postId)
      .single()
    
    const currentCount = post?.likes_count || 0
    const newCount = Math.max(0, currentCount + increment)
    
    // Update likes count
    await supabase
      .from('posts')
      .update({ likes_count: newCount })
      .eq('id', postId)
    
    return newCount
  } catch (error) {
    console.error('Error updating likes count:', error)
    throw error
  }
}

export async function getUserLikeStatus(postId: string, userId: string) {
  const supabase = createServerClient()
  
  try {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    
    return !!data
  } catch (error) {
    return false
  }
}

export async function getPostsWithLikeStatus(posts: any[], userId: string) {
  const supabase = createServerClient()
  
  try {
    if (posts.length === 0) return posts
    
    const postIds = posts.map(post => post.id)
    
    // Get all likes for these posts by this user
    const { data: userLikes } = await supabase
      .from('likes')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds)
    
    const likedPostIds = new Set(userLikes?.map(like => like.post_id) || [])
    
    // Add like status to each post
    return posts.map(post => ({
      ...post,
      isLiked: likedPostIds.has(post.id)
    }))
  } catch (error) {
    console.error('Error getting like status:', error)
    return posts
  }
}
