import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Tag } from 'lucide-react'
import { TagCard } from '@/components/tag-card'
import Navigation from '@/components/Navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

// Sample tag data
const tags = [
  {
    name: 'JavaScript',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 314,
  },
  {
    name: 'React',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 214,
  },
  {
    name: 'TypeScript',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 189,
  },
  {
    name: 'Node.js',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 156,
  },
  {
    name: 'CSS',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 142,
  },
  {
    name: 'HTML',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 128,
  },
  {
    name: 'Next.js',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 112,
  },
  {
    name: 'Python',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 98,
  },
  {
    name: 'Java',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 87,
  },
  {
    name: 'PHP',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 76,
  },
  {
    name: 'SQL',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 65,
  },
  {
    name: 'Git',
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Esse eum, illum, saepe temporibus doloribus rerum repellendus placeat sapiente numquam doloremque delectus? Dolore voluptates non autem facilis tenetur deserunt nesciunt error.',
    questionCount: 54,
  },
]

export default function TagsPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen flex-col">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Tag className="h-8 w-8 text-red-500" />
              <h1 className="text-4xl font-bold">Tags</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8 flex w-full max-w-full">
            <Input
              type="text"
              placeholder="Search tags..."
              className="rounded-r-none border-r-0"
            />
            <Button
              type="submit"
              variant="default"
              className="rounded-l-none px-3"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Tags Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag, index) => (
              <TagCard
                key={index}
                name={tag.name}
                description={tag.description}
                questionCount={tag.questionCount}
              />
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
