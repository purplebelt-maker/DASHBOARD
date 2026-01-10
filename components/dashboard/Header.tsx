export default function Header() {
  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-7xl rounded-lg bg-[#1e293b] px-4 py-6 sm:px-6 lg:px-8">
        {/* Logo and Title - Centered */}
        <div className="flex flex-col items-center justify-center space-y-3">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              Prediction Market Edge Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Live Odds — Top Polymarket Markets by Volume
            </p>
          </div>
        </div>
      </header>
    </div>
  )
}
