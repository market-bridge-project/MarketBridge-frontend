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
  // state 참조만 바뀌고 focusStoreId 값은 그대로인 경우의 불필요한 재실행을 막기 위해 값만 의존성으로 사용
  const focusStoreId = (location.state as { focusStoreId?: string })
    ?.focusStoreId

  useEffect(() => {
    if (!focusStoreId || positions.length === 0 || !isMeasured) return
    if (processedFocusIdRef.current === focusStoreId) return

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
      // 타이머가 실제로 실행됐을 때만 처리 완료로 기록 (조기 취소 시 재시도 가능하도록)
      processedFocusIdRef.current = focusStoreId

      setZoom(targetZoom)
      setOffset(clampOffset({ x: targetX, y: targetY }, targetZoom, winSize))
      setHighlightedId(focusStoreId)
      setIsTransitioning(false)

      // 카메라 이동 완료 후에 state를 비운다 (먼저 비우면 재실행으로 타이머가 취소됨)
      navigate(location.pathname, { replace: true, state: {} })
    }, 50)

    return () => clearTimeout(timer)
  }, [
    focusStoreId,
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
