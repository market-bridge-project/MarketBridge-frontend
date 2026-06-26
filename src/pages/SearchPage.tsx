import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FilterCard, RecommendModal } from '../components/SearchPage'
import backIcon from '../assets/icons/weui_back-filled.svg'

const toggleItem = (list: string[], item: string): string[] => {
  return list.includes(item)
    ? list.filter((v) => v !== item)
    : [...list, item]
}

const SearchPage = () => {
  const navigate = useNavigate()
  const [companion, setCompanion] = useState<string[]>([])
  const [purpose, setPurpose] = useState<string[]>([])
  const [duration, setDuration] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)

  const hasSelection =
    companion.length > 0 || purpose.length > 0 || duration.length > 0

  const handleToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
      (value: string) =>
        setter((prev) => toggleItem(prev, value)),
    [],
  )

  const handleSubmit = () => {
    setShowResult(true)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="flex items-center px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold">
          AI 코스 추천
        </h1>
        <div className="w-10" />
      </header>

      <main className="bg-surface-green px-5 pt-4 pb-8">
        <div>
          <h2 className="text-top leading-[38px] font-bold">
            오늘 어떤 시간을
            <br />
            찾고 계신가요?
          </h2>
          <p className="mt-4 text-body-secondary text-subtext">
            여러 개 선택할 수 있어요. 선택값으로 시장 안 코스를 추천합니다.
          </p>
        </div>
      </main>

      <div className="flex-1 px-5 pt-8">
        <FilterCard
          companion={companion}
          purpose={purpose}
          duration={duration}
          onToggleCompanion={handleToggle(setCompanion)}
          onTogglePurpose={handleToggle(setPurpose)}
          onToggleDuration={handleToggle(setDuration)}
        />
      </div>

      <div className="px-5 pt-6 pb-8">
        <button
          type="button"
          disabled={!hasSelection}
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-brand py-4 text-base font-semibold text-white disabled:opacity-40"
        >
          AI 추천 받기
        </button>
      </div>
      <RecommendModal
        open={showResult}
        onClose={() => setShowResult(false)}
        filters={{ companion, purpose, duration }}
      />
    </div>
  )
}

export default SearchPage
