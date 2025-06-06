'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import Link from 'next/link'

export interface CommentCardProps {
  title: string
  content: string
  timeAgo: string
  questionSlug?: string
  className?: string
}

export default function CommentCard({
  title,
  content,
  timeAgo,
  questionSlug,
  className,
}: CommentCardProps) {
  const href = questionSlug ? `/questions/${questionSlug}` : '#'

  return (
    <Link href={href} className={`block ${className}`}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="font-bold">{title}</div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {content}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex w-full items-center justify-end">
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
