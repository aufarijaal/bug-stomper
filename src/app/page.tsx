import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import Image from 'next/image'
import { QuestionCard } from '@/components/question-card'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'
import { Skeleton } from '@/components/ui/skeleton'
import { QuestionCardProps } from '@/@types'

export const metadata: Metadata = {
  title: 'Bug Stomper',
  description: 'Stomp the bug together with the community',
}

interface Tag {
  id: number
  name: string
}

interface PublicData {
  tags: number
  profiles: number
  questions: number
}

async function getHomepageQuestions(): Promise<QuestionCardProps[]> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data: questions, error: questionError } = await supabase
      .from('questions')
      .select(
        `
        id,
        title,
        slug,
        raw,
        published,
        created_at,
        updated_at,
        profile_id,
        user_id,
        profiles!inner(id, username, avatar_url),
        answers!outer(id, marked)
      `,
        { count: 'exact' },
      )
      .eq('published', true)
      .limit(6)
      .order('created_at', { ascending: false })

    if (questionError) {
      console.error('Error fetching homepage questions:', questionError)
      return []
    }
    return questions.map((question) => ({
      id: question.id,
      title: question.title,
      raw: question.raw,
      slug: question.slug,
      published: question.published,
      createdAt: question.created_at,
      answerCount: question.answers.length || 0,
      hasAcceptedAnswer:
        question.answers?.some((answer) => answer.marked) || false,
      author: {
        username: question.profiles?.[0]?.username || 'Unknown',
        avatarUrl:
          question.profiles?.[0]?.avatar_url || '/avatar-placeholder.png',
      },
      tags: [], // You may want to add tags from your data structure
    }))
  } catch (error) {
    console.error('Error in getHomepageQuestions:', error)
    return []
  }
}

async function getPublicData(): Promise<PublicData> {
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { data, error } = await supabase.functions.invoke(
      'count-public-data',
      {
        body: { name: 'Functions' },
      },
    )

    if (error) {
      console.error('Error fetching public data:', error)
      // Return default values if the edge function fails
      return {
        questions: 0,
        tags: 0,
        profiles: 0,
      }
    }

    return (
      data || {
        questions: 0,
        tags: 0,
        profiles: 0,
      }
    )
  } catch (error) {
    console.error('Error in getPublicData:', error)
    // Return default values if there's an error
    return {
      questions: 0,
      tags: 0,
      profiles: 0,
    }
  }
}

export default async function Index() {
  // Get homepage questions directly from Supabase
  const questions = await getHomepageQuestions()

  // Get public data counts from edge function
  const publicData = await getPublicData()

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="container py-12 md:py-24">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                  Stomp the bug together
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Feel so hard defeating the bug? bring reinforcements by
                  sharing your question so people can help you!
                </p>
              </div>
              <div className="flex justify-center">
                <Image
                  src="/person-vs-bug.png"
                  alt="Bug Stomper Hero"
                  width={400}
                  height={400}
                  className="rounded-lg object-contain"
                />
              </div>
            </div>
          </section>{' '}
          <section className="container py-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex items-center justify-center rounded-full">
                  <Image
                    src="/questions-small.png"
                    width="100"
                    height="100"
                    alt="question-image"
                  />
                </div>
                <h2 className="text-2xl font-bold">
                  {publicData.questions} Questions
                </h2>
                <p className="text-sm text-muted-foreground">
                  has been asked so far
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex items-center justify-center rounded-full">
                  <Image
                    src="/tag-small.png"
                    width="100"
                    height="100"
                    alt="question-image"
                  />
                </div>
                <h2 className="text-2xl font-bold">{publicData.tags} Tags</h2>
                <p className="text-sm text-muted-foreground">
                  are available to categorize questions
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="flex items-center justify-center rounded-full">
                  <Image
                    src="/people-small.png"
                    width="100"
                    height="100"
                    alt="question-image"
                  />
                </div>
                <h2 className="text-2xl font-bold">
                  {publicData.profiles} Users
                </h2>
                <p className="text-sm text-muted-foreground">
                  have joined the community to help each other
                </p>
              </div>
            </div>
          </section>
          <Separator className="my-8" />
          <section className="container py-8">
            <h2 className="mb-8 text-2xl font-bold">Latest Questions</h2>{' '}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {' '}
              {questions.length > 0
                ? questions.map((question) => (
                    <QuestionCard key={question.id} {...question} />
                  ))
                : Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full" />
                  ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
