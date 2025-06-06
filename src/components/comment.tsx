'use client'

import { CommentProps } from '@/@types'
import { deleteComment } from '@/actions/delete-comment'
import { updateComment } from '@/actions/update-comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { timeAgoDetailed } from '@/utils/timeago'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useState, useRef, useEffect } from 'react'

export function Comment({
  comment,
  questionId,
  questionSlug,
}: {
  comment: CommentProps
  questionId: number
  questionSlug: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const formRef = useRef<HTMLFormElement>(null)

  // Reset content when comment changes (e.g., after successful update)
  useEffect(() => {
    setEditContent(comment.content)
    setIsEditing(false)
  }, [comment.content])

  const handleSubmit = async (formData: FormData) => {
    // Reset editing state immediately to prevent the form from staying visible
    setIsEditing(false)
    setEditContent(comment.content)

    // Call the server action
    await updateComment(formData)
  }

  if (isEditing) {
    return (
      <div className="space-y-2 text-sm">
        <form ref={formRef} action={handleSubmit} className="space-y-2">
          <Textarea
            name="content"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[60px] text-sm"
            required
          />
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="questionId" value={questionId} />
          <input type="hidden" name="questionSlug" value={questionSlug} />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false)
                setEditContent(comment.content)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between text-sm">
      <div className="flex gap-2">
        <span>{comment.content}</span>
        <span className="text-muted-foreground"> — </span>
        <span className="font-medium">{comment.author.username}</span>
        <span className="text-muted-foreground">
          {' '}
          {timeAgoDetailed(comment.createdAt)}
        </span>
        {comment.canEdit && (
          <div className="flex gap-2 border-l pl-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-muted-foreground hover:underline"
            >
              Edit
            </button>
            {/* Form delete comment */}
            <form action={deleteComment} className="flex items-center">
              <button
                type="submit"
                className="text-xs text-rose-500 hover:underline"
              >
                Delete
              </button>
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="questionId" value={questionId} />
              <input type="hidden" name="questionSlug" value={questionSlug} />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
