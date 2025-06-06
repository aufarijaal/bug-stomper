import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your password by entering your email address.',
}

export default function ForgotPassword({
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

  const resetPassword = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      return redirect(
        '/auth/forgot-password?message=Error sending reset email&type=error',
      )
    }

    return redirect(
      '/auth/forgot-password?message=Check your email for the password reset link&type=success',
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="flex w-full flex-1 flex-col justify-center gap-6 text-foreground animate-in"
        action={resetPassword}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
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
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>

        <p className="text-center text-sm">
          Remember your password?{' '}
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
