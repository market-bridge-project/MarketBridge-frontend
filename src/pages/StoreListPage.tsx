import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/components/common/SearchBar'
import { CategoryChip } from '@/components/common/CategoryChip'
import { StoreCard } from '@/components/common/StoreCard'
import { DUMMY_STORES } from '@/api/stores'
import backIcon from '@/assets/icons/weui_back-filled.svg'
import macatSorryIcon from '@/assets/icons/macat_sorry.svg'

const CATEGORIES = [
  '전체',
  '음식',
  '수산·정육',
  '농산물',
  '떡·빵·간식',
  '반찬·식재료',
  '의류',
  '생활·서비스',
]

/** 디바운싱 지연 시간 (ms) */
const DEBOUNCE_DELAY = 300

const StoreListPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  // 디바운싱이 적용된 실제 검색어 (이 값으로 필터링)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    '전체',
  ])

  // 검색어 입력 시 디바운싱 적용: 타이핑이 멈춘 후 300ms 뒤에 실제 검색 실행
  useEffect(() => {
    // 입력값이 비었으면 즉시 초기화 (불필요한 대기 방지)
    if (searchQuery.trim() === '') {
      setDebouncedQuery('')
      return
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim())
    }, DEBOUNCE_DELAY)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  const handleCategoryClick = (category: string) => {
    if (category === '전체') {
      setSelectedCategories(['전체'])
      return
    }

    setSelectedCategories((prev) => {
      const isAlreadySelected = prev.includes(category)
      if (isAlreadySelected) {
        const next = prev.filter((c) => c !== category)
        return next.length === 0 ? ['전체'] : next
      } else {
        const next = prev.filter((c) => c !== '전체')
        return [...next, category]
      }
    })
  }

  // 선택 여부 및 원래 인덱스 순서에 따라 카테고리 정렬 (전체는 항상 맨 앞에 고정)
  const orderedCategories = [
    '전체',
    ...CATEGORIES.filter((c) => c !== '전체').sort((a, b) => {
      const aSelected = selectedCategories.includes(a)
      const bSelected = selectedCategories.includes(b)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return CATEGORIES.indexOf(a) - CATEGORIES.indexOf(b)
    }),
  ]

  // 선택된 카테고리와 디바운싱된 검색어에 따라 상점 필터링
  const filteredStores = DUMMY_STORES.filter((store) => {
    const matchesCategory =
      selectedCategories.includes('전체') ||
      selectedCategories.includes(store.category)

    const matchesSearch =
      store.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      store.subCategory.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      (store.menus &&
        store.menus.some((menu) =>
          menu.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
        ))

    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      {/* 헤더 영역 */}
      <header className="relative flex items-center justify-center bg-app px-5 py-3 shrink-0 border-b border-border-default">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 flex items-center"
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
        <h1 className="text-[16px] font-bold text-primary">카테고리</h1>
      </header>

      <main className="flex-1 flex flex-col">
        {/* 검색창을 포함한 배너 영역 */}
        <section className="bg-surface-green px-5 pt-4 pb-8 shrink-0">
          <h2 className="text-[24px] font-bold leading-tight text-primary">
            카테고리별 가게
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-secondary">
            원하는 카테고리로 빠르게 확인하세요!
          </p>
          <div className="mt-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </section>

        {/* 카테고리 칩 목록 */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-5 py-4 shrink-0">
          {orderedCategories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              isSelected={selectedCategories.includes(category)}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>

        {/* 상점 목록 개수 표시 */}
        <div className="px-5 pb-3 shrink-0">
          <span className="text-[14px] font-semibold text-secondary">
            총 {filteredStores.length}개 점포
          </span>
        </div>

        {/* 상점 목록 리스트 */}
        <div className="flex-1 px-5 pb-8 overflow-y-auto">
          <div className="flex flex-col gap-3">
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() =>
                    navigate('/store-detail', { state: { storeId: store.id } })
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center text-[#8b8b8b]">
                <img
                  src={macatSorryIcon}
                  alt="결과 없음"
                  className="h-24 w-24 mb-4 object-contain opacity-85"
                />
                <p className="text-sm font-semibold">
                  검색 조건에 맞는 가게가 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default StoreListPage
