'use client'

import { useState, useEffect } from 'react'
import ViewToggle from './ViewToggle'

interface ControlBarProps {
  view: 'table' | 'grid'
  onViewChange: (view: 'table' | 'grid') => void
}

export default function ControlBar({ view, onViewChange }: ControlBarProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [nextRefresh, setNextRefresh] = useState<number>(60)

  useEffect(() => {
    // Set initial last updated time
    const now = new Date()
    setLastUpdated(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    )

    // Countdown timer for next refresh
    const interval = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) {
          return 60 // Reset to 60 seconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg bg-[#0f172a] px-4 py-4 sm:px-6 lg:px-8">
        {/* Info Bar - Top Center */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-400 sm:text-base">
          <span className="flex items-center">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            Live data from Polymarket
          </span>
          <span>•</span>
          <span>Top active markets by volume</span>
          <span>•</span>
          <span>Last updated: {lastUpdated}</span>
          <span>•</span>
          <span className="text-blue-400">Next refresh in {nextRefresh}s</span>
        </div>

        {/* Title and View Toggle - Bottom Row - Title can wrap */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <h2 className="min-w-0 flex-1 break-words text-xl font-semibold text-blue-400 underline sm:text-2xl lg:text-3xl">
            Polymarket — Top Markets Right Now
          </h2>
          <div className="flex-shrink-0">
            <ViewToggle view={view} onViewChange={onViewChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

