import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { Store } from '@/types/store'

interface StorePreviewSheetProps {
  store: Store | null
  onClose: () => void
  onDetail: (storeId: string) => void
}

export const StorePreviewSheet = ({
  store,
  onClose,
  onDetail,
}: StorePreviewSheetProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!store) return
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [store, handleKeyDown])

  if (!store) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/[0.28] transition-colors duration-300"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${store.name} 미리보기`}
        className="relative mx-auto flex w-full max-w-[430px] max-h-[85vh] overflow-y-auto flex-col gap-[18px] rounded-t-[28px] rounded-b-none bg-app px-6 pt-7 pb-0 shadow-[0_14px_30px_0_rgba(43,27,14,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-2xl w-full h-[10rem] bg-glow shrink-0">
          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        <h2 className="text-[28px] font-bold leading-[34px] text-primary">
          {store.name}
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* 메인 8대 대카테고리 칩 */}
          <span className="shrink-0 rounded-full border px-3 py-1.5 text-[13px] font-semibold bg-brand text-white border-brand shadow-[0_4px_10px_rgba(21,95,58,0.15)]">
            {store.category}
          </span>

          {/* 상세 소분류 카테고리 칩 */}
          {store.subCategory && (
            <span className="shrink-0 rounded-full border border-border-default bg-white px-3 py-1.5 text-[13px] font-semibold text-primary shadow-[0_2px_6px_rgba(0,0,0,0.015)]">
              {store.subCategory}
            </span>
          )}
        </div>

        <div>
          <h3 className="font-pretendard text-[16px] font-black leading-[22px] text-primary">
            한 줄 소개
          </h3>
          <p className="mt-1 font-pretendard text-[14px] font-black leading-[22px] text-secondary">
            {store.description}
          </p>
        </div>

        <div className="pt-4 pb-8">
          <button
            type="button"
            onClick={() => onDetail(store.id)}
            className="w-full rounded-[16px] bg-brand py-4 text-base font-semibold text-white shadow-[0_10px_22px_0_rgba(21,95,58,0.24)]"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
