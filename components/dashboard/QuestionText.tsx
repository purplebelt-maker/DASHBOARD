'use client'

import { useState } from 'react'

interface QuestionTextProps {
  question: string
  className?: string
}

export default function QuestionText({ question, className = '' }: QuestionTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const words = question.split(' ')
  const wordCount = words.length
  const shouldTruncate = wordCount > 12
  
  if (!shouldTruncate) {
    // If 12 words or less, show full question with wrapping after 7 words
    if (wordCount <= 7) {
      return <span className={className}>{question}</span>
    }
    
    // Split into chunks: first 7 words, then rest
    const firstLine = words.slice(0, 7).join(' ')
    const secondLine = words.slice(7).join(' ')
    
    return (
      <span className={className}>
        {firstLine}
        <br />
        {secondLine}
      </span>
    )
  }
  
  // If more than 12 words, truncate and show expand button
  const firstLine = words.slice(0, 7).join(' ')
  const secondLine = words.slice(7, 12).join(' ')
  const remainingWords = words.slice(12).join(' ')
  
  if (isExpanded) {
    // Show full question
    return (
      <span className={className}>
        {firstLine}
        <br />
        {secondLine}
        {remainingWords && (
          <>
            <br />
            {remainingWords}
          </>
        )}
        <br />
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(false)
          }}
          className="mt-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors duration-300"
        >
          Show less
        </button>
      </span>
    )
  }
  
  // Show truncated version
  return (
    <span className={className}>
      {firstLine}
      <br />
      {secondLine}
      <span className="text-gray-500 dark:text-gray-400">...</span>
      <br />
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsExpanded(true)
        }}
        className="mt-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors duration-300"
      >
        Show full question
      </button>
    </span>
  )
}

