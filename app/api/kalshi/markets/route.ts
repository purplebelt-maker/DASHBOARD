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
    
    // Fetch markets from Kalshi
    const kalshiResponse = await fetchKalshiMarkets(limit, cursor)
    
    // Transform Kalshi data to our Market format
    const markets = transformKalshiMarkets(kalshiResponse.markets || [])
    
    // Sort by 24h volume (descending), then by total volume, then by liquidity
    const sortedMarkets = markets.sort((a, b) => {
      if (b.volume24h !== a.volume24h) {
        return b.volume24h - a.volume24h
      }
      if (b.volumeTotal !== a.volumeTotal) {
        return b.volumeTotal - a.volumeTotal
      }
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

