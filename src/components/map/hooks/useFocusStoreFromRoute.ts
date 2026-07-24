import { useEffect } from 'react'
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
    setZoom,
    setOffset,
    setIsTransitioning,
    setHighlightedId,
  ])
}
