import { useNavigate } from 'react-router-dom'
import type { RecommendResult } from '../../types/recommend'
import closeIcon from '../../assets/icons/material-symbols_close.svg'

interface RecommendModalProps {
  open: boolean
  onClose: () => void
  result?: RecommendResult
}

export const RecommendModal = ({
  open,
  onClose,
  result,
}: RecommendModalProps) => {
  const navigate = useNavigate()

  if (!open || !result) return null

  const handleDetail = () => {
    const SAVED_COURSE_KEY = 'savedCourse'
    const COURSE_STORE_IDS_KEY = 'courseStoreIds'
    const COURSE_TITLE_KEY = 'courseTitle'
    const IS_COURSE_VISIBLE_KEY = 'isCourseVisible'
    const keys = [
      SAVED_COURSE_KEY,
      COURSE_STORE_IDS_KEY,
      COURSE_TITLE_KEY,
      IS_COURSE_VISIBLE_KEY,
    ]
    let previousValues: (string | null)[] | null = null

    try {
      previousValues = keys.map((key) => localStorage.getItem(key))

      localStorage.setItem(SAVED_COURSE_KEY, JSON.stringify(result))
      localStorage.setItem(
        COURSE_STORE_IDS_KEY,
        JSON.stringify(result.stores.map((s) => String(s.storeId))),
      )
      localStorage.setItem(
        COURSE_TITLE_KEY,
        result.courseTitle.replace(/[\r\n]+/g, ' '),
      )
      localStorage.setItem(IS_COURSE_VISIBLE_KEY, 'true')
    } catch {
      // 저장 도중 실패하면 서로 다른 코스의 값이 섞이지 않도록 이전 값으로 되돌린다
      // (이전 값 스냅샷 자체를 못 얻었다면 되돌릴 기준이 없으므로 건너뛴다)
      if (previousValues) {
        const snapshot = previousValues
        keys.forEach((key, i) => {
          try {
            const prev = snapshot[i]
            if (prev === null) {
              localStorage.removeItem(key)
            } else {
              localStorage.setItem(key, prev)
            }
          } catch {
            // 복구도 실패하면 더 이상 할 수 있는 것이 없으므로 무시
          }
        })
      }
    }
    onClose()
    navigate('/recommend-result', { state: result })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="mx-5 w-full max-w-sm overflow-hidden rounded-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-glow px-6 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-brand">AI 추천 결과</span>
            <button type="button" onClick={onClose}>
              <img src={closeIcon} alt="닫기" className="h-6 w-6" />
            </button>
          </div>

          <h2 className="mt-3 text-2xl font-bold leading-tight">
            이 코스가
            <br />잘 맞아요 !
          </h2>
        </div>

        <div className="px-6 pt-3 pb-4">
          <div className="rounded-2xl border border-[#155F3A3D] bg-elevated p-4">
            <p className="mb-3 text-sm font-semibold text-brand">
              추천 코스 미리보기
            </p>
            <ul className="flex flex-col gap-2">
              {result.stores.map((store, i) => (
                <li
                  key={store.storeId}
                  className="flex items-center gap-3 rounded-2xl border border-border-default bg-elevated p-3 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.category}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={handleDetail}
            className="mt-3 w-full rounded-2xl bg-brand py-4 text-base font-semibold text-white"
          >
            상세보기
          </button>
        </div>
      </div>
    </div>
  )
}
