import React, { memo } from 'react'
import { Market } from '@/types'

interface StatusBadgeProps {
  status: Market['status']
}

const statusConfig: Record<
  Market['status'],
  { label: string; style: React.CSSProperties }
> = {
  active: {
    label: 'Open',
    style: {
      background: '#2563eb',
      color: '#fff',
    },
  },
  closed: {
    label: 'Closed',
    style: {
      background: '#475569',
      color: '#cbd5e1',
    },
  },
  resolved: {
    label: 'Resolved',
    style: {
      background: '#3b82f6',
      color: '#fff',
    },
  },
}

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className="inline-flex items-center rounded px-2 py-1 text-xs font-medium"
      style={config.style}
    >
      {config.label}
    </span>
  )
}

export default memo(StatusBadge)

