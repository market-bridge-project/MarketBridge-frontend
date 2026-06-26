import React from 'react'
import { Store } from '../../types/store'

interface StoreCardProps {
  store: Store
  onClick: () => void
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-3xl border border-[#ece9e0]/80 bg-white p-[18px] text-left shadow-[0_4px_12px_0_rgba(43,27,14,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_0_rgba(43,27,14,0.06)] active:scale-[0.99]"
    >
      <div className="flex items-center gap-4 min-w-0">
        {/* 상점 썸네일 이미지 또는 대체 첫 글자 */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-glow font-pretendard text-lg font-bold text-brand">
          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
              className="h-full w-full object-cover"
            />
          ) : (
            store.name.charAt(0)
          )}
        </div>

        {/* 상점 정보 */}
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-tight text-primary truncate">
            {store.name}
          </h3>
          <p className="mt-1.5 text-[13px] font-medium leading-none text-secondary truncate">
            {store.subCategory} · {store.hours}
          </p>
        </div>
      </div>

      <svg
        className="h-5 w-5 text-[#8b8b8b] shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  )
}
