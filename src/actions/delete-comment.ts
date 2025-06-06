'use server'
import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function deleteComment(formData: FormData) {
  const commentId = formData.get('commentId') as string
  const questionId = formData.get('questionId') as string
  const questionSlug = formData.get('questionSlug') as string

  if (!commentId) {
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=Comment ID is required&type=error`,
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
      `/signin?comment_message=You must be signed in to delete a comment&type=error`,
    )
  }

  // Check if the comment exists and belongs to the user

  try {
    // Delete the comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('profile_id', user.id)

    if (deleteError) {
      console.error('Error deleting comment:', deleteError)
      return redirect(
        `/questions/${questionId}_${questionSlug}?comment_message=${deleteError.message}&type=error`,
      )
    }
  } catch (error) {
    console.error('Unexpected error deleting comment:', error)
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }

  // Revalidate the question page to reflect the deleted comment
  revalidatePath(`/questions/${questionId}_${questionSlug}`)
  return redirect(
    `/questions/${questionId}_${questionSlug}?comment_message=Comment deleted successfully!&type=success`,
  )
}
