'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/dashboard/Header'
import ControlBar from '@/components/dashboard/ControlBar'
import MarketsTable from '@/components/dashboard/MarketsTable'
import MarketsGrid from '@/components/dashboard/MarketsGrid'
import Footer from '@/components/dashboard/Footer'
import ThemeToggle from '@/components/dashboard/ThemeToggle'
import PrivacyModal from '@/components/dashboard/PrivacyModal'
import RefreshNotification from '@/components/dashboard/RefreshNotification'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { Market } from '@/types'



const REFRESH_INTERVAL_MS = 240000


export default function Home() {
  const [view, setView] = useState<'table' | 'grid'>('table')
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date())
  const [showRefreshNotification, setShowRefreshNotification] = useState(false)

  const fetchMarkets = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true)
      }
      setError(null)
      
      const cacheBuster = isRefresh ? `?_t=${Date.now()}` : `?_t=${Date.now()}`
      const response = await fetch(`/api/markets${cacheBuster}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch markets: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.message || data.error)
      }
      
      setMarkets(data.markets || [])
      setLastRefreshTime(new Date())
      
      if (isRefresh) {
        setShowRefreshNotification(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch markets')
      if (!isRefresh) {
        setLoading(false)
      }
    } finally {
      if (!isRefresh) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    fetchMarkets(false)
    const interval = setInterval(() => fetchMarkets(true), REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchMarkets])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
      <PrivacyModal />
      <ThemeToggle />
      <RefreshNotification
        show={showRefreshNotification}
        onComplete={() => setShowRefreshNotification(false)}
      />
      <Header />
      <ControlBar view={view} onViewChange={setView} lastRefreshTime={lastRefreshTime} />
      <main className="container mx-auto px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        {loading && markets.length === 0 ? (
          <div className="space-y-4">
            <SkeletonLoader />
            <div className="flex items-center justify-center py-4">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-solid border-blue-600 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading markets...</p>
              </div>
            </div>
          </div>
        ) : error && markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center max-w-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Failed to load markets
              </h3>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={() => fetchMarkets(false)}
                className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Retry
              </button>
            </div>
          </div>
        ) : markets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No markets found
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                There are currently no active markets available.
              </p>
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
