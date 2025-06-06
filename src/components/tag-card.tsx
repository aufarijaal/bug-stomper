import Link from 'next/link'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface TagCardProps {
  name: string
  description: string
  questionCount: number
}

export function TagCard({ name, description, questionCount }: TagCardProps) {
  return (
    <Link href={`/tags/${name.toLowerCase()}`} className="block">
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{name}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="line-clamp-4 text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-sm font-medium">{questionCount} questions</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
