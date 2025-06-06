import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Search } from 'lucide-react'
import { QuestionCard } from './question-card'
import { Button } from './ui/button'
import { Input } from './ui/input'

export function SavesTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Saved Items</h2>
      <p className="text-muted-foreground">
        Questions and answers you&apos;ve saved for later will appear here.
      </p>

      <div className="rounded-md p-4">
        {/* <p className="text-center text-muted-foreground">
          No saved items to display
        </p> */}

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
  )
}
