'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { renderMarkdownToHTML } from './markdown-renderer'
import {
  Bold,
  Italic,
  Underline,
  Code,
  ImageIcon,
  Link,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface HistoryState {
  content: string
  selectionStart: number
  selectionEnd: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [history, setHistory] = useState<HistoryState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const lastValueRef = useRef(value)
  const isUndoRedoRef = useRef(false)
  // Initialize history with the initial value
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{ content: value, selectionStart: 0, selectionEnd: 0 }])
      setHistoryIndex(0)
    }
  }, [history.length, value])

  // Add to history when value changes (but not during undo/redo)
  useEffect(() => {
    if (!isUndoRedoRef.current && value !== lastValueRef.current) {
      const textarea = document.getElementById(
        'editor-textarea',
      ) as HTMLTextAreaElement
      const newState: HistoryState = {
        content: value,
        selectionStart: textarea?.selectionStart || 0,
        selectionEnd: textarea?.selectionEnd || 0,
      }

      setHistory((prev) => {
        // Remove any history after current index (when typing after undo)
        const newHistory = prev.slice(0, historyIndex + 1)
        newHistory.push(newState)

        // Limit history to 50 entries
        if (newHistory.length > 50) {
          newHistory.shift()
          return newHistory
        }

        return newHistory
      })

      setHistoryIndex((prev) => prev + 1)
    }
    lastValueRef.current = value
    isUndoRedoRef.current = false
  }, [value, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1
      const prevState = history[prevIndex]
      isUndoRedoRef.current = true
      onChange(prevState.content)
      setHistoryIndex(prevIndex)

      // Restore cursor position
      setTimeout(() => {
        const textarea = document.getElementById(
          'editor-textarea',
        ) as HTMLTextAreaElement
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(
            prevState.selectionStart,
            prevState.selectionEnd,
          )
        }
      }, 0)
    }
  }, [historyIndex, history, onChange])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1
      const nextState = history[nextIndex]
      isUndoRedoRef.current = true
      onChange(nextState.content)
      setHistoryIndex(nextIndex)

      // Restore cursor position
      setTimeout(() => {
        const textarea = document.getElementById(
          'editor-textarea',
        ) as HTMLTextAreaElement
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(
            nextState.selectionStart,
            nextState.selectionEnd,
          )
        }
      }, 0)
    }
  }, [historyIndex, history, onChange])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (
        (e.ctrlKey && e.key === 'y') ||
        (e.ctrlKey && e.shiftKey && e.key === 'Z')
      ) {
        e.preventDefault()
        redo()
      }
    },
    [undo, redo],
  )

  const insertText = useCallback(
    (before: string, after = '') => {
      const textarea = document.getElementById(
        'editor-textarea',
      ) as HTMLTextAreaElement
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const selectedText = value.substring(start, end)
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end)

      onChange(newText)

      // Set cursor position after the inserted text
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + before.length,
          start + before.length + selectedText.length,
        )
      }, 0)
    },
    [value, onChange],
  )

  const formatButtons = [
    { icon: Bold, action: () => insertText('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertText('*', '*'), tooltip: 'Italic' },
    {
      icon: Underline,
      action: () => insertText('<u>', '</u>'),
      tooltip: 'Underline',
    },
    { icon: Code, action: () => insertText('`', '`'), tooltip: 'Inline Code' },
    { icon: Quote, action: () => insertText('> '), tooltip: 'Quote' },
    { icon: List, action: () => insertText('- '), tooltip: 'Bullet List' },
    {
      icon: ListOrdered,
      action: () => insertText('1. '),
      tooltip: 'Numbered List',
    },
    { icon: Link, action: () => insertText('[', '](url)'), tooltip: 'Link' },
    {
      icon: ImageIcon,
      action: () => insertText('![alt text](', ')'),
      tooltip: 'Image',
    },
  ]

  return (
    <div className="rounded-md border">
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b bg-muted/50 p-2">
        {formatButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="h-8 w-8 p-0"
            title={button.tooltip}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Undo"
          onClick={undo}
          disabled={historyIndex <= 0}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title="Redo"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            variant={!isPreview ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setIsPreview(false)}
          >
            Write
          </Button>
          <Button
            type="button"
            variant={isPreview ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setIsPreview(true)}
          >
            Preview
          </Button>
        </div>
      </div>{' '}
      {/* Editor/Preview Area */}
      <div className="min-h-[300px]">
        {isPreview ? (
          <div
            className="prose prose-sm max-w-none p-4"
            dangerouslySetInnerHTML={{
              __html: `<p class="text-base leading-7">${renderMarkdownToHTML(
                value,
              )}</p>`,
            }}
          />
        ) : (
          <Textarea
            id="editor-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Describe your problem in detail...'}
            className="min-h-[300px] resize-none rounded-none border-0 outline-none focus-visible:ring-0"
          />
        )}
      </div>
    </div>
  )
}
