import React from 'react'

const MARKET_STATS = [
  { value: 114, label: '점포' },
  { value: 56, label: '미션' },
  { value: 32, label: '맛집' },
] as const

export const MapStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 h-[5rem] items-center text-center bg-white">
      {MARKET_STATS.map(({ value, label }) => (
        <div key={label}>
          <div className="text-2xl font-bold text-device font-pretendard tracking-tight">
            {value}
          </div>
          <div className="text-xs text-subtext font-medium mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}
