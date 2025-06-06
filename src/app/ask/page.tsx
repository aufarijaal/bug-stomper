import Navigation from '@/components/Navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import QuestionForm from '@/components/question-form'

export const metadata = {
  title: 'Ask a Question',
  description: 'Ask a question to the community and get help with your bugs.',
}

export default function AskPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen w-full flex-col">
        <div className="container max-w-4xl py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Ask a Question</h1>
            <p className="text-muted-foreground">
              Get help from the community by asking a clear, detailed question
              about your coding problem.
            </p>
          </div>

          <QuestionForm />
        </div>
      </div>
    </div>
  )
}
