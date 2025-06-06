import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { timeAgoDetailed } from '@/utils/timeago'
import { QuestionCardProps } from '@/@types'

export function QuestionCard(data: QuestionCardProps) {
  const href =
    data.slug && data.slug !== '#' ? `/questions/${data.id}_${data.slug}` : '#'

  return (
    <Link href={href} className="block">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Image
              src={data.author.avatarUrl || '/avatar-placeholder.png'}
              alt="User"
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm font-medium">{data.author.username}</span>
            {!data.published && (
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
            )}
          </div>
          <div className="line-clamp-2 font-bold">{data.title}</div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {data.raw}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2">
          <div className="flex gap-2">
            {data.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">
                {data.answerCount} Answers
              </span>
              {data.hasAcceptedAnswer && (
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
            {data.createdAt && (
              <span className="text-xs text-muted-foreground">
                {timeAgoDetailed(data.createdAt)}
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
