"use server"

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addReaction(postId: string, emoji: string) {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('reactions')
      .insert([{ post_id: postId, emoji }])
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/')
    return { data, error: null }
  } catch (error) {
    console.error('Error adding reaction:', error)
    return { data: null, error: 'Failed to add reaction' }
  }
}

export async function removeReaction(reactionId: string) {
  const supabase = createServerClient()
  
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', reactionId)
    
    if (error) throw error
    
    revalidatePath('/')
    return { error: null }
  } catch (error) {
    console.error('Error removing reaction:', error)
    return { error: 'Failed to remove reaction' }
  }
}

export async function getReactions(postId: string) {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    // Group by emoji and count
    const reactionCounts = data?.reduce((acc, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}
    
    return reactionCounts
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return {}
  }
}
