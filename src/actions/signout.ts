'use server'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const signOut = async () => {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  await supabase.auth.signOut()
  return redirect('/signin')
}
