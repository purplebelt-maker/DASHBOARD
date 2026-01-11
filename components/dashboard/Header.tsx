'use client'

import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-lg bg-slate-100 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-600 shadow-md dark:shadow-none px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Theme Toggle - Top Right */}
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        
        {/* Logo and Title - Centered */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img
              src="/prediction-market-edge-logo.png"
              alt="Prediction Market Edge Logo"
              className="h-auto w-auto max-h-12 sm:max-h-16"
            />
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-3xl lg:text-4xl transition-colors duration-300">
              Prediction Market Edge Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-600 dark:text-gray-400 sm:text-base lg:text-lg transition-colors duration-300">
              Live Odds — Top Polymarket Markets by Volume
            </p>
          </div>
        </div>
      </header>
    </div>
  )
}
