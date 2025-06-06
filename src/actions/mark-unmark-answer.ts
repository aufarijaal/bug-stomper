'use server'

import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function markUnmark(formData: FormData) {
  const marked = formData.get('marked') as string
  const answerId = formData.get('answerId') as string
  const questionId = formData.get('questionId') as string
  const questionSlug = formData.get('questionSlug') as string

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Authentication error:', authError)
      revalidatePath(`/questions/${questionId}_${questionSlug}`)
      redirect(
        `/signin?answer_message=You must be signed in to mark or unmark an answer.&type=error`,
      )
    }

    if (marked === 'true') {
      // If marking an answer, unmark the other answers so only one can be marked
      const { error: unmarkError } = await supabase
        .from('answers')
        .update({ marked: false })
        .eq('question_id', questionId)

      if (unmarkError) {
        console.error('Error unmarking other answers:', unmarkError)
        revalidatePath(`/questions/${questionId}_${questionSlug}`)
        redirect(
          `/questions/${questionId}_${questionSlug}?answer_message=Failed to unmark other answers. Please try again.&type=error`,
        )
      }
    }

    const { data, error } = await supabase
      .from('answers')
      .update({
        marked: marked === 'true' ? true : false,
      })
      .eq('id', answerId)
      .eq('question_id', questionId)
    console.log('Response from mark-unmark-answer function:', data)

    if (error) {
      console.error('Error marking/unmarking answer:', error)
      revalidatePath(`/questions/${questionId}_${questionSlug}`)
      redirect(
        `/questions/${questionId}_${questionSlug}?answer_message=Failed to update answer status. Please try again.&type=error`,
      )
    }

    console.log('Answer status updated successfully')
  } catch (error) {
    console.error('Error updating answer status:', error)
    revalidatePath(`/questions/${questionId}_${questionSlug}`)
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }

  // Revalidate the question page to show the updated answer status
  revalidatePath(`/questions/${questionId}_${questionSlug}`)
  redirect(
    `/questions/${questionId}_${questionSlug}?answer_message=Answer status updated successfully!&type=success`,
  )
}
