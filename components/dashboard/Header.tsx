'use client'

import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const { theme } = useTheme()
  
  // Use logo-dark for light mode, logo-light for dark mode
  const logoSrc = theme === 'light' ? '/logo-dark.png' : '/logo-light.png'

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-lg bg-slate-100 dark:bg-[#1e293b] border border-gray-300 dark:border-gray-600 shadow-md dark:shadow-none px-4 py-6 sm:px-6 lg:px-8 transition-colors duration-300">
        {/* Logo and Title - Centered */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo */}
          <div className="flex items-center justify-center relative" style={{ height: '64px' }}>
            <Image
              src={logoSrc}
              alt="Prediction Market Edge Logo"
              width={200}
              height={64}
              className="h-auto w-auto max-h-12 sm:max-h-16 object-contain"
              priority
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
