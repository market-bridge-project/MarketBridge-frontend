import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import { DUMMY_STORES } from '@/api/stores'
import { Store } from '@/types/store'
import ShopCard from './ShopCard'
import ZoomControls from './ZoomControls'
import marketLayoutData from '@/api/market-layout.json'

interface LayoutItem {
  id: number | string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
}

interface ComputedPosition {
  store: Store
  left: number
  top: number
  width: number
  height: number
}

// ── Y축 상단 휑한 공백 130px을 단정하게 압축하기 위한 시프트 보정치 ──
const Y_SHIFT = 130
const TOTAL_MAP_HEIGHT = 3090 // (기존 3220px - 130px) 최상단 여백 최적화 크기

// ── 8개 구역(섹션)의 피그마 실측 경계선 정의 (Y_SHIFT 반영 완료) ──
const SECTIONS = [
  { id: 1, name: '1구역', top: 200 - Y_SHIFT, bottom: 795 - Y_SHIFT },
  { id: 2, name: '2구역', top: 401 - Y_SHIFT, bottom: 795 - Y_SHIFT },
  { id: 3, name: '3구역', top: 832 - Y_SHIFT, bottom: 1126 - Y_SHIFT },
  { id: 4, name: '4구역', top: 1164 - Y_SHIFT, bottom: 1508 - Y_SHIFT },
  { id: 5, name: '5구역', top: 1546 - Y_SHIFT, bottom: 1790 - Y_SHIFT },
  { id: 6, name: '6구역', top: 1828 - Y_SHIFT, bottom: 2122 - Y_SHIFT },
  { id: 7, name: '7구역', top: 2160 - Y_SHIFT, bottom: 2736 - Y_SHIFT },
  { id: 8, name: '8구역', top: 2774 - Y_SHIFT, bottom: 3109 - Y_SHIFT },
]

// 구역 간 횡단 도로 목록 (상하 카드들과 8px 미세 간격 보장 및 Y_SHIFT 반영 완료)
const CROSSWALKS = [
  { id: 'road-1', top: 801 - Y_SHIFT, height: 19 },
  { id: 'road-2', top: 1134 - Y_SHIFT, height: 22 },
  { id: 'road-3', top: 1516 - Y_SHIFT, height: 22 },
  { id: 'road-4', top: 1798 - Y_SHIFT, height: 22 },
  { id: 'road-5', top: 2130 - Y_SHIFT, height: 22 },
  { id: 'road-6', top: 2744 - Y_SHIFT, height: 22 },
]

const CORRIDOR = { left: 645, width: 88 }

// ── market-layout.json 데이터를 우리 Store 스키마와 결합 (사이드 및 Y축 시프트 클리핑 가미) ──
function computeLayout(
  layoutItems: LayoutItem[],
  stores: Store[],
): { positions: ComputedPosition[]; bigBlocks: LayoutItem[] } {
  const positions: ComputedPosition[] = []
  const bigBlocks: LayoutItem[] = []

  layoutItems.forEach((item) => {
    // 실시간 Y축 시프트 연산 적용
    let clipY = item.y - Y_SHIFT
    let clipH = item.height

    if (item.type === 'block') {
      const MASK_LEFT = 70
      const MASK_RIGHT = 1368

      let clipX = item.x
      let clipW = item.width

      // 좌측 마스크 클리핑
      if (clipX < MASK_LEFT) {
        const overlap = MASK_LEFT - clipX
        clipX = MASK_LEFT
        clipW = Math.max(0, clipW - overlap)
      }

      // 우측 마스크 클리핑
      if (clipX + clipW > MASK_RIGHT) {
        clipW = Math.max(0, MASK_RIGHT - clipX)
      }

      // 2. 횡단 도로 위아래 8px 안전 마진 클리핑 (시프트된 Y 기준 연산)
      CROSSWALKS.forEach((road) => {
        const roadTopLimit = road.top - 8
        const roadBottomLimit = road.top + road.height + 8
        const blockBottom = clipY + clipH

        // 블록 하단이 도로 위쪽 제한선을 침범한 경우
        if (
          clipY < roadTopLimit &&
          blockBottom > roadTopLimit &&
          blockBottom < roadBottomLimit
        ) {
          clipH = roadTopLimit - clipY
        }
        // 블록 상단이 도로 아래쪽 제한선을 침범한 경우
        else if (
          clipY > roadTopLimit &&
          clipY < roadBottomLimit &&
          blockBottom > roadBottomLimit
        ) {
          const overlap = roadBottomLimit - clipY
          clipY = roadBottomLimit
          clipH = Math.max(0, clipH - overlap)
        }
        // 블록이 도로 전체를 관통하는 경우
        else if (clipY < roadTopLimit && blockBottom > roadBottomLimit) {
          clipH = roadTopLimit - clipY
        }
      })

      if (clipW > 0 && clipH > 0) {
        bigBlocks.push({
          ...item,
          x: clipX,
          y: clipY,
          width: clipW,
          height: clipH,
        })
      }
    } else if (item.type === 'empty_cell') {
      // 소형 공실 셀
      positions.push({
        store: {
          id: String(item.id),
          name: '',
          category: '',
          subCategory: '',
          hours: '',
          description: '',
          isFood: false,
          tags: [],
          info: '',
          rating: 0,
          badgeText: '',
          isDummy: true,
          span: 1,
        },
        left: item.x,
        top: clipY,
        width: item.width,
        height: clipH,
      })
    } else if (item.type === 'store') {
      // 영업 점포 또는 빈 점포
      let storeInfo = stores.find((s) => s.name === item.name)

      if (!storeInfo) {
        const isVacantStore = item.name === '빈 점포'
        storeInfo = {
          id: String(item.id),
          name: item.name,
          category: isVacantStore ? '생활·서비스' : '음식',
          subCategory: isVacantStore ? '공실' : '시장점포',
          hours: '09:00~21:00',
          description: isVacantStore
            ? '공실 상태의 빈 점포 구역입니다.'
            : '시장의 신선한 점포입니다.',
          isFood: !isVacantStore && Number(item.id) % 2 === 0,
          tags: [],
          info: '',
          rating: 4.5,
          badgeText: '',
          isVacant: isVacantStore,
        }
      }

      positions.push({
        store: storeInfo as Store,
        left: item.x,
        top: clipY,
        width: item.width,
        height: clipH,
      })
    }
  })

  return { positions, bigBlocks }
}

