import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import {
  MAX_ZOOM,
  MAP_WIDTH,
  calculateZoomOffset,
  clampOffset,
} from '../mapLayoutHelper'

const eucl = (
  a: { clientX: number; clientY: number },
  b: { clientX: number; clientY: number },
) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)

export function useMapPanZoom(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [winSize, setWinSize] = useState({ w: 450, h: 800 })
  const [zoom, setZoom] = useState(0.65)
  const [offset, setOffset] = useState({ x: 0, y: 20 })
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
  }, [containerRef])

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
    [zoom, winSize, minZoom, containerRef],
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

  return {
    winSize,
    zoom,
    offset,
    minZoom,
    isMeasured,
    isTransitioning,
    setZoom,
    setOffset,
    setIsTransitioning,
    movedRef: moved,
    handleButtonZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
