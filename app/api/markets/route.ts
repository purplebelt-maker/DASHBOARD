/**
 * API Route for fetching Polymarket markets
 * Uses public Gamma API - no authentication required
 */
import { NextRequest, NextResponse } from 'next/server'
import { fetchPolymarketMarkets } from '@/lib/api/polymarket'
import { transformPolymarketMarkets } from '@/lib/utils/polymarketTransform'
import { calculateCountdown } from '@/lib/utils/countdown'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const requestedLimit = parseInt(searchParams.get('limit') || '25', 10)
    const cursor = searchParams.get('cursor') || undefined
    const category = searchParams.get('category') || undefined
    
    // For testing, fetch a fixed 200 markets (matches previous dashboard)
    // and return all without filtering
    const limit = 200
    const fetchLimit = 200
    
    // Fetch markets from Polymarket using public Gamma API
    const polymarketResponse = await fetchPolymarketMarkets({
      limit: fetchLimit,
      cursor: cursor,
      status: 'open',
      category: category,
      sort: 'volume',
      closed: false,
      include: 'condition',
    })
    
    // Get raw markets data - preserve all fields including events and series
    const rawMarkets = polymarketResponse.data || polymarketResponse.markets || []
    
    // Transform for display
    const transformedMarkets = transformPolymarketMarkets(rawMarkets)
    
    // Filter out closed markets and markets with past endDate
    // Only show markets that have days or hours left
    const now = new Date()
    const activeMarkets = transformedMarkets.filter(market => {
      // Filter out if status is closed
      if (market.status === 'closed') {
        return false
      }
      
      // Check if endDate has passed - filter out if no time left
      const endDate = new Date(market.endDate)
      if (endDate <= now) {
        return false
      }
      
      // Check if there are days or hours left using countdown
      const countdown = calculateCountdown(market.endDate)
      if (countdown.days === 0 && countdown.hours === 0) {
        return false
      }
      
      return true
    })
    
    // Create a map of transformed markets to raw markets to preserve full data
    const rawMarketsMap = new Map<string, any>()
    rawMarkets.forEach((rawMarket: any) => {
      if (rawMarket.id) {
        rawMarketsMap.set(rawMarket.id.toString(), rawMarket)
      }
    })
    
    // Enrich filtered markets with full raw data (events, series, etc.)
    const enrichedMarkets = activeMarkets.map(market => {
      const rawMarket = rawMarketsMap.get(market.id)
      if (rawMarket) {
        // Return the full raw market data along with transformed fields
        // IMPORTANT: Use the transformed status (based on closed field) not rawMarket.closed
        return {
          ...rawMarket, // Full raw market data (events, series, all fields)
          // Override with transformed fields for consistency
          id: market.id,
          question: market.question,
          category: market.category,
          probabilityYes: market.probabilityYes,
          probabilityNo: market.probabilityNo,
          change24h: market.change24h,
          liquidity: market.liquidity,
          volume24h: market.volume24h,
          volumeTotal: market.volumeTotal,
          endDate: market.endDate,
          status: market.status, // Use transformed status, not rawMarket.closed
        }
      }
      return market
    })
    
    // Sort markets to prioritize those with trading activity
    const sortedMarkets = enrichedMarkets.sort((a, b) => {
      // First, prioritize markets with actual price data (not 0/100)
      const aHasPrice = a.probabilityYes > 0 && a.probabilityYes < 100
      const bHasPrice = b.probabilityYes > 0 && b.probabilityYes < 100
      
      if (aHasPrice && !bHasPrice) return -1
      if (!aHasPrice && bHasPrice) return 1
      
      // Then sort by 24h volume (descending)
      if (b.volume24h !== a.volume24h) {
        return b.volume24h - a.volume24h
      }
      
      // Then by total volume
      if (b.volumeTotal !== a.volumeTotal) {
        return b.volumeTotal - a.volumeTotal
      }
      
      // Then by liquidity
      return b.liquidity - a.liquidity
    })
    
    // Limit to 200 (or fewer if API returned less)
    const limitedMarkets = sortedMarkets.slice(0, limit)
    
    return NextResponse.json({
      markets: limitedMarkets,
      cursor: polymarketResponse.cursor || polymarketResponse.nextCursor,
      total: limitedMarkets.length,
    })
  } catch (error) {
    console.error('Error fetching Polymarket markets:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch markets',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

