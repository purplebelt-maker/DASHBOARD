'use client'

import { useState, useEffect } from 'react'
import ViewToggle from './ViewToggle'

interface ControlBarProps {
  view: 'table' | 'grid'
  onViewChange: (view: 'table' | 'grid') => void
  lastRefreshTime?: Date
}

export default function ControlBar({ view, onViewChange, lastRefreshTime }: ControlBarProps) {
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const timeToShow = lastRefreshTime || new Date()
      setLastUpdated(
        timeToShow.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }

    updateTime()

    const timeInterval = setInterval(updateTime, 60000)

    return () => {
      clearInterval(timeInterval)
    }
  }, [lastRefreshTime])

  return (
    <div className="container mx-auto my-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-lg bg-gray-50 dark:bg-[#0f172a] px-4 py-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base transition-colors duration-300">
          <span className="flex items-center">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            Live data from Polymarket
          </span>
          <span>•</span>
          <span>Top active markets by volume</span>
          <span>•</span>
          <span>Last updated: {lastUpdated}</span>
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <h2 className="min-w-0 flex-1 break-words text-xl font-semibold text-blue-600 dark:text-blue-400 underline sm:text-2xl lg:text-3xl transition-colors duration-300">
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

