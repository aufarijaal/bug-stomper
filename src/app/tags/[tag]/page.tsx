import { Button } from '@/components/ui/button'
import { QuestionCard } from '@/components/question-card'
import { Tag } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

interface TagPageProps {
  params: {
    tag: string
  }
}

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params
  const decodedTag = decodeURIComponent(tag)
  const formattedTag = decodedTag.charAt(0).toUpperCase() + decodedTag.slice(1)

  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen flex-col">
        <div className="container py-8">
          <div className="mb-4 flex items-center gap-2">
            <Link
              href="/tags"
              className="text-sm text-muted-foreground hover:underline"
            >
              Tags
            </Link>
            <span className="text-sm text-muted-foreground">/</span>
            <span className="text-sm font-medium">{formattedTag}</span>
          </div>

          <div className="mb-8 flex items-center gap-2">
            <Tag className="h-6 w-6 text-red-500" />
            <h1 className="text-3xl font-bold">{formattedTag}</h1>
          </div>

          <p className="mb-8 text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum,
            illum, saepe temporibus doloribus rerum repellendus placeat sapiente
            numquam doloremque delectus? Dolore voluptates non autem facilis
            tenetur deserunt nesciunt error.
          </p>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Questions tagged with &quot;{formattedTag}&quot;
            </h2>
            <Button>Ask Question</Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <QuestionCard key={i} />
              ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center gap-2">
            <Button variant="outline" size="sm">
              First
            </Button>
            <Button variant="outline" size="sm" className="bg-muted">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
