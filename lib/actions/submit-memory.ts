"use server"

import { createServerClient } from '@/lib/supabase/server'
import { uploadMemoryImage } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const submitMemorySchema = z.object({
  content: z.string().min(1, "Please write something about your memory").max(500, "Memory must be less than 500 characters"),
  name: z.string().optional(),
  isAnonymous: z.boolean(),
  imageFile: z.instanceof(File).optional(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    threads: z.string().optional(),
    x: z.string().optional(),
    whatsapp: z.string().optional(),
  }).optional()
})

export async function submitMemory(formData: FormData) {
  const supabase = createServerClient()
  
  try {
    // Extract and debug form data
    const content = formData.get('content') as string
    const name = formData.get('name') as string || ''
    const isAnonymous = formData.get('isAnonymous') === 'true'
    const imageFile = formData.get('image') as File
    const socialJson = formData.get('socialLinks') as string || '{}'

    console.log('Debug - Form data:', { content, name, isAnonymous, imageFile: imageFile?.name })

    // Validate form data
    const validatedData = submitMemorySchema.parse({
      content,
      name,
      isAnonymous,
      imageFile: imageFile && imageFile.size > 0 ? imageFile : undefined,
      socialLinks: socialJson ? JSON.parse(socialJson) : undefined
    })

    console.log('Debug - Validated data:', { ...validatedData, imageFile: validatedData.imageFile?.name })

    // Upload image if provided
    let imageUrl = null
    if (validatedData.imageFile) {
      try {
        imageUrl = await uploadMemoryImage(validatedData.imageFile)
        console.log('Debug - Image uploaded successfully:', imageUrl)
      } catch (imageError) {
        console.error('Failed to upload image:', imageError)
        // Continue without image, but log the error
        throw new Error(`Image upload failed: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`)
      }
    }

    // Prepare post data using only existing columns
    const postData = {
      content: validatedData.content,
      name: validatedData.isAnonymous ? null : (validatedData.name || 'Anonymous'),
      is_anonymous: validatedData.isAnonymous,
      image_url: imageUrl,
      status: 'approved'
    }

    console.log('Debug - Post data to insert:',postData)

    // Insert post with error handling
    const { data: post, error: postError } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (postError) {
      console.error('Post insert error:', postError)
      throw new Error(`Database error: ${postError.message}`)
    }

    console.log('Debug - Post created successfully:', post)

    revalidatePath('/')
    
    return { 
      success: true, 
      postId: post.id,
      post: post, // Include the full post data
      message: "Your memory has been shared successfully! It's now visible on the wall."
    }
  } catch (error) {
    console.error('Error submitting memory:', error)
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.issues[0]?.message || "Validation failed" 
      }
    }
    
    if (error instanceof Error) {
      return { 
        success: false, 
        error: error.message 
      }
    }
    
    return { 
      success: false, 
      error: "Failed to submit memory. Please try again." 
    }
  }
}
