'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { submitAnswer } from '@/actions/submit-answer'
import { useRef, useState } from 'react'

interface AnswerFormProps {
  questionId: string
  questionSlug: string
}

export function AnswerForm({ questionId, questionSlug }: AnswerFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

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
        await submitAnswer(formData)
        setSubmitting(false)
        if (contentRef.current) {
          contentRef.current.value = ''
        }
      }}
      action={submitAnswer}
      className="space-y-4"
    >
      <Textarea
        name="content"
        placeholder="Write your answer here..."
        className="min-h-[200px]"
        required
        ref={contentRef}
      />
      {/* Info the users to submit using ctrl+enter or click the button */}
      <p className="text-sm text-muted-foreground">
        Press <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">Enter</kbd>{' '}
        to submit or click the button below.
      </p>
      <input type="hidden" name="questionId" value={questionId} />
      <input type="hidden" name="questionSlug" value={questionSlug} />
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
      </div>
    </form>
  )
}