const MarketMap = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [winSize, setWinSize] = useState({ w: 450, h: 800 })
  const [zoom, setZoom] = useState(0.65)
  const [offset, setOffset] = useState({ x: 0, y: 20 })
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 최신 상태를 클로저 갇힘 없이 참조하기 위한 Ref 미러링
  const zoomRef = useRef(zoom)
  const offsetRef = useRef(offset)
  zoomRef.current = zoom
  offsetRef.current = offset

  // 최소 줌은 winSize.w에 연동
  const minZoom = useMemo(() => {
    return Math.max(0.65, (winSize.w * 0.95) / 1438)
  }, [winSize.w])

  // 실제 컨테이너 clientWidth 실측 및 초기 줌/정중앙 오프셋 수립
  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth || 450
      const h = containerRef.current.clientHeight || 800
      setWinSize({ w, h })
      setZoom((z) => Math.max(z, Math.max(0.65, (w * 0.95) / 1438)))
    }

    const initW = containerRef.current.clientWidth || 450
    const initH = containerRef.current.clientHeight || 800
    const initMinZoom = Math.max(0.65, (initW * 0.95) / 1438)
    const initX = (initW - 1438 * initMinZoom) / 2

    setWinSize({ w: initW, h: initH })
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

      const nextZoom = Math.max(minZoom, Math.min(2.5, currentZoom + factor))
      if (nextZoom === currentZoom) return

      // 줌인/줌아웃 직전 마우스 위치의 지도 공간상 물리 좌표
      const mapX = (mouseX - currentOffset.x) / currentZoom
      const mapY = (mouseY - currentOffset.y) / currentZoom

      // 새로운 줌 배율 하에 마우스가 동일 픽셀 상에 머물도록 오프셋 변위 역유도
      let nextX = mouseX - mapX * nextZoom
      let nextY = mouseY - mapY * nextZoom

      // 2D 맵 구속 제한(클램프) 실시간 반영
      const mapW = 1438 * nextZoom
      const mapH = TOTAL_MAP_HEIGHT * nextZoom

      let minX = winSize.w - mapW
      let maxX = 0
      if (mapW < winSize.w) {
        minX = (winSize.w - mapW) / 2
        maxX = (winSize.w - mapW) / 2
      } else {
        minX -= 0
        maxX += 0
      }
      nextX = Math.max(minX, Math.min(maxX, nextX))

      let minY = winSize.h - mapH
      let maxY = 0
      if (mapH < winSize.h) {
        minY = (winSize.h - mapH) / 2
        maxY = (winSize.h - mapH) / 2
      } else {
        minY -= 180 * nextZoom
        maxY += 35 * nextZoom
      }
      nextY = Math.max(minY, Math.min(maxY, nextY))

      // 일괄 최신 상태 갱신
      setZoom(nextZoom)
      setOffset({ x: nextX, y: nextY })
    }

    // passive: false 옵션을 반드시 주어야 e.preventDefault()가 브라우저에서 차단 처리됩니다.
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

      const nextZoom = Math.max(minZoom, Math.min(2.5, currentZoom + factor))
      if (nextZoom === currentZoom) return

      // 줌인/줌아웃 직전 화면 정중앙의 지도 공간상 물리 좌표
      const mapX = (centerX - currentOffset.x) / currentZoom
      const mapY = (centerY - currentOffset.y) / currentZoom

      // 새로운 줌 배율 하에 화면 정중앙이 고정되도록 오프셋 역유도
      let nextX = centerX - mapX * nextZoom
      let nextY = centerY - mapY * nextZoom

      // 2D 맵 경계 구속 제한(클램프) 반영
      const mapW = 1438 * nextZoom
      const mapH = TOTAL_MAP_HEIGHT * nextZoom

      let minX = winSize.w - mapW
      let maxX = 0
      if (mapW < winSize.w) {
        minX = (winSize.w - mapW) / 2
        maxX = (winSize.w - mapW) / 2
      } else {
        minX -= 0
        maxX += 0
      }
      nextX = Math.max(minX, Math.min(maxX, nextX))

      let minY = winSize.h - mapH
      let maxY = 0
      if (mapH < winSize.h) {
        minY = (winSize.h - mapH) / 2
        maxY = (winSize.h - mapH) / 2
      } else {
        minY -= 180 * nextZoom
        maxY += 35 * nextZoom
      }
      nextY = Math.max(minY, Math.min(maxY, nextY))

      setZoom(nextZoom)
      setOffset({ x: nextX, y: nextY })
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

  const onDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
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

  const onMove = useCallback(
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

        const mapW = 1438 * zoom
        const mapH = TOTAL_MAP_HEIGHT * zoom

        let minX = winSize.w - mapW
        let maxX = 0

        if (mapW < winSize.w) {
          minX = (winSize.w - mapW) / 2
          maxX = (winSize.w - mapW) / 2
        } else {
          minX -= 0
          maxX += 0
        }

        let minY = winSize.h - mapH
        let maxY = 0

        if (mapH < winSize.h) {
          minY = (winSize.h - mapH) / 2
          maxY = (winSize.h - mapH) / 2
        } else {
          minY -= 180 * zoom
          maxY += 35 * zoom
        }

        setOffset((p) => {
          const nextX = p.x + dx
          const nextY = p.y + dy
          return {
            x: Math.max(minX, Math.min(maxX, nextX)),
            y: Math.max(minY, Math.min(maxY, nextY)),
          }
        })
        last.current = { x: e.clientX, y: e.clientY }
      } else if (ptrs.current.size === 2) {
        const [a, b] = Array.from(ptrs.current.values())
        if (dist0.current > 0) {
          setZoom(
            Math.max(
              minZoom,
              Math.min(2.5, zoom0.current * (eucl(a, b) / dist0.current)),
            ),
          )
        }
      }
    },
    [zoom, winSize, minZoom],
  )

  const onUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    ptrs.current.delete(e.pointerId)
    if (ptrs.current.size === 0) {
      isDown.current = false
    } else if (ptrs.current.size === 1) {
      const r = Array.from(ptrs.current.values())[0]
      last.current = { x: r.clientX, y: r.clientY }
    }
  }, [])

  const handleShopClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (moved.current <= 6) {
      setSelectedId((prev) => (prev === id ? null : id))
    }
  }, [])

  const handleContainerClick = useCallback(() => {
    if (moved.current <= 6) {
      setSelectedId(null)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none bg-[#f5f3ef]"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClick={handleContainerClick}
    >
      {/* 2D 캔버스 레이어 — 깔끔한 2D 플랫 뷰 적용 */}
      <div
        className="relative origin-top-left will-change-transform"
        style={{
          width: 1438,
          height: TOTAL_MAP_HEIGHT,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        }}
      >
        {/* ══ 시장 바닥 배경 (크림색 벌판 단일화) ══ */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#f5f3ef]" />

          {/* ══ 대형 외부 건물·공터 3D 렌더링 (경계 밀착 클리핑 렌더) ══ */}
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

        {/* ══ 중앙 통로 (연한 초록색 스트립 - Y_SHIFT 오프셋 매칭) ══ */}
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

        {/* ══ 블록 횡단 보도 (빈 횡단 간격 - 좌우 경계 밖까지 연장하여 끊김 제거) ══ */}
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

        {/* ══ 구역 라벨 (중앙 통로 정중앙) ══ */}
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

        {/* ══ 시장 입구(북쪽) 라벨 ══ */}
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

        {/* ══ 시장 입구(남쪽) 라벨 ══ */}
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

        {/* ══ 103개 점포 및 회색 빈 블록 3D 카드 렌더링 ══ */}
        {positions.map((pos) => (
          <ShopCard
            key={pos.store.id}
            store={pos.store}
            isSelected={selectedId === pos.store.id}
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

      {/* 줌 컨트롤 */}
      <ZoomControls
        zoom={zoom}
        minZoom={minZoom}
        onZoomIn={() => handleButtonZoom(0.15)}
        onZoomOut={() => handleButtonZoom(-0.15)}
      />
    </div>
  )
}

export default MarketMap
