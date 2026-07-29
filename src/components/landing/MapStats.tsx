import React from 'react'
import MbLogo from '@/assets/icons/logo_mb.png'
import SeoulLogo from '@/assets/icons/서울동행 로고_가로형.png'
import SaemaeulLogo from '@/assets/icons/새마을시장 로고.png'

const PARTNER_LOGOS = [
  { src: MbLogo, alt: 'Market Bridge', className: 'h-6' },
  { src: SeoulLogo, alt: '서울동행', className: 'h-6' },
  { src: SaemaeulLogo, alt: '새마을전통시장', className: 'h-10' },
] as const

export const MapStats: React.FC = () => {
  return (
    <div className="flex items-center h-[5rem] bg-white">
      {PARTNER_LOGOS.map(({ src, alt, className }) => (
        <div
          key={alt}
          className="flex-1 flex items-center justify-center px-3 h-full"
        >
          <img
            src={src}
            alt={alt}
            className={`${className} w-auto max-w-full object-contain`}
          />
        </div>
      ))}
    </div>
  )
}
