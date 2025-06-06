import { NextResponse } from 'next/server'
import { createBrowserClient } from '@/utils/supabase'

export async function GET(request: Request) {
  const supabase = createBrowserClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  const tags = await supabase
    .from('tags')
    .select('id, name')
    .ilike('name', `%${search}%`)
    .order('name', { ascending: true })

  return NextResponse.json(
    tags.data?.map((tag) => ({
      id: tag.id,
      label: tag.name,
      value: tag.name,
    })) || [],
    { status: tags.error ? 500 : 200 },
  )
}
