"use server"

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPendingPosts() {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching pending posts:', error)
    throw error
  }
}

export async function getAllPosts() {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching all posts:', error)
    throw error
  }
}

export async function getApprovedPosts() {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching approved posts:', error)
    throw error
  }
}

export async function approvePost(postId: string) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'approved' })
      .eq('id', postId)
    
    if (error) throw error
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error approving post:', error)
    throw error
  }
}

export async function rejectPost(postId: string) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'rejected' })
      .eq('id', postId)
    
    if (error) throw error
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error rejecting post:', error)
    throw error
  }
}

export async function deletePost(postId: string) {
  const supabase = createServerClient()
  
  try {
    // First get the post to check if it has an image
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('image_url')
      .eq('id', postId)
      .single()
    
    if (fetchError) throw fetchError
    
    // Delete associated image if exists
    if (post?.image_url) {
      const { error: deleteImageError } = await supabase.storage
        .from('memory-images')
        .remove([post.image_url.split('/').pop() || ''])
      
      if (deleteImageError) {
        console.warn('Failed to delete image:', deleteImageError)
      }
    }
    
    // Delete the post
    const { error: deletePostError } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    
    if (deletePostError) throw deletePostError
    
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}
