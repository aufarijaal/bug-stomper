import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { redirect } from 'next/navigation'
import { createBrowserClient } from '@/utils/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  if (token_hash && type) {
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app with token_hash
      const redirectUrl = new URL(next, request.url)
      redirectUrl.searchParams.set('token_hash', token_hash)
      redirect(redirectUrl.toString())
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/auth/auth-code-error')
}
