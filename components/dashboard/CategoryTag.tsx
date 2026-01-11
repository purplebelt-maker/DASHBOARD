interface CategoryTagProps {
  category: string
}

export default function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span
      className="inline-block rounded-md px-2.5 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-400 transition-colors duration-300"
    >
      {category}
    </span>
  )
}

