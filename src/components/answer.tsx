'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Check } from 'lucide-react'
import { Comment } from '@/components/comment'
import { CommentForm } from '@/components/comment-form'
import type { AnswerProps } from '@/@types'
import Link from 'next/link'
import { timeAgoDetailed } from '@/utils/timeago'
import { markUnmark } from '@/actions/mark-unmark-answer'
import { deleteAnswer } from '@/actions/delete-answer'

export function Answer({
  answer,
  authenticated,
  questionId,
  questionSlug,
}: {
  answer: AnswerProps
  authenticated?: boolean
  questionId: string
  questionSlug: string
}) {
  return (
    <div className="answer-item space-y-4">
      {/* A marked answer badge */}
      {answer.marked && (
        <span className="rounded-md border border-green-500 bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500">
          Accepted answer
        </span>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <form action={markUnmark} className="flex items-center">
            <input type="hidden" name="answerId" value={answer.id} />
            <input type="hidden" name="questionId" value={questionId} />
            <input type="hidden" name="questionSlug" value={questionSlug} />
            <input
              type="hidden"
              name="marked"
              value={answer.marked ? 'false' : 'true'} // sends the opposite value
            />
            <input type="hidden" name="profileId" value={answer.author.id} />
            <button
              type="submit"
              className="flex items-center justify-center rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!authenticated}
              aria-label={answer.marked ? 'Unmark answer' : 'Mark answer'}
            >
              {answer.marked ? (
                <Check className="h-8 w-8 text-green-500" />
              ) : (
                <Check className="h-8 w-8 text-gray-400" />
              )}
            </button>
          </form>

          <div className="space-y-4">
            <p className="text-base leading-7">{answer.content}</p>
            <div className="flex items-start gap-2">
              <Image
                src={answer.author.avatarUrl || '/avatar-placeholder.png'}
                alt={answer.author.username}
                width={24}
                height={24}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {answer.author.username}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {timeAgoDetailed(answer.createdAt)}
                  </span>
                </div>

                {answer.canEdit && (
                  <div className="mt-2 flex gap-2">
                    <button className="text-xs text-muted-foreground hover:underline">
                      Edit
                    </button>

                    <form action={deleteAnswer} className="flex items-center">
                      <button className="text-xs text-rose-500 hover:underline">
                        Delete
                      </button>

                      <input type="hidden" name="answerId" value={answer.id} />
                      <input
                        type="hidden"
                        name="questionId"
                        value={questionId}
                      />
                      <input
                        type="hidden"
                        name="questionSlug"
                        value={questionSlug}
                      />
                      <input
                        type="hidden"
                        name="profileId"
                        value={answer.author.id}
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      {answer.comments.length > 0 && (
        <div className="ml-8 space-y-3 border-l pl-4">
          {answer.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              questionId={parseInt(questionId)}
              questionSlug={questionSlug}
            />
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {authenticated ? (
        <div className="ml-8 pl-4">
          <CommentForm
            answerId={answer.id}
            questionId={parseInt(questionId)}
            questionSlug={questionSlug}
          />
        </div>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link href="/signin">Sign in to comment</Link>
        </Button>
      )}

      <Separator className="my-2" />
    </div>
  )
}
