'use client'

import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
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
import AnswerCard from './answer-card'
import CommentCard from './comment-card'

type ContentType = 'questions' | 'answers' | 'comments'
type SortOrder = 'newest' | 'oldest'

interface PaginationData {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface ApiResponse {
  data: any[]
  pagination: PaginationData
}

export function ActivityTab() {
  const [contentType, setContentType] = useState<ContentType>('questions')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [data, setData] = useState<any[]>([])
  const [pagination, setPagination] = useState<PaginationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Reset pagination when content type changes
  useEffect(() => {
    setCurrentPage(1)
  }, [contentType, sortOrder])

  // Load data whenever dependencies change
  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        sort: sortOrder,
        ...(searchQuery && { search: searchQuery }),
      })

      const response = await axios.get<ApiResponse>(
        `/api/account/${contentType}?${params}`,
      )
      setData(response.data.data)
      setPagination(response.data.pagination)
    } catch (error: any) {
      console.error(`Error loading ${contentType}:`, error)
      setError(`Failed to load ${contentType}`)
      setData([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }, [contentType, sortOrder, currentPage, searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSearch = () => {
    setCurrentPage(1)
    // loadData will be called automatically due to useEffect dependency
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">Loading {contentType}...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex justify-center py-8">
          <div className="text-red-600">{error}</div>
        </div>
      )
    }

    if (data.length === 0) {
      return (
        <div className="flex justify-center py-8">
          <div className="text-muted-foreground">
            {searchQuery
              ? `No ${contentType} found matching your search.`
              : `No ${contentType} found.`}
          </div>
        </div>
      )
    }

    switch (contentType) {
      case 'questions':
        return (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                content={question.content}
                slug={question.slug}
                published={question.published}
                createdAt={question.created_at}
                answerCount={question.answers?.[0]?.count || 0}
                userName={question.profiles?.username || 'Unknown'}
                userAvatar={
                  question.profiles?.avatar_url || '/avatar-placeholder.png'
                }
                tags={question.tags || []}
              />
            ))}
          </div>
        )
      case 'answers':
        return (
          <div className="grid gap-6 sm:grid-cols-1">
            {data.map((answer) => (
              <AnswerCard
                key={answer.id}
                title={answer.question?.title || 'Question'}
                content={answer.content}
                commentCount={answer.comments?.[0]?.count || 0}
                timeAgo={new Date(answer.created_at).toLocaleDateString()}
                questionSlug={answer.question?.slug}
                marked={answer.marked}
              />
            ))}
          </div>
        )
      case 'comments':
        return (
          <div className="grid gap-6 sm:grid-cols-1">
            {data.map((comment) => (
              <CommentCard
                key={comment.id}
                title={comment.answer?.question?.title || 'Question'}
                content={comment.content}
                timeAgo={new Date(comment.created_at).toLocaleDateString()}
                questionSlug={comment.answer?.question?.slug}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Your Activity</h2>
      <p className="text-muted-foreground">
        This tab shows your recent {contentType}.
      </p>

      <div className="rounded-md p-4">
        {/* Search Bar */}
        <div className="mb-4 flex w-full max-w-full">
          <Input
            type="text"
            placeholder={`Search your ${contentType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-r-none border-r-0"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            type="button"
            variant="default"
            className="rounded-l-none px-3"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value: SortOrder) => setSortOrder(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={contentType}
            onValueChange={(value: ContentType) => setContentType(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="questions">My questions</SelectItem>
              <SelectItem value="answers">My answers</SelectItem>
              <SelectItem value="comments">My comments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {renderContent()}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={!pagination.hasPrevPage}
            >
              First
            </Button>

            {/* Previous Page */}
            {pagination.currentPage > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                {pagination.currentPage - 1}
              </Button>
            )}

            {/* Current Page */}
            <Button variant="outline" size="sm" className="bg-muted" disabled>
              {pagination.currentPage}
            </Button>

            {/* Next Page */}
            {pagination.currentPage < pagination.totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                {pagination.currentPage + 1}
              </Button>
            )}

            {/* Show one more page if available */}
            {pagination.currentPage + 1 < pagination.totalPages && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 2)}
              >
                {pagination.currentPage + 2}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={!pagination.hasNextPage}
            >
              Last
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {pagination && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{' '}
            to{' '}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems,
            )}{' '}
            of {pagination.totalItems} {contentType}
          </div>
        )}
      </div>
    </div>
  )
}
