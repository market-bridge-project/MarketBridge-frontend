import React from 'react'
import { LandingHeader } from './components/LandingHeader'
import { LandingContent } from './components/LandingContent'
import { LandingFooter } from './components/LandingFooter'

// 랜딩 페이지
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-app flex flex-col items-center justify-center py-8 px-4 font-pretendard">
      <div className="w-full max-w-[420px] flex flex-col gap-6 bg-app">
        <LandingHeader />
        <LandingContent />
        <LandingFooter />
      </div>
    </div>
  )
}
