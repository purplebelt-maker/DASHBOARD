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
  outcomePrices?: string
  outcomes?: string
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
    [key: string]: any
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
    [key: string]: any
  }>
  [key: string]: any
}

export interface PolymarketMarketsResponse {
  data?: PolymarketMarket[]
  markets?: PolymarketMarket[]
  cursor?: string
  nextCursor?: string
}

const GAMMA_API_BASE_URL = 'https://gamma-api.polymarket.com'

export async function fetchPolymarketMarkets(
  options?: {
    limit?: number
    cursor?: string
    status?: 'open' | 'closed' | 'resolved'
    category?: string
    sort?: 'volume' | 'liquidity' | 'newest' | 'oldest'
    closed?: boolean
    include?: string
    active?: boolean
  }
): Promise<PolymarketMarketsResponse> {
  const params = new URLSearchParams()
  
  if (options?.limit) {
    params.append('limit', options.limit.toString())
  }
  
  if (options?.cursor) {
    params.append('cursor', options.cursor)
  }
  
  if (options?.active !== undefined) {
    params.append('active', String(options.active))
  } else if (options?.status) {
    if (options.status === 'open') {
      params.append('active', 'true')
    } else {
      params.append('status', options.status)
    }
  } else {
    params.append('active', 'true')
  }
  
  if (options?.category) {
    params.append('category', options.category)
  }
  
  if (options?.sort) {
    params.append('sort', options.sort)
  } else {
    params.append('sort', 'volume')
  }

  if (options?.closed !== undefined) {
    params.append('closed', String(options.closed))
  }

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
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Polymarket API error: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    
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


