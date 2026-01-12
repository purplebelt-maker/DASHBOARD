/**
 * Debug endpoint to see raw Kalshi API response
 */
import { NextResponse } from 'next/server'
import { fetchKalshiMarkets } from '@/lib/api/kalshi'

export async function GET() {
  try {
    const kalshiResponse = await fetchKalshiMarkets(5, undefined) // Get 5 markets for debugging
    
    return NextResponse.json({
      success: true,
      totalMarkets: kalshiResponse.markets?.length || 0,
      sampleMarket: kalshiResponse.markets?.[0] || null,
      allMarkets: kalshiResponse.markets || [],
      cursor: kalshiResponse.cursor,
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

