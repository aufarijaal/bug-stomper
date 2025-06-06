'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnswerSortSelectorProps {
  currentSort: string
}

export function AnswerSortSelector({ currentSort }: AnswerSortSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    if (value === 'newest') {
      current.delete('sort') // Remove sort param for default value
    } else {
      current.set('sort', value)
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''
    router.push(`${window.location.pathname}${query}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
