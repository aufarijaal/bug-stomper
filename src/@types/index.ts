export interface AnswerProps {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatarUrl?: string
  }
  createdAt: string
  marked: boolean
  canEdit: boolean
  comments: CommentProps[]
}

export interface CommentProps {
  id: string
  content: string
  author: {
    id: string
    username: string
    avatarUrl?: string
  }
  canEdit: boolean
  createdAt: string
}

export interface Question {
  id: string
  title: string
  content: string
  raw?: string
  slug: string
  created_at: string
  updated_at?: string
  published: boolean
  user_id: string
  question_tags: {
    tag_id: number
    tags: {
      id: number
      name: string
    }
  }[]
  profiles?: {
    id: string
    username: string
    avatar_url?: string
  }
}

export interface QuestionCardProps {
  id?: number
  title?: string
  raw?: string
  slug?: string
  published?: boolean
  createdAt?: string
  answerCount: number
  hasAcceptedAnswer?: boolean
  author: {
    username: string
    avatarUrl?: string
  }
  tags: string[]
}
