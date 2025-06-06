'use server'

import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function submitComment(formData: FormData) {
  const content = formData.get('content') as string
  const answerId = formData.get('answerId') as string
  const questionId = formData.get('questionId') as string
  const questionSlug = formData.get('questionSlug') as string

  if (!content || content.trim().length === 0) {
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=Comment content cannot be empty&type=error`,
    )
  }

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get the current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return redirect(
      `/signin?comment_message=You must be signed in to submit a comment&type=error`,
    )
  }

  try {
    // Insert the comment
    const { error: insertError } = await supabase.from('comments').insert({
      content: content.trim(),
      answer_id: answerId,
      user_id: user.id,
      profile_id: user.id,
    })

    if (insertError) {
      console.error('Error inserting comment:', insertError)
      return redirect(
        `/questions/${questionId}_${questionSlug}?comment_message=${insertError.message}&type=error`,
      )
    }
  } catch (error) {
    console.error('Error submitting comment:', error)
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }

  // Revalidate the question page to show the new comment
  revalidatePath(`/questions/${questionId}_${questionSlug}`)
  return redirect(
    `/questions/${questionId}_${questionSlug}?comment_message=Comment submitted successfully!&type=success`,
  )
}
