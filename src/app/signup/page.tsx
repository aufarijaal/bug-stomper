import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string; type?: string }
}) {
  const getMessageStyle = (type: string | undefined) => {
    switch (type) {
      case 'error':
        return 'bg-destructive/10 text-destructive border border-destructive/20'
      case 'success':
        return 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800'
      default:
        return 'bg-foreground/10 text-foreground'
    }
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const origin = headers().get('origin')
    const username = formData.get('username') as string
    const full_name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string // username check
    if (!username || username.length < 3) {
      return redirect(
        '/signup?message=Username must be at least 3 characters long&type=error',
      )
    }

    // username availability check
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return redirect(
        '/signup?message=Username can only contain letters, numbers, and underscores&type=error',
      )
    }

    const { data: existingUser, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .limit(1)

    if (userError) {
      console.error('Error checking username:', userError)
      return redirect(
        '/signup?message=Could not check username availability&type=error',
      )
    }

    if (existingUser.length > 0) {
      return redirect('/signup?message=Username is already taken&type=error')
    }

    // Basic password validation
    if (password.length < 6) {
      return redirect(
        '/signup?message=Password must be at least 6 characters long&type=error',
      )
    }

    if (password !== confirmPassword) {
      return redirect('/signup?message=Passwords do not match&type=error')
    }

    // TODO: Add additional password requirements validation here
    // - uppercase letters
    // - lowercase letters
    // - digits
    // - symbols

    // console.log('Signing up user:', {
    //   email,
    //   username,
    //   full_name,
    // })

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        },
        emailRedirectTo: `${origin}/api/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing up:', error)
      return redirect('/signup?message=Could not create user&type=error')
    }

    return redirect(
      '/signup?message=Check email to continue sign in process&type=success',
    )
  }
  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="flex w-full flex-1 flex-col justify-center gap-6 text-foreground animate-in"
        action={signUp}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Create a new account to get started.
          </p>
        </div>
        {searchParams?.message && (
          <div
            className={`rounded-md p-4 text-center text-sm ${getMessageStyle(
              searchParams.type,
            )}`}
          >
            {searchParams.message}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            name="full_name"
            type="text"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            name="username"
            type="text"
            placeholder="Choose a username"
            required
            minLength={3}
            pattern="^[a-zA-Z0-9_]+$"
            title="Username can only contain letters, numbers, and underscores"
          />
          <p className="text-xs text-muted-foreground">
            Username must be at least 3 characters and can only contain letters,
            numbers, and underscores.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            required
            minLength={6}
            title="Must contain at least 6 characters"
          />
          <div className="text-xs text-muted-foreground">
            Password must:
            <ul className="mt-1 list-disc pl-5">
              <li>Be at least 6 characters long</li>
              {/* <li>TODO: Contain uppercase letters</li>
              <li>TODO: Contain lowercase letters</li>
              <li>TODO: Contain numbers</li>
              <li>TODO: Contain symbols</li> */}
            </ul>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <p className="text-center text-sm">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
