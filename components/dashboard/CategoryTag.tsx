interface CategoryTagProps {
  category: string
}

export default function CategoryTag({ category }: CategoryTagProps) {
  // Simple gray tag for dark theme - matches the reference design
  return (
    <span className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300">
      {category}
    </span>
  )
}

