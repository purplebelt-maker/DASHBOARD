/**
 * Test endpoint to verify Kalshi API credentials
 */
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiKeyId = process.env.KALSHI_API_KEY_ID
    const privateKey = process.env.KALSHI_PRIVATE_KEY
    const baseUrl = process.env.NEXT_PUBLIC_KALSHI_API_BASE_URL
    
    return NextResponse.json({
      configured: {
        apiKeyId: !!apiKeyId,
        privateKey: !!privateKey,
        baseUrl: baseUrl || 'not set',
      },
      apiKeyIdLength: apiKeyId?.length || 0,
      privateKeyLength: privateKey?.length || 0,
      privateKeyStart: privateKey?.substring(0, 30) || 'not set',
      privateKeyEnd: privateKey?.substring(privateKey.length - 30) || 'not set',
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to check credentials',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

