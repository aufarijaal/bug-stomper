/**
 * Converts a timestamp into a human-readable "time ago" format
 * @param timestamp - The timestamp to convert (Date, string, or number)
 * @returns A string representing the time elapsed (e.g., "2 hours ago", "3 days ago")
 */
export function timeAgo(timestamp: Date | string | number): string {
  const now = new Date()
  const past = new Date(timestamp)

  // Check if the date is valid
  if (isNaN(past.getTime())) {
    return 'Invalid date'
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // If the timestamp is in the future
  if (diffInSeconds < 0) {
    return 'Just now'
  }

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)

    if (count >= 1) {
      return count === 1
        ? `1 ${interval.label} ago`
        : `${count} ${interval.label}s ago`
    }
  }

  return 'Just now'
}

/**
 * Converts a timestamp into a more precise "time ago" format with relative formatting
 * @param timestamp - The timestamp to convert (Date, string, or number)
 * @returns A string representing the time elapsed with better formatting for recent times
 */
export function timeAgoDetailed(timestamp: Date | string | number): string {
  const now = new Date()
  const past = new Date(timestamp)

  // Check if the date is valid
  if (isNaN(past.getTime())) {
    return 'Invalid date'
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // If the timestamp is in the future
  if (diffInSeconds < 0) {
    return 'Just now'
  }

  // Less than a minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? 'Just now' : `${diffInSeconds} seconds ago`
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return days === 1 ? '1 day ago' : `${days} days ago`
  }

  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }

  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }

  // A year or more
  const years = Math.floor(diffInSeconds / 31536000)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

/**
 * Converts a timestamp into a short "time ago" format for compact displays
 * @param timestamp - The timestamp to convert (Date, string, or number)
 * @returns A string representing the time elapsed in short format (e.g., "2h", "3d", "1y")
 */
export function timeAgoShort(timestamp: Date | string | number): string {
  const now = new Date()
  const past = new Date(timestamp)

  // Check if the date is valid
  if (isNaN(past.getTime())) {
    return '?'
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // If the timestamp is in the future
  if (diffInSeconds < 0) {
    return 'now'
  }

  // Less than a minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 5 ? 'now' : `${diffInSeconds}s`
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d`
  }

  // Less than a year
  if (diffInSeconds < 31536000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks}w`
  }

  // A year or more
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years}y`
}

/**
 * Type guard to check if a value is a valid timestamp
 * @param value - The value to check
 * @returns True if the value can be converted to a valid Date
 */
export function isValidTimestamp(
  value: unknown,
): value is Date | string | number {
  if (value instanceof Date) {
    return !isNaN(value.getTime())
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  return false
}
