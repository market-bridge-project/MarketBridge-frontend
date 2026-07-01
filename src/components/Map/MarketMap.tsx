import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DUMMY_STORES } from '@/api/stores'
import ShopCard from './ShopCard'
import ZoomControls from './ZoomControls'
import MapFloatingMenu from './MapFloatingMenu'
import { StorePreviewSheet } from '@/components/common/StorePreviewBottomSheet'
import marketLayoutData from '@/api/market-layout.json'
import {
  computeLayout,
  TOTAL_MAP_HEIGHT,
  CORRIDOR,
  SECTIONS,
  CROSSWALKS,
  LayoutItem,
  Y_SHIFT,
  calculateZoomOffset,
  MAX_ZOOM,
  MAP_WIDTH,
  clampOffset,
} from './mapLayoutHelper'

const MarketMap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [winSize, setWinSize] = useState({ w: 450, h: 800 })
  const [zoom, setZoom] = useState(0.65)
  const [offset, setOffset] = useState({ x: 0, y: 20 })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMeasured, setIsMeasured] = useState(false)

  // 최신 상태를 클로저 갇힘 없이 참조하기 위한 Ref 미러링
  const zoomRef = useRef(zoom)
  const offsetRef = useRef(offset)
  zoomRef.current = zoom
  offsetRef.current = offset

  // 최소 줌은 winSize.w에 연동
  const minZoom = useMemo(() => {
    return Math.max(0.65, (winSize.w * 0.95) / MAP_WIDTH)
  }, [winSize.w])

  // 실제 컨테이너 clientWidth 실측 및 초기 줌/정중앙 오프셋 수립
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 450
      const h = containerRef.current.clientHeight || 800
      setWinSize({ w, h })
      setIsMeasured(true)
      setZoom((z) => Math.max(z, Math.max(0.65, (w * 0.95) / MAP_WIDTH)))
    }

    const initW = containerRef.current.clientWidth || 450
    const initH = containerRef.current.clientHeight || 800
    const initMinZoom = Math.max(0.65, (initW * 0.95) / MAP_WIDTH)
    const initX = (initW - MAP_WIDTH * initMinZoom) / 2

    setWinSize({ w: initW, h: initH })
    setIsMeasured(true)
    setZoom(initMinZoom)
    setOffset({ x: initX, y: 20 })

    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    setZoom((z) => Math.max(z, minZoom))
  }, [minZoom])

  // 모바일 브라우저 전체 시스템 핀치 줌 및 노트북 마우스 휠/트랙패드 줌 탈취 제어
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleGesture = (e: Event) => {
      e.preventDefault()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault() // 두 손가락 시스템 줌 동작 강제 중단
      }
    }

    // 마우스 휠 및 노트북 트랙패드 핀치 줌 연동 리스너 (마우스 커서 중심 줌 피벗 적용)
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault() // 브라우저 전체 화면 스크롤/줌 차단

      const rect = container.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const zoomFactor = 0.08
      let factor = e.deltaY < 0 ? 1 : -1

      if (e.ctrlKey) {
        factor = -e.deltaY * 0.02
      } else {
        factor = factor * zoomFactor
      }

      // 항상 클로저에서 자유로운 최신의 줌 및 오프셋 실시간 참조
      const currentZoom = zoomRef.current
      const currentOffset = offsetRef.current

      const nextZoom = Math.max(
        minZoom,
        Math.min(MAX_ZOOM, currentZoom + factor),
      )
      if (nextZoom === currentZoom) return

      const nextOffset = calculateZoomOffset(
        nextZoom,
        mouseX,
        mouseY,
        currentZoom,
        currentOffset,
        winSize,
      )

      setZoom(nextZoom)
      setOffset(nextOffset)
    }

    // passive: false 옵션을 반드시 주어야 e.preventDefault()가 브라우저에서 차단
    container.addEventListener('gesturestart', handleGesture, {
      passive: false,
    })
    container.addEventListener('gesturechange', handleGesture, {
      passive: false,
    })
    container.addEventListener('touchmove', handleTouchMove, { passive: false })
    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('gesturestart', handleGesture)
      container.removeEventListener('gesturechange', handleGesture)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('wheel', handleWheel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minZoom])

  // 줌 +- 버튼 클릭용 화면 정중앙(Viewport Center) 피벗 줌 핸들러
  const handleButtonZoom = useCallback(
    (factor: number) => {
      const centerX = winSize.w / 2
      const centerY = winSize.h / 2

      const currentZoom = zoomRef.current
      const currentOffset = offsetRef.current

      const nextZoom = Math.max(
        minZoom,
        Math.min(MAX_ZOOM, currentZoom + factor),
      )
      if (nextZoom === currentZoom) return

      const nextOffset = calculateZoomOffset(
        nextZoom,
        centerX,
        centerY,
        currentZoom,
        currentOffset,
        winSize,
      )

      setZoom(nextZoom)
      setOffset(nextOffset)
    },
    [winSize, minZoom],
  )

  const ptrs = useRef<Map<number, { clientX: number; clientY: number }>>(
    new Map(),
  )
  const last = useRef({ x: 0, y: 0 })
  const dist0 = useRef(0)
  const zoom0 = useRef(1)
  const moved = useRef(0)
  const isDown = useRef(false)

  const { positions, bigBlocks } = useMemo(
    () => computeLayout(marketLayoutData as LayoutItem[], DUMMY_STORES),
    [],
  )

  const selectedStore = useMemo(() => {
    if (!selectedId) return null
    const s = positions.find((pos) => pos.store.id === selectedId)?.store
    if (!s || s.isDummy || s.isVacant) return null
    return s
  }, [selectedId, positions])

  // 상세보기 페이지에서 넘어온 포커스 요청(focusStoreId)을 지도 화면 정중앙에 정렬하고 강조
  useEffect(() => {
    const focusStoreId = (location.state as { focusStoreId?: string })
      ?.focusStoreId
    if (!focusStoreId || positions.length === 0 || !isMeasured) return

    const pos = positions.find((p) => p.store.id === focusStoreId)
    if (!pos) return

    const targetZoom = Math.max(1.5, minZoom)
    setZoom(targetZoom)

    const shopCenterX = pos.left + pos.width / 2
    const shopCenterY = pos.top + pos.height / 2

    const targetX = winSize.w / 2 - shopCenterX * targetZoom
    const targetY = winSize.h / 2 - shopCenterY * targetZoom

    // 트랜지션 스타일을 먼저 활성화한 후, 50ms 뒤에 줌과 오프셋을 적용하여 애니메이션 효과 보장
    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setZoom(targetZoom)
      setOffset(clampOffset({ x: targetX, y: targetY }, targetZoom, winSize))
      setHighlightedId(focusStoreId)
      navigate(location.pathname, { replace: true, state: {} })
    }, 50)

    return () => clearTimeout(timer)
  }, [
    location.state,
    positions,
    winSize,
    minZoom,
    navigate,
    location.pathname,
    isMeasured,
  ])

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalPosition = document.body.style.position
    const originalWidth = document.body.style.width
    const originalHeight = document.body.style.height

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.height = '100%'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.position = originalPosition
      document.body.style.width = originalWidth
      document.body.style.height = originalHeight
    }
  }, [])

  const eucl = (
    a: { clientX: number; clientY: number },
    b: { clientX: number; clientY: number },
  ) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsTransitioning(false)
      ptrs.current.set(e.pointerId, {
        clientX: e.clientX,
        clientY: e.clientY,
      })
      isDown.current = true
      moved.current = 0
      if (ptrs.current.size === 1) {
        last.current = { x: e.clientX, y: e.clientY }
      } else if (ptrs.current.size === 2) {
        const [a, b] = Array.from(ptrs.current.values())
        dist0.current = eucl(a, b)
        zoom0.current = zoom
      }
    },
    [zoom],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDown.current) return
      ptrs.current.set(e.pointerId, {
        clientX: e.clientX,
        clientY: e.clientY,
      })
      if (ptrs.current.size === 1) {
        const dx = e.clientX - last.current.x
        const dy = e.clientY - last.current.y
        moved.current += Math.hypot(dx, dy)

        setOffset((p) => {
          const nextX = p.x + dx
          const nextY = p.y + dy
          return clampOffset({ x: nextX, y: nextY }, zoom, winSize)
        })
        last.current = { x: e.clientX, y: e.clientY }
      } else if (ptrs.current.size === 2) {
        const [a, b] = Array.from(ptrs.current.values())
        if (dist0.current > 0 && containerRef.current) {
          const nextZoom = Math.max(
            minZoom,
            Math.min(MAX_ZOOM, zoom0.current * (eucl(a, b) / dist0.current)),
          )

          if (nextZoom !== zoomRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            const pivotX = (a.clientX + b.clientX) / 2 - rect.left
            const pivotY = (a.clientY + b.clientY) / 2 - rect.top

            const nextOffset = calculateZoomOffset(
              nextZoom,
              pivotX,
              pivotY,
              zoomRef.current,
              offsetRef.current,
              winSize,
            )

            setZoom(nextZoom)
            setOffset(nextOffset)
          }
        }
      }
    },
    [zoom, winSize, minZoom],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      ptrs.current.delete(e.pointerId)
      if (ptrs.current.size === 0) {
        isDown.current = false
      } else if (ptrs.current.size === 1) {
        const r = Array.from(ptrs.current.values())[0]
        last.current = { x: r.clientX, y: r.clientY }
      }
    },
    [],
  )

  const handleShopClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      if (moved.current <= 6) {
        setSelectedId((prev) => (prev === id ? null : id))
        setHighlightedId(null)

        const pos = positions.find((p) => p.store.id === id)
        if (pos) {
          const targetX = pos.left + pos.width / 2
          const targetY = pos.top + pos.height / 2

          const viewX = winSize.w / 2
          const viewY = winSize.h / 2 - 100

          const nextX = viewX - targetX * zoom
          const nextY = viewY - targetY * zoom

          setIsTransitioning(true)
          setOffset(clampOffset({ x: nextX, y: nextY }, zoom, winSize))
        }
      }
    },
    [positions, zoom, winSize],
  )

  const handleContainerClick = useCallback(() => {
    if (moved.current <= 6) {
      setSelectedId(null)
      setHighlightedId(null)
    }
  }, [])

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
      {/* 2D 캔버스 레이어 */}
      <div
        className="relative origin-top-left will-change-transform"
        style={{
          width: MAP_WIDTH,
          height: TOTAL_MAP_HEIGHT,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
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
        {positions.map((pos) => (
          <ShopCard
            key={pos.store.id}
            store={pos.store}
            isSelected={
              selectedId === pos.store.id || highlightedId === pos.store.id
            }
            onClick={handleShopClick}
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
          />
        ))}
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
        onDetail={(storeId) =>
          navigate('/store-detail', { state: { storeId } })
        }
      />
    </div>
  )
}

export default MarketMap
