import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Polymarket Dashboard | Live Prediction Market Data',
  description: 'Live prediction market data dashboard showing top Polymarket markets by volume',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/prediction-market-edge-logo.png',
    shortcut: '/prediction-market-edge-logo.png',
    apple: '/prediction-market-edge-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  )
}

