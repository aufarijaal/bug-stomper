import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInAction } from '@/actions/signin'

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your account using your email and password.',
}

export default function SignIn({
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

  return (
    <div className="flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
      <form
        className="flex w-full flex-1 flex-col justify-center gap-6 text-foreground animate-in"
        action={signInAction}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in.
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <p className="text-center text-sm">
          Don&apos;t have an account?
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
