'use client'
import React, { useState } from 'react'
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from 'react-json-view-lite'
import 'react-json-view-lite/dist/index.css'
import { MarkdownEditor } from './markdown-editor'
import TagInput, { Tag } from '@/components/tags-input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import axios from 'axios'

interface ValidationErrors {
  title?: string
  body?: string
  tags?: string
}

const QuestionForm = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isPublished, setIsPublished] = useState(true)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const MAX_TAGS = 5
  const TITLE_LENGTH = {
    min: 10,
    max: 200,
  }
  const MAX_BODY_LENGTH = {
    min: 20,
    max: 10000,
  }
  // Utility function to strip markdown for preview content
  const stripMarkdown = (text: string): string => {
    return (
      text
        // Remove code blocks
        .replace(/```[\s\S]*?```/g, '[code block]')
        .replace(/`([^`]+)`/g, '$1')
        // Remove headers
        .replace(/^#{1,6}\s+/gm, '')
        // Remove bold and italic
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/__([^_]+)__/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        // Remove strikethrough
        .replace(/~~([^~]+)~~/g, '$1')
        // Remove links but keep text
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove images
        .replace(/!\[.*?\]\([^)]*\)/g, '[image]')
        // Remove lists
        .replace(/^[-*+]\s+/gm, '')
        .replace(/^\d+\.\s+/gm, '')
        // Remove blockquotes
        .replace(/^>\s+/gm, '')
        // Remove horizontal rules
        .replace(/^---+$/gm, '')
        // Clean up whitespace
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
    )
  }

  // Validation functions
  const validateTitle = (titleValue: string): string | undefined => {
    if (!titleValue.trim()) {
      return 'Title is required'
    }
    if (titleValue.trim().length < TITLE_LENGTH.min) {
      return 'Title must be at least 10 characters long'
    }
    if (titleValue.trim().length > TITLE_LENGTH.max) {
      return 'Title must not exceed 200 characters'
    }
    return undefined
  }

  const validateBody = (bodyValue: string): string | undefined => {
    if (!bodyValue.trim()) {
      return 'Question body is required'
    }
    if (bodyValue.trim().length < MAX_BODY_LENGTH.min) {
      return 'Question body must be at least 20 characters long'
    }
    if (bodyValue.trim().length > MAX_BODY_LENGTH.max) {
      return 'Question body must not exceed 10,000 characters'
    }
    return undefined
  }

  const validateTags = (tagsValue: Tag[]): string | undefined => {
    if (tagsValue.length === 0) {
      return 'At least one tag is required'
    }
    if (tagsValue.length > MAX_TAGS) {
      return 'Maximum 5 tags allowed'
    }
    return undefined
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    const titleError = validateTitle(title)
    const bodyError = validateBody(body)
    const tagsError = validateTags(selectedTags)

    if (titleError) newErrors.title = titleError
    if (bodyError) newErrors.body = bodyError
    if (tagsError) newErrors.tags = tagsError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Real-time validation handlers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Clear title error if it exists and field is being corrected
    if (errors.title) {
      const titleError = validateTitle(newTitle)
      if (!titleError) {
        setErrors((prev) => ({ ...prev, title: undefined }))
      }
    }
  }

  const handleBodyChange = (newBody: string) => {
    setBody(newBody)

    // Clear body error if it exists and field is being corrected
    if (errors.body) {
      const bodyError = validateBody(newBody)
      if (!bodyError) {
        setErrors((prev) => ({ ...prev, body: undefined }))
      }
    }
  }

  const handleTagsChange = (tags: Tag[]) => {
    setSelectedTags(tags)

    // Clear tags error if it exists and field is being corrected
    if (errors.tags) {
      const tagsError = validateTags(tags)
      if (!tagsError) {
        setErrors((prev) => ({ ...prev, tags: undefined }))
      }
    }
  }
  async function searchTags(query: string): Promise<Tag[]> {
    try {
      const { data } = await axios.get(`/api/tags/select`, {
        params: { search: query },
      })
      return data.map((tag: { id: string; label: string; value: string }) => ({
        id: tag.id,
        label: tag.label,
        value: tag.value,
      }))
    } catch (error) {
      console.error('Failed to fetch tags:', error)
      throw new Error('Failed to fetch tags')
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Handle form submission here
      console.log('Submitting question:', {
        title,
        body,
        selectedTags,
        isPublished,
      }) // TODO: Call API to create question
      const response = await axios.post('/api/questions', {
        title,
        content: body,
        raw: stripMarkdown(body),
        tags: selectedTags.map((tag) => tag.id),
        published: isPublished,
      })
    } catch (error) {
      console.error('Error submitting question:', error)
      // Handle submission error
    } finally {
      setIsSubmitting(false)
    }
  }
  const handleSaveDraft = async () => {
    if (!validateTitle(title) && !validateBody(body)) {
      setIsSubmitting(true)
      try {
        // Save as draft logic
        const response = await axios.post('/api/questions', {
          title,
          content: body,
          raw: stripMarkdown(body),
          tags: selectedTags.map((tag) => tag.id),
          published: false,
        })
        console.log('Draft saved successfully:', response.data)
      } catch (error) {
        console.error('Error saving draft:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <JsonView data={{ title, body, selectedTags, isPublished }} />
      {/* Title Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="title">
              Be specific and imagine you&apos;re asking a question to another
              person
            </Label>{' '}
            <Input
              id="title"
              placeholder="e.g. How do I exit vim?"
              value={title}
              onChange={handleTitleChange}
              className={`text-base ${
                errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
            <p className="text-sm text-muted-foreground">
              A good title helps others understand what you&apos;re asking
              about.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Body Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question Body</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>
              Include all the information someone would need to answer your
              question
            </Label>{' '}
            <MarkdownEditor value={body} onChange={handleBodyChange} />
            {errors.body && (
              <p className="text-sm text-red-600">{errors.body}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Describe your problem in detail. Include what you&apos;ve tried
              and what you expected to happen.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Tags Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>
              Add up to 5 tags to describe what your question is about
            </Label>{' '}
            <TagInput
              onSearch={searchTags}
              selectedTags={selectedTags.slice(0, 5)}
              onTagsChange={handleTagsChange}
              placeholder="Search for technologies..."
              maxTags={MAX_TAGS}
            />
            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Tags help others find and answer your question. Start typing to
              see suggestions.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Publish Checkbox */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="publish"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked as boolean)}
            />
            <Label
              htmlFor="publish"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Publish immediately
            </Label>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Uncheck this if you want to save as draft and publish later.
          </p>
        </CardContent>
      </Card>{' '}
      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button type="submit" className="min-w-[120px]" disabled={isSubmitting}>
          {isSubmitting
            ? 'Submitting...'
            : isPublished
              ? 'Publish Question'
              : 'Save Draft'}
        </Button>
      </div>
    </form>
  )
}

export default QuestionForm
