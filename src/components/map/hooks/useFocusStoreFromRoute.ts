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
  // location.state 객체 자체가 아니라 focusStoreId 값만 의존성으로 사용한다.
  // (다른 훅이 courseStoreIds 등 state의 다른 필드를 지우려고 늦게 navigate()를
  // 호출해도, location.state 참조만 바뀌고 focusStoreId 값은 그대로인 경우가
  // 있는데, 이때 이 값이 아니라 location.state를 의존성으로 쓰면 아래 effect가
  // 불필요하게 재실행되어 진행 중이던 카메라 이동 타이머가 취소돼버린다.)
  const focusStoreId = (location.state as { focusStoreId?: string })
    ?.focusStoreId

  useEffect(() => {
    if (!focusStoreId || positions.length === 0 || !isMeasured) return
    if (processedFocusIdRef.current === focusStoreId) return

    const pos = positions.find((p) => p.store.id === focusStoreId)
    if (!pos) return

    // 이 focusStoreId는 이미 처리한 것으로 기록해, location.state가
    // (다른 훅의 navigate 등으로) 다시 같은 값을 갖게 되어도 중복 처리되지
    // 않도록 한다.
    processedFocusIdRef.current = focusStoreId

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

      // 카메라 이동이 끝난 뒤에야 location.state를 비운다. 처리 직후 곧바로
      // navigate하면 location.state 참조가 바뀌어 이 effect가 cleanup되면서
      // 위 타이머가 실행되기도 전에 취소돼버려(오프셋이 끝내 반영되지 않음),
      // 지도가 대상 점포로 이동하지 않고 초기 위치에 확대만 되는 버그가 있었다.
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
