'use client'

import { useEffect, useState } from 'react'

interface RefreshNotificationProps {
  show: boolean
  onComplete: () => void
}

export default function RefreshNotification({ show, onComplete }: RefreshNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 500)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!show && !isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-red-500/10 transition-opacity duration-500"
        style={{
          boxShadow: isVisible
            ? 'inset 0 0 200px rgba(239, 68, 68, 0.15), inset 0 0 400px rgba(239, 68, 68, 0.1), inset 0 0 600px rgba(239, 68, 68, 0.05)'
            : 'none',
        }}
      />
      <div
        className={`relative px-10 py-5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-500 ${
          isVisible ? 'scale-100' : 'scale-90'
        }`}
        style={{
          boxShadow: isVisible
            ? '0 0 30px rgba(239, 68, 68, 0.4), 0 0 60px rgba(239, 68, 68, 0.3), 0 0 90px rgba(239, 68, 68, 0.2)'
            : 'none',
        }}
      >
        <div className="absolute inset-0 rounded-xl bg-red-500/5 blur-2xl animate-pulse"></div>
        <span className="relative text-3xl font-bold text-red-600 dark:text-red-400 tracking-wide">
          Updated
        </span>
      </div>
    </div>
  )
}

