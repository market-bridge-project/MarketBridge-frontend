import React from 'react'
import { MapCard } from './MapCard'

// 랜딩 본문
export const LandingContent: React.FC = () => {
  return (
    <section className="animate-fade-in-up delay-100 w-full flex flex-col gap-5">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-screen-title text-device font-pretendard leading-snug">
          잠실야구장 옆,
          <br />
          시장의 숨겨진 재미를 발견하다
        </h2>
        <p className="text-body-copy text-[#8B8B8B] font-normal">
          114개 점포 / 맛집 추천 / AI 코스 / 스탬프 투어까지 한 번에
        </p>
      </div>

      <MapCard />
    </section>
  )
}
