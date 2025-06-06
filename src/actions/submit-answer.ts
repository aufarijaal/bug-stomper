'use server'

import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function submitAnswer(formData: FormData) {
  const content = formData.get('content') as string
  const questionId = formData.get('questionId') as string
  const questionSlug = formData.get('questionSlug') as string

  if (!content || content.trim().length === 0) {
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=Answer content cannot be empty&type=error`,
    )
    return
  }

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(
      `/signin?answer_message=You must be signed in to submit an answer&type=error`,
    )
    return
  }

  try {
    // Insert the answer
    const { error: insertError } = await supabase.from('answers').insert({
      content: content.trim(),
      question_id: questionId,
      user_id: user.id,
      profile_id: user.id,
      marked: false,
    })

    if (insertError) {
      console.error('Error inserting answer:', insertError)
      redirect(
        `/questions/${questionId}_${questionSlug}?answer_message=Failed to submit answer. Please try again.&type=error`,
      )
      return
    }
  } catch (error) {
    console.error('Error submitting answer:', error)
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }

  // Revalidate the question page to show the new answer
  revalidatePath(`/questions/${questionId}_${questionSlug}`)
  redirect(
    `/questions/${questionId}_${questionSlug}?answer_message=Answer submitted successfully!&type=success`,
  )
}
