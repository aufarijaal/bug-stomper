'use client'
import type React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRef, useState } from 'react'
import { submitComment } from '@/actions/submit-comment'

interface CommentFormProps {
  answerId: string
  questionId: number
  questionSlug: string
}

export function CommentForm({
  answerId,
  questionId,
  questionSlug,
}: CommentFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  if (!showForm) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-muted-foreground"
        onClick={() => setShowForm(true)}
      >
        Add comment
      </Button>
    )
  }

  return (
    <form
      onKeyUp={(e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          form.requestSubmit()
        }
      }}
      onSubmit={async (e) => {
        e.preventDefault()
        setSubmitting(true)
        const formData = new FormData(e.currentTarget)
        await submitComment(formData)
        setSubmitting(false)
        if (contentRef.current) {
          contentRef.current.value = ''
        }
      }}
      action={submitComment}
      className="space-y-2"
    >
      <Textarea
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[80px]"
        name="content"
        required
        ref={contentRef}
      />
      <input type="hidden" name="answerId" value={answerId} />
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="questionSlug" value={questionSlug} />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </Button>
      </div>
    </form>
  )
}
