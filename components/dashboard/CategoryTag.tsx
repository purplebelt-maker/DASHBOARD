interface CategoryTagProps {
  category: string
}

export default function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span
      className="inline-block rounded-md px-2.5 py-1 text-xs"
      style={{
        background: '#334155',
        color: '#94a3b8',
      }}
    >
      {category}
    </span>
  )
}

