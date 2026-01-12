/**
 * API Route for fetching Kalshi markets
 * This is a server-side API route that handles Kalshi authentication
 */
import { NextRequest, NextResponse } from 'next/server'
import { fetchKalshiMarkets } from '@/lib/api/kalshi'
import { transformKalshiMarkets } from '@/lib/utils/kalshiTransform'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const cursor = searchParams.get('cursor') || undefined
    
    // Fetch more markets than requested to find ones with trading activity
    // Many markets may have no trading, so fetch 3-5x more to find active ones
    const fetchLimit = Math.max(limit * 3, 300)
    
    // Fetch markets from Kalshi
    const kalshiResponse = await fetchKalshiMarkets(fetchLimit, cursor)
    
    // Transform Kalshi data to our Market format
    const markets = transformKalshiMarkets(kalshiResponse.markets || [])
    
    // Sort markets to prioritize those with trading activity
    const sortedMarkets = markets.sort((a, b) => {
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
    
    // Limit to requested number
    const limitedMarkets = sortedMarkets.slice(0, limit)
    
    return NextResponse.json({
      markets: limitedMarkets,
      cursor: kalshiResponse.cursor,
      total: limitedMarkets.length,
    })
  } catch (error) {
    console.error('Error fetching Kalshi markets:', error)
    
    return NextResponse.json(
      {
        error: 'Failed to fetch markets',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

