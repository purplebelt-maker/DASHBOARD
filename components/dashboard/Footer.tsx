export default function Footer() {
  return (
    <footer className="mt-12 bg-[#0f172a] py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-center text-sm text-gray-400">
            © Prediction Market Edge • Exclusive for subscribers • Not financial
            advice
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

