"use server"

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function togglePostVisibility(postId: string, isVisible: boolean) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('posts')
      .update({ is_visible: isVisible })
      .eq('id', postId)
    
    if (error) throw error
    
    revalidatePath('/dashboard')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error toggling post visibility:', error)
    throw error
  }
}

export async function getVisiblePosts() {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'approved')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching visible posts:', error)
    throw error
  }
}

export async function getFilteredPosts(dateFilter?: string) {
  const supabase = createServerClient()
  
  try {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply date filter if provided
    if (dateFilter) {
      const today = new Date()
      let filterDate: Date
      
      switch (dateFilter) {
        case 'today':
          filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
          break
        case 'week':
          filterDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          filterDate = new Date(today.getFullYear(), today.getMonth(), 1)
          break
        default:
          filterDate = new Date(0) // Beginning of time
      }
      
      query = query.gte('created_at', filterDate.toISOString())
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching filtered posts:', error)
    throw error
  }
}
