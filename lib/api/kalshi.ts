/**
 * Kalshi API Client
 * Handles authentication and API requests to Kalshi
 */

// Kalshi API Types
export interface KalshiMarket {
  ticker: string
  title: string
  subtitle?: string
  category?: string
  series_ticker?: string
  yes_bid?: number
  yes_ask?: number
  last_price?: number
  volume?: number
  open_interest?: number
  expiration_time?: string
  status?: string
  market_state?: 'open' | 'closed' | 'settled' | 'cancelled'
}

export interface KalshiMarketsResponse {
  markets: KalshiMarket[]
  cursor?: string
}

export interface KalshiSeries {
  series_ticker: string
  title: string
  category: string
}


function generateSignature(
  timestamp: string,
  method: string,
  path: string,
  privateKeyPem: string
): string {
  // This function must only be called server-side
  if (typeof window !== 'undefined') {
    throw new Error('Kalshi API authentication must be done server-side.')
  }
  
  // Use Node.js crypto module
  const crypto = require('crypto')
  
  // Clean the path - remove query parameters for signing
  const cleanPath = path.split('?')[0]
  const message = timestamp + method + cleanPath
  
  // Create sign object
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(message)
  sign.end()
  
  // Sign with RSA-PSS padding
  const signature = sign.sign(
    {
      key: privateKeyPem.replace(/\\n/g, '\n'), // Handle escaped newlines
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
    },
    'base64'
  )
  
  return signature
}

/**
 * Create authenticated headers for Kalshi API
 */
function createAuthHeaders(
  method: string,
  path: string,
  apiKeyId: string,
  privateKey: string
): Record<string, string> {
  const timestamp = Date.now().toString()
  const signature = generateSignature(timestamp, method, path, privateKey)
  
  return {
    'KALSHI-ACCESS-KEY': apiKeyId,
    'KALSHI-ACCESS-TIMESTAMP': timestamp,
    'KALSHI-ACCESS-SIGNATURE': signature,
    'Content-Type': 'application/json',
  }
}

/**
 * Fetch markets from Kalshi API
 * This should be called from a server-side API route
 */
export async function fetchKalshiMarkets(
  limit: number = 25,
  cursor?: string
): Promise<KalshiMarketsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_KALSHI_API_BASE_URL || 
    'https://api.elections.kalshi.com/trade-api/v2'
  
  const apiKeyId = process.env.KALSHI_API_KEY_ID
  const privateKey = process.env.KALSHI_PRIVATE_KEY
  
  if (!apiKeyId || !privateKey) {
    const missing = []
    if (!apiKeyId) missing.push('KALSHI_API_KEY_ID')
    if (!privateKey) missing.push('KALSHI_PRIVATE_KEY')
    
    throw new Error(
      `Kalshi API credentials not configured. Missing: ${missing.join(', ')}. ` +
      `Please create a .env.local file in the project root with these variables. ` +
      `See KALSHI_SETUP.md for instructions.`
    )
  }
  
  // Validate private key format
  if (!privateKey.includes('BEGIN RSA PRIVATE KEY') || !privateKey.includes('END RSA PRIVATE KEY')) {
    throw new Error(
      'Invalid private key format. The private key must include the BEGIN and END markers. ' +
      'Format: -----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----'
    )
  }
  
  // Build query parameters
  const params = new URLSearchParams({
    limit: limit.toString(),
  })
  
  if (cursor) {
    params.append('cursor', cursor)
  }
  
  // Note: Kalshi API might have additional optional parameters
  // We'll start with basic parameters and adjust based on response
  
  // For signing, use path without query parameters
  const signPath = '/markets'
  const method = 'GET'
  
  // Create authenticated headers (sign path without query params)
  const headers = createAuthHeaders(method, signPath, apiKeyId, privateKey)
  
  // Build full path with query parameters for the actual request
  const path = `/markets?${params.toString()}`
  
  // Make the request
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Kalshi API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        url: `${baseUrl}${path}`,
      })
      throw new Error(`Kalshi API error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Kalshi API Request Error:', error.message)
      throw error
    }
    throw new Error(`Unknown error fetching Kalshi markets: ${error}`)
  }
}

/**
 * Fetch a specific market by ticker
 */
export async function fetchKalshiMarket(ticker: string): Promise<KalshiMarket> {
  const baseUrl = process.env.NEXT_PUBLIC_KALSHI_API_BASE_URL || 
    'https://api.elections.kalshi.com/trade-api/v2'
  
  const apiKeyId = process.env.KALSHI_API_KEY_ID
  const privateKey = process.env.KALSHI_PRIVATE_KEY
  
  if (!apiKeyId || !privateKey) {
    throw new Error('Kalshi API credentials not configured.')
  }
  
  const path = `/markets/${ticker}`
  const method = 'GET'
  
  const headers = await createAuthHeaders(method, path, apiKeyId, privateKey)
  
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
  })
  
  if (!response.ok) {
    throw new Error(`Kalshi API error: ${response.status}`)
  }
  
  const data = await response.json()
  return data.market || data
}

