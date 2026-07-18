import { useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import { getStoreDetail } from '@/api/storeDetail'
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
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const numericStoreId = store ? Number(store.id) : NaN
  const { data: detail } = useQuery({
    queryKey: ['storeDetail', numericStoreId],
    queryFn: () => getStoreDetail(numericStoreId),
    enabled: store !== null && Number.isFinite(numericStoreId),
  })

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCloseRef.current()
      return
    }

    if (e.key === 'Tab' && dialogRef.current) {
      const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        if (
          document.activeElement === firstElement ||
          document.activeElement === dialogRef.current
        ) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!store) return

    previousActiveElement.current = document.activeElement as HTMLElement

    // 모달이 열리면 포커스를 다이얼로그 컨테이너로 이동
    if (dialogRef.current) {
      dialogRef.current.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [store, handleKeyDown])

  if (!store) return null

  // store.name은 지도 JSON에 큐레이션된 값이라 백엔드 원본(detail.name)보다 우선합니다.
  const name = store.name ?? detail?.name
  const category = detail?.category ?? store.category
  const intro = detail?.intro
  // store.imageUrl은 지도 조회 시 이미 받아온 값이라 상세 API 응답보다 먼저 쓸 수 있음
  const imageUrl = store.imageUrl ?? detail?.imageUrl

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/[0.28] transition-colors duration-300"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${name} 미리보기`}
        tabIndex={-1}
        className="relative mx-auto flex w-full max-w-[430px] max-h-[60vh] overflow-y-auto flex-col gap-4.5 rounded-t-[28px] rounded-b-none bg-app px-6 pt-5 pb-6 shadow-[0_14px_30px_0_rgba(43,27,14,0.08)] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 점포 이미지 */}
        <div className="overflow-hidden rounded-2xl w-full h-24 bg-glow shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              decoding="async"
              // @ts-expect-error fetchPriority는 최신 브라우저 지원 속성, React 타입 정의에 아직 없음
              fetchpriority="high"
            />
          ) : (
            <div className="w-full h-full bg-gray-200" />
          )}
        </div>

        {/* 타이틀 및 카테고리 태그 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold leading-7 text-primary tracking-normal">
            {name}
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold bg-brand text-white border-brand shadow-[0_4px_10px_rgba(21,95,58,0.15)]">
              {category}
            </span>
          </div>
        </div>

        {/* 한 줄 소개 */}
        <div className="flex flex-col gap-1.5">
          <h3 className="font-pretendard text-[14px] font-black leading-5 text-primary tracking-normal">
            한 줄 소개
          </h3>
          <p className="font-pretendard text-[12px] font-medium leading-relaxed text-secondary break-keep tracking-normal">
            {intro ?? '등록된 소개가 없어요.'}
          </p>
        </div>

        {/* 상세보기 버튼 */}
        <div className="mt-4 shrink-0">
          <button
            type="button"
            onClick={() => onDetail(store.id)}
            className="w-full rounded-[16px] bg-brand py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_0_rgba(21,95,58,0.20)] active:scale-[0.98] transition-transform duration-150"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
