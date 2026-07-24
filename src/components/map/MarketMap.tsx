import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ShopCard from './ShopCard'
import ZoomControls from './ZoomControls'
import MapFloatingMenu from './MapFloatingMenu'
import { StorePreviewSheet } from './StorePreviewBottomSheet'
import {
  TOTAL_MAP_HEIGHT,
  CORRIDOR,
  SECTIONS,
  CROSSWALKS,
  Y_SHIFT,
  MAP_WIDTH,
} from './mapLayoutHelper'
import { useMapPanZoom } from './hooks/useMapPanZoom'
import { useMapStoreData } from './hooks/useMapStoreData'
import { useStoreSelection } from './hooks/useStoreSelection'
import { useFocusStoreFromRoute } from './hooks/useFocusStoreFromRoute'
import { useCourseRoute } from './hooks/useCourseRoute'
import { useLockBodyScroll } from './hooks/useLockBodyScroll'

const MarketMap = () => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const {
    winSize,
    zoom,
    offset,
    minZoom,
    isMeasured,
    isTransitioning,
    setZoom,
    setOffset,
    setIsTransitioning,
    movedRef,
    handleButtonZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useMapPanZoom(containerRef)

  const { positions, bigBlocks, isLoading } = useMapStoreData()

  const {
    selectedId,
    highlightedId,
    selectedStore,
    setSelectedId,
    setHighlightedId,
    handleShopClick,
    handleContainerClick,
  } = useStoreSelection({
    positions,
    zoom,
    winSize,
    movedRef,
    setOffset,
    setIsTransitioning,
  })

  useFocusStoreFromRoute({
    positions,
    isMeasured,
    minZoom,
    winSize,
    setZoom,
    setOffset,
    setIsTransitioning,
    setHighlightedId,
  })

  const { courseStoreIds, courseTitle, isCourseVisible, toggleCourseVisible } =
    useCourseRoute({
      positions,
      isMeasured,
      minZoom,
      winSize,
      setZoom,
      setOffset,
      setIsTransitioning,
    })

  useLockBodyScroll()

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none bg-[#f5f3ef]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleContainerClick}
    >
      {/* 지도 데이터 로딩 오버레이 (컨테이너는 항상 마운트되어야 초기 중앙정렬/줌 측정이 정상 동작함) */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f5f3ef] z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#155f3a] border-t-transparent" />
            <p className="text-[13px] font-semibold text-[#155f3a] animate-pulse">
              지도 데이터를 불러오는 중입니다...
            </p>
          </div>
        </div>
      )}
      {/* 2D 캔버스 레이어 */}
      <div
        className="relative origin-top-left will-change-transform"
        style={{
          width: MAP_WIDTH,
          height: TOTAL_MAP_HEIGHT,
          // translate를 정수 px로 스냅해서 서브픽셀 안티에일리어싱으로 인한 흐림을 줄임
          transform: `translate(${Math.round(offset.x)}px, ${Math.round(offset.y)}px) scale(${zoom})`,
          transition: isTransitioning
            ? 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)'
            : 'none',
        }}
      >
        {/* 시장 바닥 배경 */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#f5f3ef]" />

          {/* 대형 외부 건물·공터 3D 렌더링 */}
          {bigBlocks.map((block) => (
            <div
              key={block.id}
              className="absolute bg-[#e4e4e4] border border-[#dcdcdc] rounded-[16px]
                shadow-[0_1px_0_#cbcbcb,0_2px_0_#bcbcbc,0_4px_6px_rgba(0,0,0,0.06)]"
              style={{
                left: block.x,
                top: block.y,
                width: block.width,
                height: block.height,
              }}
            />
          ))}
        </div>

        {/* 중앙 통로 (연한 초록색 스트립) */}
        <div
          className="absolute z-[5] pointer-events-none"
          style={{
            left: CORRIDOR.left,
            width: CORRIDOR.width,
            top: 175 - Y_SHIFT, // 첫 번째 매장 시작 윗단까지 쭉 이어지게 함
            height: TOTAL_MAP_HEIGHT - (175 - Y_SHIFT) - 50,
            background:
              'linear-gradient(180deg, #dff1de 0%, #c8e5c6 50%, #dff1de 100%)',
            borderLeft: '1.5px solid #c0dfbe',
            borderRight: '1.5px solid #c0dfbe',
          }}
        >
          {/* 중앙 점선 도로 */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l-[2px] border-dashed border-[#155f3a] opacity-35" />
        </div>

        {/* 블록 횡단 보도 */}
        {CROSSWALKS.map((road) => (
          <div
            key={road.id}
            className="absolute z-[3] pointer-events-none border-y border-[#d2ceb6] shadow-[inset_0_1px_3px_rgba(0,0,0,0.05),inset_0_-1px_3px_rgba(0,0,0,0.05)]"
            style={{
              left: -1000,
              top: road.top,
              width: 3438,
              height: road.height,
              background:
                'linear-gradient(90deg, #dfdbcf 0%, #e8e5dc 15%, #e8e5dc 85%, #dfdbcf 100%)',
            }}
          />
        ))}

        {/* 구역 라벨 (중앙 통로 정중앙) */}
        {SECTIONS.map((section) => (
          <div
            key={section.id}
            className="absolute z-20 flex justify-center pointer-events-none"
            style={{
              left: CORRIDOR.left,
              width: CORRIDOR.width,
              top: (section.top + section.bottom) / 2 - 14,
            }}
          >
            <div className="text-white text-[11px] font-black px-3.5 py-[3px] rounded-full shadow-md bg-[#155f3a]">
              {section.name}
            </div>
          </div>
        ))}

        {/* 시장 입구(북쪽) 라벨 */}
        <div
          className="absolute z-20 flex flex-col items-center text-[#6F6A62] text-[13px] font-extrabold pointer-events-none"
          style={{
            left: CORRIDOR.left + CORRIDOR.width / 2,
            top: 15,
            transform: 'translateX(-50%)',
          }}
        >
          <span>시장 입구</span>
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#155f3a] mt-1.5" />
        </div>

        {/* 시장 입구(남쪽) 라벨 */}
        <div
          className="absolute z-20 flex flex-col items-center text-[#6F6A62] text-[13px] font-extrabold pointer-events-none"
          style={{
            left: CORRIDOR.left + CORRIDOR.width / 2,
            top: TOTAL_MAP_HEIGHT - 50,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[7px] border-b-[#155f3a] mb-1.5" />
          <span>시장 입구</span>
        </div>

        {/* 상점 카드 렌더링 */}
        {positions.map((pos) => {
          const isCourseStore =
            isCourseVisible && courseStoreIds.includes(pos.store.id)
          return (
            <ShopCard
              key={pos.store.id}
              store={pos.store}
              isSelected={
                selectedId === pos.store.id ||
                highlightedId === pos.store.id ||
                isCourseStore
              }
              isCourseStore={isCourseStore}
              onClick={handleShopClick}
              style={{
                left: pos.left,
                top: pos.top,
                width: pos.width,
                height: pos.height,
              }}
            />
          )
        })}

        {/* 코스 추천 연결 경로 선 (점선 형태) */}
        {isCourseVisible && courseStoreIds.length > 1 && (
          <svg className="absolute inset-0 pointer-events-none z-20 w-full h-full">
            <polyline
              points={courseStoreIds
                .map((storeId) => {
                  const pos = positions.find((p) => p.store.id === storeId)
                  if (!pos) return ''
                  const x = pos.left + pos.width / 2
                  const y = pos.top + pos.height / 2
                  return `${x},${y}`
                })
                .filter(Boolean)
                .join(' ')}
              fill="none"
              stroke="#155f3a"
              strokeWidth="4"
              strokeDasharray="8 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          </svg>
        )}

        {/* 코스 추천 점포 핀 (크기 키움 및 카드 중앙을 가리키도록 Y 좌표 보정) */}
        {isCourseVisible &&
          courseStoreIds.map((storeId, index) => {
            const pos = positions.find((p) => p.store.id === storeId)
            if (!pos) return null
            return (
              <div
                key={`pin-${storeId}`}
                className="absolute z-30 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                style={{
                  left: pos.left + pos.width / 2,
                  top: pos.top + pos.height / 2,
                  width: 46,
                  height: 54,
                  transform: 'translate(-50%, -50px)',
                }}
              >
                <svg
                  width="46"
                  height="54"
                  viewBox="0 0 46 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 23 50 C 17 40, 3 34, 3 23 A 20 20 0 1 1 43 23 C 43 34, 29 40, 23 50 Z"
                    fill="#ef6848"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  <text
                    x="23"
                    y="23"
                    dy=".3em"
                    fill="#ffffff"
                    fontSize="15"
                    fontWeight="900"
                    textAnchor="middle"
                  >
                    {index + 1}
                  </text>
                </svg>
              </div>
            )
          })}
      </div>

      {/* 메뉴 버튼 */}
      <MapFloatingMenu
        isOpen={isMenuOpen}
        onToggle={() => setIsMenuOpen((prev) => !prev)}
      />

      {/* 줌 버튼 */}
      <ZoomControls
        zoom={zoom}
        minZoom={minZoom}
        onZoomIn={() => handleButtonZoom(0.15)}
        onZoomOut={() => handleButtonZoom(-0.15)}
        isMenuOpen={isMenuOpen}
      />

      {/* 가게 상세정보 모달 */}
      <StorePreviewSheet
        store={selectedStore}
        onClose={() => setSelectedId(null)}
        onDetail={(storeId: string) =>
          navigate('/store-detail', { state: { storeId } })
        }
      />

      {/* 코스 추천 정보 배너 */}
      {courseStoreIds.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-white px-4 py-2.5 rounded-full border border-brand/20 shadow-lg animate-fade-in">
          <div
            className={`w-2.5 h-2.5 rounded-full relative ${isCourseVisible ? 'bg-brand-coral' : 'bg-secondary/40'}`}
          >
            {isCourseVisible && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-coral opacity-75 animate-ping" />
            )}
          </div>
          <span className="text-[13px] font-bold text-primary whitespace-nowrap">
            {courseTitle || '추천 코스'}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleCourseVisible()
            }}
            className="flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer text-secondary"
            title={isCourseVisible ? '코스 숨기기' : '코스 보이기'}
            aria-label={isCourseVisible ? '코스 숨기기' : '코스 보이기'}
            aria-pressed={isCourseVisible}
          >
            {isCourseVisible ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export default MarketMap
