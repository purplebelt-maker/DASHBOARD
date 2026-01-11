'use client'

interface ViewToggleProps {
  view: 'table' | 'grid'
  onViewChange: (view: 'table' | 'grid') => void
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent p-1 transition-colors duration-300">
      <button
        onClick={() => onViewChange('table')}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-4 sm:text-base ${
          view === 'table'
            ? 'bg-blue-500 dark:bg-blue-600 text-white'
            : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Table View
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-300 sm:px-4 sm:text-base ${
          view === 'grid'
            ? 'bg-blue-500 dark:bg-blue-600 text-white'
            : 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        Grid View
      </button>
    </div>
  )
}

