import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clampOffset, type ComputedPosition } from '../mapLayoutHelper'

interface UseFocusStoreFromRouteParams {
  positions: ComputedPosition[]
  isMeasured: boolean
  minZoom: number
  winSize: { w: number; h: number }
  setZoom: (zoom: number) => void
  setOffset: (offset: { x: number; y: number }) => void
  setIsTransitioning: (value: boolean) => void
  setHighlightedId: (id: string | null) => void
}

// 상세보기 페이지에서 넘어온 포커스 요청(focusStoreId)을 지도 화면 정중앙에 정렬하고 강조
export function useFocusStoreFromRoute({
  positions,
  isMeasured,
  minZoom,
  winSize,
  setZoom,
  setOffset,
  setIsTransitioning,
  setHighlightedId,
}: UseFocusStoreFromRouteParams) {
  const navigate = useNavigate()
  const location = useLocation()
  const processedFocusIdRef = useRef<string | null>(null)

  useEffect(() => {
    const focusStoreId = (location.state as { focusStoreId?: string })
      ?.focusStoreId
    if (!focusStoreId || positions.length === 0 || !isMeasured) return
    if (processedFocusIdRef.current === focusStoreId) return

    const pos = positions.find((p) => p.store.id === focusStoreId)
    if (!pos) return

    // 이 focusStoreId는 이미 처리한 것으로 기록해, location.state가
    // (다른 훅의 navigate 등으로) 다시 같은 값을 갖게 되어도 중복 처리되지
    // 않도록 한다.
    processedFocusIdRef.current = focusStoreId

    // 포커스 요청을 처리하는 즉시 location.state에서 제거해, 카메라 이동이
    // 끝나기 전에 effect가 재실행되어도(예: 코스 표시 토글) 이 로직이
    // 중복 실행되지 않도록 한다.
    navigate(location.pathname, { replace: true, state: {} })

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
      setIsTransitioning(false)
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
    setZoom,
    setOffset,
    setIsTransitioning,
    setHighlightedId,
  ])
}
