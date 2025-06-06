import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// POST /api/profile/avatar - Upload avatar
export async function POST(request: Request) {
  try {
    const cookiesStore = cookies()
    const supabase = createServerClient(cookiesStore)

    // Check if the request is authenticated
    if (!supabase.auth.getSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    // const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    // if (!allowedTypes.includes(file.type)) {
    //   return NextResponse.json(
    //     { error: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' },
    //     { status: 400 }
    //   )
    // }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 },
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 },
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('profiles').getPublicUrl(filePath)

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
      })
      .eq('id', user.id)

    console.log('Profile update error:', updateError)

    if (updateError) {
      // If profile update fails, try to delete the uploaded file
      await supabase.storage.from('profiles').remove([filePath])

      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      avatarUrl: publicUrl,
    })
  } catch (error) {
    console.error('Error in POST /api/profile/avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// DELETE /api/profile/avatar - Remove avatar
export async function DELETE() {
  try {
    const cookiesStore = cookies()
    const supabase = createServerClient(cookiesStore)

    // Check if the request is authenticated
    if (!supabase.auth.getSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current profile to find avatar URL
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // If there's an avatar URL, extract the file path and delete from storage
    if (profile?.avatar_url) {
      try {
        const url = new URL(profile.avatar_url)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const filePath = `avatars/${fileName}`

        // Delete from storage (don't fail if file doesn't exist)
        await supabase.storage.from('profiles').remove([filePath])
      } catch (storageError) {
        console.warn('Could not delete avatar file from storage:', storageError)
      }
    }

    // Update profile to remove avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to remove avatar' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: 'Avatar removed successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/profile/avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
