import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle } from 'lucide-react'
import { QuestionContent } from '@/components/question-content'
import { AnswerForm } from '@/components/answer-form'
import { AnswerSortSelector } from '@/components/answer-sort-selector'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import { AnswerProps, CommentProps } from '@/@types'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'
import { Answer } from '@/components/answer'
import { timeAgoDetailed } from '@/utils/timeago'
import { Badge } from '@/components/ui/badge'

interface QuestionPageProps {
  params: {
    idslug: string
  }
  searchParams: {
    sort?: string
    answer_message?: string
    type?: string
  }
}

export async function generateMetadata(
  { params, searchParams }: QuestionPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Extract the question ID and slug from the id_slug parameter
  const [id, slug] = params.idslug.split('_')

  // Fetch the question data
  const { data, error } = await supabase
    .from('questions')
    .select('title')
    .eq('slug', slug)
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return {
      title: 'Question not found',
    }
  }

  return {
    title: data.title,
    description: `View and answer the question: ${data.title}`,
  }
}

export async function getQuestionData(
  idslug: string,
  sortBy: string = 'newest',
) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract the question ID and slug from the id_slug parameter
  const [id, slug] = idslug.split('_')

  // Fetch the question data
  const { data: question, error } = await supabase
    .from('questions')
    .select(
      `
      *,
      question_tags (
        tag_id,
        tags (
          id,
          name
        )
      ),
      profiles (
        id,
        username,
        avatar_url
      )
      `,
    )
    .eq('slug', slug)
    .eq('id', id)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return null
  }

  // Determine sort order based on sortBy parameter
  let orderBy: { column: string; ascending: boolean }
  switch (sortBy) {
    case 'oldest':
      orderBy = { column: 'created_at', ascending: true }
      break
    case 'newest':
    default:
      orderBy = { column: 'created_at', ascending: false }
      break
  }

  // Fetch the answers and comments data with sorting
  const { data: answersAndComments, error: answersCommentsError } =
    await supabase
      .from('answers')
      .select(
        `
      *,
      profiles (
        id,
        username,
        avatar_url
      ),
      comments (
        id,
        content,
        created_at,
        updated_at,
        profiles (
          id,
          username,
          avatar_url
        )
      )
      `,
      )
      .eq('question_id', id)
      .order(orderBy.column, { ascending: orderBy.ascending })

  if (answersCommentsError) {
    console.error('Error fetching answers and comments:', answersCommentsError)
    return null
  }

  return {
    question: {
      id: question.id,
      title: question.title,
      content: question.content,
      createdAt: question.created_at,
      slug: question.slug,
      isAnswered:
        answersAndComments.length > 0 &&
        answersAndComments.some((a) => a.marked),
      canEdit: question.profiles?.id === user?.id,
      author: {
        username: question.profiles.username,
        avatar_url: question.profiles.avatar_url || '/avatar-placeholder.png',
      },
      question_tags: question.question_tags.map((tag) => ({
        tag_id: tag.tag_id,
        tags: {
          id: tag.tags.id,
          name: tag.tags.name,
        },
      })),
    },
    answers: answersAndComments.map(
      (answer) =>
        ({
          id: answer.id,
          content: answer.content,
          createdAt: answer.created_at,
          author: {
            id: answer.profiles.id,
            username: answer.profiles.username,
            avatarUrl: answer.profiles.avatar_url || '/avatar-placeholder.png',
          },
          marked: answer.marked,
          canEdit: answer.profiles.id === user?.id,
          comments: answer.comments.map(
            (comment: any) =>
              ({
                id: comment.id,
                content: comment.content,
                author: {
                  id: comment.profiles.id,
                  username: comment.profiles.username,
                  avatarUrl:
                    comment.profiles.avatar_url || '/avatar-placeholder.png',
                },
                canEdit: comment.profiles.id === user?.id,
                createdAt: comment.created_at,
              }) satisfies CommentProps,
          ),
        }) satisfies AnswerProps,
    ),
    authenticated: !!user,
  }
}

export default async function QuestionPage({
  params,
  searchParams,
}: QuestionPageProps) {
  const { idslug: id_slug } = params
  const sortBy = searchParams.sort || 'newest'
  const answerMessage = searchParams.answer_message || ''
  const messageType = searchParams.type || 'success'

  const questionData = await getQuestionData(id_slug, sortBy)

  if (!questionData) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p className="text-lg text-red-500">Question not found</p>
      </div>
    )
  }

  const { question, answers, authenticated } = questionData

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen flex-col">
        <div className="container py-8">
          <div className="flex flex-col space-y-6">
            {/* Question Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {question.isAnswered && (
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-green-500" />
                )}
                <h1 className="text-4xl font-bold">{question.title}</h1>
              </div>
              {question.canEdit && (
                <Button variant="outline" className="self-start">
                  Edit
                </Button>
              )}
            </div>
            {/* Author Info */}
            <div className="flex items-center gap-2">
              <Image
                src={question.author.avatar_url || '/avatar-placeholder.png'}
                alt={question.author.username}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="text-sm font-medium">
                {question.author.username}
              </span>
              <span className="text-sm text-muted-foreground">
                {timeAgoDetailed(question.createdAt)}
              </span>
            </div>
            {/* Question Content */}
            <QuestionContent content={question.content} />
            {/* Show tags */}
            {question.question_tags && question.question_tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {question.question_tags.map(
                  (qt: {
                    tag_id: number
                    tags: {
                      id: number
                      name: string
                    }
                  }) => (
                    <Link href={`/tags/${qt.tags.name}`} key={qt.tag_id}>
                      <Badge key={qt.tag_id} variant="outline">
                        {qt.tags.name}
                      </Badge>
                    </Link>
                  ),
                )}
              </div>
            )}
            <Separator className="my-4" /> {/* Answers Section */}
            {/* Display the answers messages */}
            {answerMessage && (
              <div
                className={`text-center text-sm ${
                  messageType === 'success' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {answerMessage}
              </div>
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {answers.length} Answers
              </h2>
              <AnswerSortSelector currentSort={sortBy} />
            </div>
            <div className="space-y-6">
              {answers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No answers yet. Be the first to answer!
                </p>
              ) : (
                answers.map((answer) => (
                  <Answer
                    key={answer.id}
                    answer={answer}
                    authenticated={authenticated}
                    questionId={question.id}
                    questionSlug={question.slug}
                  />
                ))
              )}
            </div>
            <Separator className="my-4" /> {/* Answer Form */}
            {authenticated ? (
              <div>
                <h3 className="mb-4 text-lg font-semibold">Your answer</h3>
                <AnswerForm
                  questionId={question.id}
                  questionSlug={question.slug}
                />
              </div>
            ) : (
              <Button asChild size="sm">
                <Link href="/signin">Sign in to answer</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
