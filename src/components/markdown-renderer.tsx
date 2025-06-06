interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className = '',
}: MarkdownRendererProps) {
  const renderMarkdown = (text: string) => {
    // Simple markdown-like rendering
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(
        /`(.*?)`/g,
        '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>',
      )
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-muted pl-4 italic text-muted-foreground">$1</blockquote>',
      )
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded border" />',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )

    // Handle unordered lists
    html = html.replace(/^- (.+)$/gm, '<ul-item>$1</ul-item>')

    // Handle ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<ol-item>$1</ol-item>')

    // Wrap consecutive list items in proper list tags
    html = html.replace(
      /(<ul-item>.*?<\/ul-item>(?:\s*<ul-item>.*?<\/ul-item>)*)/g,
      (match) => {
        const items = match.replace(
          /<ul-item>(.*?)<\/ul-item>/g,
          '<li class="ml-4">$1</li>',
        )
        return `<ul class="list-disc list-inside space-y-1 my-2">${items}</ul>`
      },
    )

    html = html.replace(
      /(<ol-item>.*?<\/ol-item>(?:\s*<ol-item>.*?<\/ol-item>)*)/g,
      (match) => {
        const items = match.replace(
          /<ol-item>(.*?)<\/ol-item>/g,
          '<li class="ml-4">$1</li>',
        )
        return `<ol class="list-decimal list-inside space-y-1 my-2">${items}</ol>`
      },
    )

    // Handle line breaks and paragraphs
    return html
      .replace(/\n\n/g, '</p><p class="text-base leading-7">')
      .replace(/\n/g, '<br />')
  }

  const renderedContent = renderMarkdown(content)

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{
        __html: `<p class="text-base leading-7">${renderedContent}</p>`,
      }}
    />
  )
}

// Export a utility function for cases where you need just the HTML string
export function renderMarkdownToHTML(content: string): string {
  // Simple markdown-like rendering
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    )
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-muted pl-4 italic text-muted-foreground">$1</blockquote>',
    )
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded border" />',
    )
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    )

  // Handle unordered lists
  html = html.replace(/^- (.+)$/gm, '<ul-item>$1</ul-item>')

  // Handle ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<ol-item>$1</ol-item>')

  // Wrap consecutive list items in proper list tags
  html = html.replace(
    /(<ul-item>.*?<\/ul-item>(?:\s*<ul-item>.*?<\/ul-item>)*)/g,
    (match) => {
      const items = match.replace(
        /<ul-item>(.*?)<\/ul-item>/g,
        '<li class="ml-4">$1</li>',
      )
      return `<ul class="list-disc list-inside space-y-1 my-2">${items}</ul>`
    },
  )

  html = html.replace(
    /(<ol-item>.*?<\/ol-item>(?:\s*<ol-item>.*?<\/ol-item>)*)/g,
    (match) => {
      const items = match.replace(
        /<ol-item>(.*?)<\/ol-item>/g,
        '<li class="ml-4">$1</li>',
      )
      return `<ol class="list-decimal list-inside space-y-1 my-2">${items}</ol>`
    },
  )

  // Handle line breaks and paragraphs
  return html
    .replace(/\n\n/g, '</p><p class="text-base leading-7">')
    .replace(/\n/g, '<br />')
}
