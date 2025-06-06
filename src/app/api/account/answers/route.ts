import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sortOrder = searchParams.get('sort') || 'newest'

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build base query
    let query = supabase
      .from('answers')
      .select(
        `
        id,
        content,
        marked,
        created_at,
        updated_at,
        question:questions(
          id,
          title,
          slug
        ),
        comments:comments(count)
      `,
        { count: 'exact' },
      )
      .eq('user_id', user.id)

    // Add search filter if provided
    if (search.trim()) {
      query = query.ilike('content', `%${search}%`)
    }

    // Add sorting
    if (sortOrder === 'oldest') {
      query = query.order('created_at', { ascending: true })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1)

    const { data: answers, error: answersError, count } = await query

    if (answersError) {
      console.error('Error fetching answers:', answersError)
      return NextResponse.json(
        { error: 'Failed to fetch answers' },
        { status: 500 },
      )
    }

    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      data: answers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count || 0,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    console.error('Error in GET /api/account/answers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
