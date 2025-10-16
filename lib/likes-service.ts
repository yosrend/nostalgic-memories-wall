import { supabase } from '@/lib/supabase/client'

// Get client IP address from headers (client-side estimation)
async function getClientIP(): Promise<string> {
  try {
    // Use localStorage to maintain consistent client ID
    let clientId = localStorage.getItem('clientId')
    if (!clientId) {
      clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('clientId', clientId)
    }
    return clientId
  } catch (error) {
    // Fallback if localStorage is not available
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Check if user has already liked a post
export async function hasUserLikedPost(postId: string): Promise<boolean> {
  try {
    const clientIP = await getClientIP()
    
    // For now, we'll store likes in localStorage as a simple solution
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    
    // In production, this would be a database query:
    // const { data } = await supabase
    //   .from('likes')
    //   .select('*')
    //   .eq('post_id', postId)
    //   .eq('ip_address', clientIP)
    //   .single()
    // 
    // return !!data
    
    return likedPosts[postId] === true
  } catch (error) {
    console.error('Error checking like status:', error)
    return false
  }
}

// Toggle like/unlike for a post
export async function toggleLike(postId: string): Promise<{ liked: boolean; totalLikes: number; error?: string }> {
  try {
    const clientIP = await getClientIP()
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    
    // Check if user already liked this post
    if (likedPosts[postId]) {
      // Unlike - remove from likes table
      delete likedPosts[postId]
      
      // Remove from likes table
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', clientIP)
      
      if (error) {
        console.error('Error removing like:', error)
        return { liked: false, totalLikes: 0, error: 'Failed to remove like' }
      }
      
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
      
      // Get updated count
      const totalLikes = await getLikeCount(postId)
      return { liked: false, totalLikes }
    } else {
      // Like - add to likes table
      likedPosts[postId] = true
      
      // Add to likes table
      const { error } = await supabase
        .from('likes')
        .insert([{
          post_id: postId,
          user_id: clientIP
        }])
      
      if (error) {
        console.error('Error adding like:', error)
        return { liked: false, totalLikes: 0, error: 'Failed to add like' }
      }
      
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
      
      // Get updated count
      const totalLikes = await getLikeCount(postId)
      return { liked: true, totalLikes }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return { liked: false, totalLikes: 0, error: 'Failed to toggle like' }
  }
}

// Get like count for a post (count from likes table)
export async function getLikeCount(postId: string): Promise<number> {
  try {
    // Try to get from likes_count column first (if it exists)
    try {
      const { data } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single()
      
      return data?.likes_count || 0
    } catch (e) {
      // If likes_count column doesn't exist, count from likes table
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
      
      return count || 0
    }
  } catch (error) {
    console.error('Error getting like count:', error)
    return 0
  }
}
