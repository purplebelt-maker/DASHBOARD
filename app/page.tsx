'use client'

import { useState } from 'react'
import Header from '@/components/dashboard/Header'
import ControlBar from '@/components/dashboard/ControlBar'
import MarketsTable from '@/components/dashboard/MarketsTable'
import MarketsGrid from '@/components/dashboard/MarketsGrid'
import Footer from '@/components/dashboard/Footer'
import ThemeToggle from '@/components/dashboard/ThemeToggle'
import { sampleMarkets } from '@/lib/utils/testData'

export default function Home() {
  const [view, setView] = useState<'table' | 'grid'>('table')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <ThemeToggle />
      <Header />
      <ControlBar view={view} onViewChange={setView} />
      <main className="container mx-auto px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        {view === 'table' && <MarketsTable markets={sampleMarkets} />}
        {view === 'grid' && <MarketsGrid markets={sampleMarkets} />}
      </main>
      <Footer />
    </div>
  )
}
