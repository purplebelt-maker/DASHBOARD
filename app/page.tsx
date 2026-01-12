'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/dashboard/Header'
import ControlBar from '@/components/dashboard/ControlBar'
import MarketsTable from '@/components/dashboard/MarketsTable'
import MarketsGrid from '@/components/dashboard/MarketsGrid'
import Footer from '@/components/dashboard/Footer'
import ThemeToggle from '@/components/dashboard/ThemeToggle'
import { Market } from '@/types'

export default function Home() {
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarkets = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/kalshi/markets?limit=25')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch markets: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.message || data.error)
      }
      
      setMarkets(data.markets || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchMarkets()
    
    // Set up auto-refresh
    const refreshInterval = parseInt(
      process.env.NEXT_PUBLIC_API_REFRESH_INTERVAL || '60000',
      10
    )
    
    const interval = setInterval(fetchMarkets, refreshInterval)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <ThemeToggle />
      <Header />
      <ControlBar view={view} onViewChange={setView} />
      <main className="container mx-auto px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        {loading && markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading markets...</p>
            </div>
          </div>
        ) : error && markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchMarkets}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {view === 'table' && <MarketsTable markets={markets} />}
            {view === 'grid' && <MarketsGrid markets={markets} />}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
