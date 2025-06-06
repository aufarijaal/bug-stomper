import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; type?: string; token_hash?: string }
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
  const token_hash = searchParams?.token_hash || ''

  const updatePassword = async (formData: FormData) => {
    'use server'

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      return redirect(
        '/auth/reset-password?message=Passwords do not match&type=error',
      )
    }

    if (password.length < 6) {
      return redirect(
        '/auth/reset-password?message=Password must be at least 6 characters&type=error',
      )
    }

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    await supabase.auth.exchangeCodeForSession(token_hash)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      console.log(error)
      return redirect(
        '/auth/reset-password?message=Error updating password&type=error',
      )
    }

    return redirect(
      '/signin?message=Password updated successfully&type=success',
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="flex w-full flex-1 flex-col justify-center gap-6 text-foreground animate-in"
        action={updatePassword}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Update Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
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
          <Label htmlFor="password">New Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full">
          Update Password
        </Button>

        <p className="text-center text-sm">
          <Link
            href="/signin"
            className="font-medium text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}
