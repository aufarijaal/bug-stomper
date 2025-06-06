import { createServerClient } from '@/utils/supabase'
import { profile } from 'console'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// POST /api/questions - Create a new question
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

    const json = await request.json()
    const { title, content, tags, published = false } = json

    // Create URL-friendly slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Start a transaction
    const { data: question, error: questionError } = await supabase
      .from('questions')
      .insert({
        title,
        content,
        slug,
        user_id: user.id,
        profile_id: user.id, // Assuming profile_id is the same as user.id
        published,
      })
      .select()
      .single()

    if (questionError) {
      return NextResponse.json(
        { error: questionError.message },
        { status: 500 },
      )
    }

    // Insert tags if provided
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tagId: number) => ({
        question_id: question.id,
        tag_id: tagId,
      }))

      const { error: tagError } = await supabase
        .from('question_tags')
        .insert(tagInserts)

      if (tagError) {
        // If tag insertion fails, delete the question
        await supabase.from('questions').delete().eq('id', question.id)
        return NextResponse.json(
          { error: 'Failed to add tags' },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(question)
  } catch (error) {
    console.error('Error in POST /api/questions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
