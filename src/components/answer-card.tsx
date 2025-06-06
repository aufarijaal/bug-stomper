'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { MessageCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export interface AnswerCardProps {
  title: string
  content: string
  commentCount: number
  timeAgo: string
  questionSlug?: string
  marked?: boolean
  className?: string
}

export default function AnswerCard({
  title,
  content,
  commentCount,
  timeAgo,
  questionSlug,
  marked = false,
  className,
}: AnswerCardProps) {
  const href = questionSlug ? `/questions/${questionSlug}` : '#'

  return (
    <Link href={href} className={`block ${className}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="font-bold">{title}</div>
            {marked && (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {content}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                {commentCount} Comments
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
