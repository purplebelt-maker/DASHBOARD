'use client'

import { useState, useEffect } from 'react'

export default function PrivacyModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasAccepted = localStorage.getItem('privacyPolicyAccepted')
    if (!hasAccepted) {
      setIsOpen(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true')
    setIsOpen(false)
  }

  const handleClose = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-2xl rounded-lg bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="border-b border-blue-500 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Privacy Policy & Disclaimer</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6 text-white">
            <div>
              <h3 className="mb-3 text-lg font-bold text-blue-400">Privacy Policy</h3>
              <p className="mb-4 text-gray-300">
                Prediction Market Edge (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our dashboard.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-blue-400">Information We Collect</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-300">
                <li>We do not collect personal information from visitors to this dashboard</li>
                <li>Market data displayed is sourced from public Polymarket API</li>
                <li>We may use browser cookies to store view preferences (table/grid view)</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-blue-400">Data Usage</h3>
              <ul className="ml-6 list-disc space-y-2 text-gray-300">
                <li>Market data is fetched from Polymarket&apos;s public API</li>
                <li>No user data is stored or transmitted to third parties</li>
                <li>All data processing occurs locally in your browser</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-bold text-blue-400">Disclaimer</h3>
              
              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-gray-200">Not Financial Advice:</h4>
                <p className="mb-3 text-gray-300">
                  The information provided on this dashboard is for informational purposes only and does not constitute financial, investment, or trading advice.
                </p>
                <ul className="ml-6 list-disc space-y-2 text-gray-300">
                  <li>Market predictions and probabilities are based on public market data and should not be used as the sole basis for investment decisions</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Trading in prediction markets involves risk of loss</li>
                  <li>You should consult with a qualified financial advisor before making any investment decisions</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="mb-2 font-semibold text-gray-200">Data Accuracy:</h4>
                <p className="text-gray-300">
                  While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or timeliness of the data displayed.
                </p>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-gray-200">No Warranty:</h4>
                <p className="text-gray-300">
                  This dashboard is provided &quot;as is&quot; without warranties of any kind, either express or implied.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 px-6 py-4">
          <button
            onClick={handleAccept}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            I Understand and Accept
          </button>
        </div>
      </div>
    </div>
  )
}

