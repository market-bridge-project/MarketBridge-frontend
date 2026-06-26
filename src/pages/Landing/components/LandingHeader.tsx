import React from 'react'
import { MarketBadge } from './MarketBadge'

export const LandingHeader: React.FC = () => {
  return (
    <header className="animate-fade-in-up relative bg-surface-green w-full rounded-3xl p-6 pb-8 overflow-hidden shadow-[0_4px_20px_rgba(21,95,58,0.04)] border border-[#cbe4ca]/40">
      <svg
        width="99"
        height="110"
        viewBox="0 0 99 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-float absolute right-[-12px] top-[8%] w-24 h-auto opacity-85 pointer-events-none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M68.2497 10.5255C80.1135 13.0473 87.8309 24.931 85.3092 36.7949C83.226 46.5955 65.2272 61.1 58.5083 66.5007C57.0489 67.4485 55.1575 67.0465 54.2098 65.587C50.2684 57.9204 39.8971 37.3856 41.9803 27.5851C44.5021 15.7212 56.2139 7.96724 68.2497 10.5255ZM62.1098 39.4115C66.0644 40.252 69.9891 37.8515 70.8662 33.7249C71.7068 29.7703 69.1344 25.8091 65.1797 24.9685C61.0532 24.0914 57.2639 26.7004 56.4233 30.655C55.5462 34.7816 57.9832 38.5343 62.1098 39.4115ZM14.2756 37.87L36.2822 34.1013C36.5937 36.8632 37.4211 39.7347 38.3838 42.8146L29.8683 82.8766L3.66619 88.6288C1.76406 89.1231 0.165093 87.3455 0.603657 85.2822L9.7404 42.2972C10.2155 40.062 12.0296 38.2911 14.2756 37.87ZM55.0928 72.4239C57.4999 72.9356 59.9544 72.3791 61.9039 70.8166C66.1833 67.593 70.7443 63.89 75.0344 59.7701L66.0439 102.067L35.3704 84.0461L42.0219 52.7531C44.0935 58.2252 46.7541 63.4632 49.3523 68.1487C50.4977 70.369 52.5137 71.8757 55.0928 72.4239ZM108.065 48.1013C109.967 47.6071 111.738 49.4212 111.3 51.4844L102.163 94.4694C101.688 96.7047 99.7017 98.439 97.4557 98.8602L71.546 103.237L82.0715 53.7181L108.065 48.1013Z"
          fill="white"
          fillOpacity="0.75"
        />
      </svg>

      <div className="relative z-10 flex flex-col items-start gap-4">
        <MarketBadge text="잠실새마을시장" />

        <div className="flex flex-col gap-1.5">
          <h1 className="text-hero text-device font-pretendard leading-tight">
            새마을전통시장,
            <br />
            어디 갈지 고민된다면
          </h1>
          <p className="text-body-copy text-[#8B8B8B] font-normal mt-1">
            114개 점포를 한눈에 보고 빠르게 찾아보세요
          </p>
        </div>
      </div>
    </header>
  )
}
