/**
 * Polymarket API Client
 * Uses public Gamma API endpoints - no authentication required
 * Based on: https://docs.polymarket.com
 */

// Polymarket API Types
export interface PolymarketMarket {
  id: string
  question: string
  slug?: string
  title?: string
  description?: string
  category?: string
  liquidity?: string | number
  liquidityNum?: number
  volume?: string | number
  volumeNum?: number
  volume24hr?: string | number
  volume24hrClob?: string | number
  volume24hrNum?: number
  volume1wk?: number
  volume1mo?: number
  volume1yr?: number
  lastTradePrice?: number
  outcomePrices?: string // JSON string array
  outcomes?: string // JSON string array
  bestAsk?: number
  bestBid?: number
  endDate?: string
  endDateIso?: string
  startDate?: string
  startDateIso?: string
  createdAt?: string
  updatedAt?: string
  status?: string
  active?: boolean
  closed?: boolean
  resolved?: boolean
  oneDayPriceChange?: number
  oneWeekPriceChange?: number
  oneMonthPriceChange?: number
  oneYearPriceChange?: number
  competitive?: number
  image?: string
  icon?: string
  events?: Array<{
    id?: string
    title?: string
    category?: string
    ticker?: string
    slug?: string
    description?: string
    image?: string
    icon?: string
    volume?: string | number
    volume24hr?: string | number
    volume1wk?: number
    volume1mo?: number
    volume1yr?: number
    liquidity?: string | number
    competitive?: number
    active?: boolean
    closed?: boolean
    series?: Array<{
      id?: string
      title?: string
      ticker?: string
      slug?: string
      volume?: string | number
      liquidity?: string | number
      recurrence?: string
      seriesType?: string
      active?: boolean
      closed?: boolean
      commentCount?: number
      createdAt?: string
      updatedAt?: string
    }>
    [key: string]: any // Allow any additional fields
  }>
  series?: Array<{
    id?: string
    title?: string
    ticker?: string
    slug?: string
    volume?: string | number
    liquidity?: string | number
    recurrence?: string
    seriesType?: string
    active?: boolean
    closed?: boolean
    commentCount?: number
    createdAt?: string
    updatedAt?: string
    [key: string]: any // Allow any additional fields
  }>
  [key: string]: any // Allow any additional fields from API
}

export interface PolymarketMarketsResponse {
  data?: PolymarketMarket[]
  markets?: PolymarketMarket[]
  cursor?: string
  nextCursor?: string
}

const GAMMA_API_BASE_URL = 'https://gamma-api.polymarket.com'

/**
 * Fetch markets from Polymarket Gamma API
 * Public endpoint - no authentication required
 */
export async function fetchPolymarketMarkets(
  options?: {
    limit?: number
    cursor?: string
    status?: 'open' | 'closed' | 'resolved'
    category?: string
    sort?: 'volume' | 'liquidity' | 'newest' | 'oldest'
    closed?: boolean
    include?: string
  }
): Promise<PolymarketMarketsResponse> {
  const params = new URLSearchParams()
  
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  
  if (options?.cursor) {
    params.append('cursor', options.cursor)
  }
  
  // Polymarket Gamma API uses 'active' parameter for open markets
  if (options?.status) {
    if (options.status === 'open') {
      params.append('active', 'true')
    } else {
      params.append('status', options.status)
    }
  } else {
    // Default to active/open markets
    params.append('active', 'true')
  }
  
  if (options?.category) {
    params.append('category', options.category)
  }
  
  if (options?.sort) {
    params.append('sort', options.sort)
  } else {
    // Default to sorting by volume
    params.append('sort', 'volume')
  }

  // Force closed flag if provided
  if (options?.closed !== undefined) {
    params.append('closed', String(options.closed))
  }

  // Optional include parameter (e.g., condition)
  if (options?.include) {
    params.append('include', options.include)
  }
  
  try {
    const url = `${GAMMA_API_BASE_URL}/markets?${params.toString()}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for fresh data
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    
    // Handle different response formats
    if (Array.isArray(data)) {
      return { data, markets: data }
    }
    
    if (data.data) {
      return { data: data.data, markets: data.data, cursor: data.cursor || data.nextCursor }
    }
    
    if (data.markets) {
      return { markets: data.markets, data: data.markets, cursor: data.cursor || data.nextCursor }
    }
    
    return { data: [], markets: [] }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Unknown error fetching Polymarket markets: ${error}`)
  }
}

/**
 * Fetch a specific market by ID
 */
export async function fetchPolymarketMarket(marketId: string): Promise<PolymarketMarket> {
  try {
    const response = await fetch(`${GAMMA_API_BASE_URL}/markets/${marketId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.market || data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Unknown error fetching Polymarket market: ${error}`)
  }
}

/**
 * Fetch events from Polymarket
 */
export async function fetchPolymarketEvents(options?: {
  limit?: number
  cursor?: string
  category?: string
}) {
  const params = new URLSearchParams()
  
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  
  if (options?.cursor) {
    params.append('cursor', options.cursor)
  }
  
  if (options?.category) {
    params.append('category', options.category)
  }
  
  try {
    const response = await fetch(`${GAMMA_API_BASE_URL}/events?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Unknown error fetching Polymarket events: ${error}`)
  }
}

