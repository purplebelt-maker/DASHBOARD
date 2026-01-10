import { Market } from '@/types'

interface StatusBadgeProps {
  status: Market['status']
}

const statusConfig: Record<
  Market['status'],
  { label: string; className: string }
> = {
  active: {
    label: 'Open',
    className: 'bg-green-600 text-white',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-600 text-gray-300',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-blue-600 text-white',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}

