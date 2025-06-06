'use server'
import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deleteAnswer(formData: FormData) {
  const answerId = formData.get('answerId') as string
  const questionId = formData.get('questionId') as string
  const questionSlug = formData.get('questionSlug') as string
  const profileId = formData.get('profileId') as string

  if (!answerId || !questionId || !questionSlug) {
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=Invalid request parameters&type=error`,
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
    redirect(
      `/signin?answer_message=You must be signed in to delete an answer&type=error`,
    )
  }

  // Check if the user is the owner of the answer
  if (user.id !== profileId) {
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=You are not authorized to delete this answer&type=error`,
    )
  }

  try {
    // Delete the answer
    const { error } = await supabase
      .from('answers')
      .delete()
      .eq('id', answerId)
      .eq('question_id', questionId)

    if (error) {
      console.error('Error deleting answer:', error)
      redirect(
        `/questions/${questionId}_${questionSlug}?answer_message=Failed to delete answer. Please try again.&type=error`,
      )
      return
    }
  } catch (error) {
    console.error('Unexpected error deleting answer:', error)
    redirect(
      `/questions/${questionId}_${questionSlug}?answer_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }

  // Revalidate the question page to reflect the deletion
  revalidatePath(`/questions/${questionId}_${questionSlug}`)
  redirect(
    `/questions/${questionId}_${questionSlug}?answer_message=Answer deleted successfully!&type=success`,
  )
}
