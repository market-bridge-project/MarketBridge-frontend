import React from 'react'

// 통계 지표
export const MapStats: React.FC = () => {
  return (
    <div className="grid grid-cols-3 h-[5rem] items-center text-center bg-white">
      <div>
        <div className="text-2xl font-bold text-device font-pretendard tracking-tight">
          114
        </div>
        <div className="text-xs text-subtext font-medium mt-1">점포</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-device font-pretendard tracking-tight">
          56
        </div>
        <div className="text-xs text-subtext font-medium mt-1">미션</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-device font-pretendard tracking-tight">
          32
        </div>
        <div className="text-xs text-subtext font-medium mt-1">맛집</div>
      </div>
    </div>
  )
}
