import React from 'react'
import { Link } from 'react-router-dom'

// 랜딩 푸터
export const LandingFooter: React.FC = () => {
  return (
    <footer className="animate-fade-in-up delay-200 w-full">
      <Link
        to="/"
        className="flex items-center justify-center w-full py-4 bg-brand hover:bg-[#0f462a] active:scale-[0.98] text-white !text-white text-base font-bold rounded-2xl shadow-[0_10px_22px_0px_rgba(21,95,58,0.24)] transition-all duration-200 text-center font-pretendard"
        style={{ color: '#ffffff' }}
      >
        시장 지도 보러가기
      </Link>
    </footer>
  )
}
