import { useNavigate } from 'react-router-dom'
import closeIcon from '../../assets/icons/material-symbols_close.svg'

interface RecommendModalProps {
  open: boolean
  onClose: () => void
  filters: {
    companion: string[]
    purpose: string[]
    duration: string[]
  }
}

const DUMMY_COURSES = [
  { name: '광장 호떡집', tags: '간식 · 호떡' },
  { name: '광장 호떡집', tags: '간식 · 호떡' },
  { name: '광장 호떡집', tags: '간식 · 호떡' },
]

export const RecommendModal = ({
  open,
  onClose,
  filters,
}: RecommendModalProps) => {
  const navigate = useNavigate()

  if (!open) return null

  const handleDetail = () => {
    onClose()
    navigate('/recommend-result', { state: filters })
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
              {DUMMY_COURSES.map((course, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-border-default bg-elevated p-3 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{course.name}</p>
                    <p className="text-xs text-gray-500">{course.tags}</p>
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
