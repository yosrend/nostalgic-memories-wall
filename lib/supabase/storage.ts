import { createServerClient } from './server'

export async function uploadMemoryImage(file: File) {
  const supabase = createServerClient()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `memory-images/${fileName}`

  console.log('Debug - Uploading image:', { fileName, fileSize: file.size, fileType: file.type })

  // validate file type and size
  if (!['jpg', 'jpeg', 'png'].includes(fileExt?.toLowerCase() || '')) {
    throw new Error('Invalid file type. Only JPEG and PNG images are allowed.')
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('File size too large. Maximum size is 5MB.')
  }

  const { error: uploadError } = await supabase.storage
    .from('memory-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Storage upload failed: ${uploadError.message}`)
  }

  const { data } = supabase.storage
    .from('memory-images')
    .getPublicUrl(filePath)

  console.log('Debug - Image public URL:', data.publicUrl)
  return data.publicUrl
}

export async function deleteMemoryImage(imageUrl: string) {
  try {
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const filePath = `memory-images/${fileName}`

    const { error } = await supabase.storage
      .from('memory-images')
      .remove([filePath])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}
