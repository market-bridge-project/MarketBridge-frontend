import React from 'react'
import MapSvg from '@/assets/icons/map.svg'
import { MapStats } from './MapStats'

export const MapCard: React.FC = () => {
  return (
    <div className="bg-elevated rounded-3xl shadow-[5px_14px_20px_0px_rgba(43,27,14,0.08)] border border-[#ece9e0]/80 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_18px_25px_0px_rgba(43,27,14,0.12)]">
      <div className="relative h-64 overflow-hidden bg-[#FAFAFA] flex items-center justify-center">
        <img
          src={MapSvg}
          alt=""
          className="absolute w-[220%] max-w-none left-[-60%] top-[-48%] opacity-95"
        />
      </div>
      <MapStats />
    </div>
  )
}
