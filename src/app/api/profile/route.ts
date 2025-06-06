import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/profile - Get user profile
export async function GET() {
  try {
    const cookiesStore = cookies()
    const supabase = createServerClient(cookiesStore)

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Get full name from user metadata
    const fullName = user.user_metadata?.full_name || ''

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName,
      username: profile?.username || '',
      title: profile?.title || '',
      bio: profile?.bio || '',
      avatarUrl: profile?.avatar_url || '',
      linkedin: profile?.linkedin || '',
      github: profile?.github || '',
      instagram: profile?.instagram || '',
    })
  } catch (error) {
    console.error('Error in GET /api/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// PUT /api/profile - Update user profile
export async function PUT(request: Request) {
  try {
    const cookiesStore = cookies()
    const supabase = createServerClient(cookiesStore)

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const json = await request.json()
    const { fullName, username, title, bio, linkedin, github, instagram } = json

    // Validate required fields
    if (!username?.trim()) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 },
      )
    }

    // Check if username is already taken by another user
    if (username.trim()) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.trim())
        .neq('id', user.id)
        .single()

      if (existingProfile) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 400 },
        )
      }
    }

    // Update full name in auth metadata if provided
    if (fullName !== undefined) {
      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          full_name: fullName,
        },
      })

      if (updateUserError) {
        console.error('Error updating user metadata:', updateUserError)
      }
    }

    // Prepare profile update data
    const profileData = {
      id: user.id,
      username: username.trim(),
      title: title?.trim() || null,
      bio: bio?.trim() || null,
      linkedin: linkedin?.trim() || null,
      github: github?.trim() || null,
      instagram: instagram?.trim() || null,
    }

    // update profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: user.id,
        email: user.email,
        fullName: fullName || user.user_metadata?.full_name || '',
        username: profile.username,
        title: profile.title,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        linkedin: profile.linkedin,
        github: profile.github,
        instagram: profile.instagram,
      },
    })
  } catch (error) {
    console.error('Error in PUT /api/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
