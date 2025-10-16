"use server"

import { createServerClient } from '@/lib/supabase/server'
import { uploadMemoryImage } from '@/lib/supabase/storage'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment must be less than 500 characters"),
  postId: z.string().uuid(),
  imageFile: z.instanceof(File).optional(),
})

export async function addComment(formData: FormData) {
  const supabase = createServerClient()
  
  try {
    // Extract and validate form data
    const content = formData.get('content') as string
    const postId = formData.get('postId') as string
    const imageFile = formData.get('image') as File

    const validatedData = commentSchema.parse({
      content,
      postId,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined
    })

    // Upload image if provided
    let imageUrl = null
    if (validatedData.imageFile) {
      imageUrl = await uploadMemoryImage(validatedData.imageFile)
    }

    // Insert comment
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id: validatedData.postId,
        content: validatedData.content,
        image_url: imageUrl,
      }])
      .select()
      .single()

    if (error) throw error
    
    revalidatePath('/')
    return { 
      success: true, 
      data,
      error: null 
    }
  } catch (error) {
    console.error('Error adding comment:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || "Validation failed",
        data: null
      }
    }
    
    return { 
      success: false, 
      error: "Failed to add comment",
      data: null
    }
  }
}

export async function getComments(postId: string, limit = 10, offset = 0) {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    
    return data || []
  } catch (error) {
    console.error('Error fetching comments:', error)
    return []
  }
}

export async function likeComment(commentId: string) {
  const supabase = createServerClient()
  
  try {
    const { data, error } = await supabase
      .from('comments')
      .update({ 
        -- Increase a like count field if it exists, or add reaction logic here
      })
      .eq('id', commentId)
      .select()
      .single()
    
    if (error) throw error
    
    revalidatePath('/')
    return { data, error: null }
  } catch (error) {
    console.error('Error liking comment:', error)
    return { data: null, error: 'Failed to like comment' }
  }
}
