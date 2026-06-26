import React from 'react'

interface MarketBadgeProps {
  text: string
}

export const MarketBadge: React.FC<MarketBadgeProps> = ({ text }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-badge text-brand rounded-full text-xs font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
      {text}
    </div>
  )
}
