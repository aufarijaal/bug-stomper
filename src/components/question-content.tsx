import { MarkdownRenderer } from './markdown-renderer'

interface QuestionContentProps {
  content: string
}

export function QuestionContent({ content }: QuestionContentProps) {
  return <MarkdownRenderer content={content} />
}
