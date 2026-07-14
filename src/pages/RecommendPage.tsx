import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FilterCard, RecommendModal } from '../components/SearchPage'
import { postRecommend } from '../api/recommend'
import { getKeywords } from '../api/keyword'
import backIcon from '../assets/icons/weui_back-filled.svg'

const toggleItem = (list: string[], item: string): string[] => {
  return list.includes(item) ? [] : [item]
}

const SearchPage = () => {
  const navigate = useNavigate()
  const [companion, setCompanion] = useState<string[]>([])
  const [purpose, setPurpose] = useState<string[]>([])
  const [duration, setDuration] = useState<string[]>([])
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false)

  const hasSelection =
    companion.length > 0 && purpose.length > 0 && duration.length > 0

  const {
    data: keywords,
    isLoading: isKeywordsLoading,
    isError: isKeywordsError,
  } = useQuery({
    queryKey: ['keywords'],
    queryFn: getKeywords,
  })

  const recommendMutation = useMutation({
    mutationFn: postRecommend,
    onSuccess: () => setIsRecommendModalOpen(true),
  })

  const handleToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
      (value: string) =>
        setter((prev) => toggleItem(prev, value)),
    [],
  )

  const handleSubmit = () => {
    recommendMutation.mutate({
      who: companion[0],
      what: purpose[0],
      time: duration[0],
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="relative flex items-center justify-center bg-app px-5 py-3 border-b border-border-default">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 flex items-center"
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
        <h1 className="text-[16px] font-bold text-primary">AI 코스 추천</h1>
      </header>

      <main className="bg-surface-green px-5 pt-6 pb-6">
        <div>
          <h2 className="text-top leading-[36px] font-bold text-primary break-keep">
            오늘 어떤 시간을
            <br />
            찾고 계신가요?
          </h2>
          <p className="mt-3 text-[13px] font-medium text-subtext leading-normal break-keep">
            각 항목별로 하나씩 선택할 수 있어요. 선택값으로 시장 안 코스를
            추천합니다.
          </p>
        </div>
      </main>

      <div className="flex-1 px-5 pt-8">
        {isKeywordsLoading && (
          <p className="text-center text-sm text-gray-500">불러오는 중...</p>
        )}
        {!isKeywordsLoading && (isKeywordsError || !keywords) && (
          <p className="text-center text-sm text-gray-500">
            선택지를 불러오지 못했어요.
          </p>
        )}
        {keywords && (
          <FilterCard
            companion={companion}
            purpose={purpose}
            duration={duration}
            companionOptions={keywords.WHO ?? []}
            purposeOptions={keywords.WHAT ?? []}
            durationOptions={keywords.DURATION ?? []}
            onToggleCompanion={handleToggle(setCompanion)}
            onTogglePurpose={handleToggle(setPurpose)}
            onToggleDuration={handleToggle(setDuration)}
          />
        )}
      </div>

      <div className="px-5 pt-6 pb-8">
        <p className="mb-3 text-center text-[11px] font-medium text-subtext leading-relaxed break-keep">
          새로운 코스를 추천받으면 기존에 저장된 코스 정보는 삭제됩니다.
        </p>
        <button
          type="button"
          disabled={!hasSelection || recommendMutation.isPending}
          onClick={handleSubmit}
          className={`w-full rounded-2xl py-4 shadow-[0_10px_22px_0_rgba(21,95,58,0.24)] ${
            hasSelection
              ? 'bg-brand text-on-brand text-[18px] font-bold leading-[22px]'
              : 'bg-[#A0BCA8] text-[#FDFBF8] text-[18px] font-bold leading-[22px]'
          }`}
        >
          {recommendMutation.isPending ? '추천 받는 중...' : 'AI 추천 받기'}
        </button>
        {recommendMutation.isError && (
          <p className="mt-3 text-center text-[13px] font-medium text-red-500">
            추천을 받아오지 못했어요. 다시 시도해주세요.
          </p>
        )}
      </div>
      <RecommendModal
        open={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
        result={recommendMutation.data}
      />
    </div>
  )
}

export default SearchPage
