// Market data types
export interface Market {
  id: string
  question: string
  category: string
  probabilityYes: number // Yes probability (0-100)
  probabilityNo: number // No probability (0-100)
  change24h: number | null // Can be null if N/A
  liquidity: number
  volume24h: number
  volumeTotal: number
  endDate: string // ISO date string
  status: 'active' | 'closed' | 'resolved'
  // Allow additional fields from Polymarket API (events, series, etc.)
  [key: string]: any
}

export type SortField = 'volume24h' | 'probability' | 'liquidity' | 'change24h'
export type SortDirection = 'asc' | 'desc'
