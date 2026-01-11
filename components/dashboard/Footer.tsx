export default function Footer() {
  return (
    <footer className="mt-4 bg-gray-50 dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-700 py-6 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            © Prediction Market Edge • Exclusive for subscribers • Not financial
            advice
          </p>
          <div className="flex items-center space-x-2 text-sm">
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400 dark:text-gray-600 transition-colors duration-300">•</span>
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

