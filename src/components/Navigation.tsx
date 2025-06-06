import Image from 'next/image'
import Link from 'next/link'
import AuthButton from './AuthButton'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/button'
import { BellIcon, PlusIcon } from 'lucide-react'
import Notification from './notification'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

export default async function Navigation() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profiles } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user?.id)
    .single()

  return (
    <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
      <div className="flex w-full max-w-7xl items-center justify-between p-3 text-sm">
        {/* Start - Logo and Title */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              src="/icon.png"
              alt="Bug Stomper Logo"
              width={32}
              height={32}
            />
            <span className="font-semibold">Bug Stomper</span>
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/explore" className="hover:text-primary">
            Explore
          </Link>
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
        </div>

        {/* End - Auth and Theme */}
        <div className="flex items-center gap-4">
          {user ? (
            <Button size="icon">
              <Link href="/ask">
                <PlusIcon className="h-5 w-5" />
              </Link>
            </Button>
          ) : null}
          <ThemeToggle />
          {user ? <Notification /> : null}
          <AuthButton user={user} avatarUrl={profiles?.avatar_url} />
        </div>
      </div>
    </nav>
  )
}
