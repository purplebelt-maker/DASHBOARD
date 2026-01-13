interface CategoryTagProps {
  category: string
}

// Color mapping for categories - dim, great colors that look good on the dashboard
const categoryColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string }> = {
  General: {
    bg: 'bg-gray-200',
    text: 'text-gray-700',
    darkBg: 'dark:bg-gray-700',
    darkText: 'dark:text-gray-400',
  },
  Politics: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    darkBg: 'dark:bg-blue-900/40',
    darkText: 'dark:text-blue-300',
  },
  Economics: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    darkBg: 'dark:bg-green-900/40',
    darkText: 'dark:text-green-300',
  },
  Crypto: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    darkBg: 'dark:bg-yellow-900/40',
    darkText: 'dark:text-yellow-300',
  },
  Climate: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    darkBg: 'dark:bg-emerald-900/40',
    darkText: 'dark:text-emerald-300',
  },
  Technology: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    darkBg: 'dark:bg-purple-900/40',
    darkText: 'dark:text-purple-300',
  },
  Entertainment: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    darkBg: 'dark:bg-pink-900/40',
    darkText: 'dark:text-pink-300',
  },
  Legal: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    darkBg: 'dark:bg-indigo-900/40',
    darkText: 'dark:text-indigo-300',
  },
  Health: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    darkBg: 'dark:bg-red-900/40',
    darkText: 'dark:text-red-300',
  },
  Science: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-800',
    darkBg: 'dark:bg-cyan-900/40',
    darkText: 'dark:text-cyan-300',
  },
  Business: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    darkBg: 'dark:bg-orange-900/40',
    darkText: 'dark:text-orange-300',
  },
}

export default function CategoryTag({ category }: CategoryTagProps) {
  // Get colors for this category, default to General if not found
  const colors = categoryColors[category] || categoryColors.General
  
  return (
    <span
      className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} transition-colors duration-300`}
    >
      {category}
    </span>
  )
}

