'use server'
import Link from 'next/link'
import { signOut } from '@/actions/signout'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { CircleUserIcon } from 'lucide-react'
import { Button } from './ui/button'
import type { User } from '@supabase/supabase-js'
import Image from 'next/image'

export default async function AuthButton({
  user,
  avatarUrl,
}: {
  user: User | null
  avatarUrl?: string
}) {
  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {avatarUrl && (
            <Image src={avatarUrl} alt="User Avatar" width={24} height={24} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-0">
          <div>
            <form action={signOut} className="hidden" id="form-signout"></form>
            <button
              form="form-signout"
              className="w-full px-2 py-1.5 text-left"
            >
              Logout
            </button>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button asChild>
        <Link href="/signin">Login</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </>
  )
}
