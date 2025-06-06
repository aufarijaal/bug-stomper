'use client'

import type React from 'react'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Search, Loader2 } from 'lucide-react'
import { cn } from '@/utils/tailwind'

export interface Tag {
  id: string
  label: string
  value: string
}

export interface TagInputProps {
  /** Function to fetch tags based on search query */
  onSearch: (query: string) => Promise<Tag[]>
  /** Currently selected tags */
  selectedTags?: Tag[]
  /** Callback when tags change */
  onTagsChange?: (tags: Tag[]) => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Maximum number of tags allowed */
  maxTags?: number
  /** Debounce delay for search in milliseconds */
  debounceMs?: number
  /** Custom className for the container */
  className?: string
  /** Whether the input is disabled */
  disabled?: boolean
}

export default function TagInput({
  onSearch,
  selectedTags = [],
  onTagsChange,
  placeholder = 'Search and add tags...',
  maxTags,
  debounceMs = 300,
  className,
  disabled = false,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [searchResults, setSearchResults] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Debounced search function
  const debouncedSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      try {
        const results = await onSearch(query)
        // Filter out already selected tags
        const filteredResults = results.filter(
          (tag) => !selectedTags.some((selected) => selected.id === tag.id),
        )
        setSearchResults(filteredResults)
        setIsOpen(filteredResults.length > 0)
        setHighlightedIndex(-1)
      } catch (error) {
        console.error('Error searching tags:', error)
        setSearchResults([])
        setIsOpen(false)
      } finally {
        setIsLoading(false)
      }
    },
    [onSearch, selectedTags],
  )

  // Handle input change with debouncing
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      debouncedSearch(inputValue)
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [inputValue, debouncedSearch, debounceMs])

  // Handle tag selection
  const handleTagSelect = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) {
      return
    }

    const newTags = [...selectedTags, tag]
    onTagsChange?.(newTags)
    setInputValue('')
    setIsOpen(false)
    setSearchResults([])
    inputRef.current?.focus()
  }

  // Handle tag removal
  const handleTagRemove = (tagId: string) => {
    const newTags = selectedTags.filter((tag) => tag.id !== tagId)
    onTagsChange?.(newTags)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (isOpen && searchResults.length > 0) {
          setHighlightedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : 0,
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (isOpen && searchResults.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : searchResults.length - 1,
          )
        }
        break
      case 'Enter':
        e.preventDefault()
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          searchResults[highlightedIndex]
        ) {
          handleTagSelect(searchResults[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'Backspace':
        if (!inputValue && selectedTags.length > 0) {
          handleTagRemove(selectedTags[selectedTags.length - 1].id)
        }
        break
    }
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isMaxTagsReached = maxTags && selectedTags.length >= maxTags

  return (
    <div className={cn('relative w-full', className)}>
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-sm">{tag.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleTagRemove(tag.id)}
                disabled={disabled}
                aria-label={`Remove ${tag.label} tag`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isMaxTagsReached ? 'Maximum tags reached' : placeholder
            }
            disabled={disabled || isMaxTagsReached}
            className="pl-10 pr-10"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            role="combobox"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover shadow-lg"
            role="listbox"
            aria-label="Tag suggestions"
          >
            {searchResults.map((tag, index) => (
              <button
                key={tag.id}
                type="button"
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  index === highlightedIndex &&
                    'bg-accent text-accent-foreground',
                )}
                onClick={() => handleTagSelect(tag)}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{tag.label}</span>
                  {tag.value !== tag.label && (
                    <span className="text-xs text-muted-foreground">
                      {tag.value}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Helper Text */}
      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {selectedTags.length > 0 && (
            <>
              {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}{' '}
              selected
              {maxTags && ` (${maxTags - selectedTags.length} remaining)`}
            </>
          )}
        </span>
        <span>Press Enter to select, Escape to close</span>
      </div>
    </div>
  )
}
