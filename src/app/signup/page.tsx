import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Basic password validation
    if (password.length < 6) {
      return redirect(
        '/signup?message=Password must be at least 6 characters long',
      )
    }

    if (password !== confirmPassword) {
      return redirect('/signup?message=Passwords do not match')
    }

    // TODO: Add additional password requirements validation here
    // - uppercase letters
    // - lowercase letters
    // - digits
    // - symbols

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
      },
    })

    if (error) {
      return redirect('/signup?message=Could not create user')
    }

    return redirect('/signup?message=Check email to continue sign in process')
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <Link
        href="/"
        className="bg-btn-background hover:bg-btn-background-hover group absolute left-8 top-8 flex items-center rounded-md px-4 py-2 text-sm text-foreground no-underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in"
        action={signUp}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="mb-2 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$"
          title="Must contain at least 6 characters"
        />
        <div className="mb-6 text-xs text-gray-500">
          Password must:
          <ul className="list-disc pl-5">
            <li>Be at least 6 characters long</li>
            {/* <li>TODO: Contain uppercase letters</li>
            <li>TODO: Contain lowercase letters</li>
            <li>TODO: Contain numbers</li>
            <li>TODO: Contain symbols</li> */}
          </ul>
        </div>
        <label className="text-md" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          className="mb-6 rounded-md border bg-inherit px-4 py-2"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          required
        />
        <button className="mb-2 rounded-md bg-green-700 px-4 py-2 text-foreground">
          Sign Up
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-green-700 hover:underline">
            Sign in
          </Link>
        </p>
        {searchParams?.message && (
          <p className="mt-4 bg-foreground/10 p-4 text-center text-foreground">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
