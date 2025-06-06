'use server'

import { createServerClient } from '@/utils/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateComment(formData: FormData) {
  const content = formData.get('content') as string
  const commentId = formData.get('commentId') as string
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
      `/signin?comment_message=You must be signed in to update a comment&type=error`,
    )
  }

  try {
    // Verify the comment belongs to the user before updating
    const { data: existingComment, error: fetchError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', commentId)
      .single()

    if (fetchError || !existingComment) {
      return redirect(
        `/questions/${questionId}_${questionSlug}?comment_message=Comment not found&type=error`,
      )
    }

    if (existingComment.user_id !== user.id) {
      return redirect(
        `/questions/${questionId}_${questionSlug}?comment_message=You can only edit your own comments&type=error`,
      )
    } // Update the comment
    const { error: updateError } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)

    if (updateError) {
      console.error('Error updating comment:', updateError)
      return redirect(
        `/questions/${questionId}_${questionSlug}?comment_message=${updateError.message}&type=error`,
      )
    }

    // Revalidate the question page to show the updated comment
    revalidatePath(`/questions/${questionId}_${questionSlug}`)
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=Comment updated successfully!&type=success`,
    )
  } catch (error) {
    console.error('Error updating comment:', error)
    return redirect(
      `/questions/${questionId}_${questionSlug}?comment_message=An unexpected error occurred. Please try again.&type=error`,
    )
  }
}
