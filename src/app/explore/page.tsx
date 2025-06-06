import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { QuestionCard } from '@/components/question-card'
import Navigation from '@/components/Navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export default function ExplorePage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen flex-col">
        <div className="container py-8">
          <div className="mb-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Search className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold">Explore</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex w-full max-w-full">
            <Input
              type="text"
              placeholder="Search questions..."
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

          {/* Filter Controls */}
          <div className="mb-8 flex flex-wrap gap-2">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Newest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="answered">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Answered" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="all">All Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(9)
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
