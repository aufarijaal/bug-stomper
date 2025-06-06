import ThemeProvider from '@/providers/ThemeProvider'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Inter } from 'next/font/google'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={inter.className}
      style={{ colorScheme: 'dark' }}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground">
        <NextTopLoader
          showSpinner={false}
          height={2}
          color="hsl(var(--primary))"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <main className="flex min-h-screen flex-col items-center">
              <Navigation />
              {children}
              <Analytics />
              {/* ^^ remove this if you are not deploying to vercel. See more at https://vercel.com/docs/analytics  */}
            </main>
            <ReactQueryDevtools initialIsOpen={false} />
          </ReactQueryProvider>

          <footer className="border-t">
            <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:justify-between md:py-0">
              <div className="flex items-center gap-2">
                <Image
                  src="/icon.png"
                  alt="Bug Stomper"
                  width={30}
                  height={30}
                />
              </div>
              <nav className="flex gap-4 text-sm">
                <Link href="/" className="text-sm font-medium">
                  Home
                </Link>
                <Link href="/explore" className="text-sm font-medium">
                  Explore
                </Link>
                <Link href="/tags" className="text-sm font-medium">
                  Tags
                </Link>
                <Link href="/about" className="text-sm font-medium">
                  About
                </Link>
              </nav>
              <p className="text-sm text-muted-foreground">
                © 2025 Bug Stomper
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
