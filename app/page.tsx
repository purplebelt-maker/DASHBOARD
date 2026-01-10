'use client'

import { useState } from 'react'
import Header from '@/components/dashboard/Header'
import ControlBar from '@/components/dashboard/ControlBar'
import MarketsTable from '@/components/dashboard/MarketsTable'
import Footer from '@/components/dashboard/Footer'
import { sampleMarkets } from '@/lib/utils/testData'

export default function Home() {
  const [view, setView] = useState<'table' | 'grid'>('table')

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header />
      <ControlBar view={view} onViewChange={setView} />
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {view === 'table' && <MarketsTable markets={sampleMarkets} />}
        {view === 'grid' && (
          <div className="text-center text-gray-400">
            Grid view coming soon...
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
