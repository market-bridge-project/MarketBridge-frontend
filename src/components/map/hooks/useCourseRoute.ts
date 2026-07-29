import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clampOffset, type ComputedPosition } from '../mapLayoutHelper'

const COURSE_STORE_IDS_STORAGE_KEY = 'courseStoreIds'
const COURSE_TITLE_STORAGE_KEY = 'courseTitle'
const IS_COURSE_VISIBLE_STORAGE_KEY = 'isCourseVisible'

const readLocalStorage = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const readCourseStoreIds = (): string[] => {
  try {
    const saved = readLocalStorage(COURSE_STORE_IDS_STORAGE_KEY)
    const parsed: unknown = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) &&
      parsed.every((id): id is string => typeof id === 'string')
      ? parsed
      : []
  } catch {
    return []
  }
}

interface UseCourseRouteParams {
  positions: ComputedPosition[]
  isMeasured: boolean
  minZoom: number
  winSize: { w: number; h: number }
  setZoom: (zoom: number) => void
  setOffset: (offset: { x: number; y: number }) => void
  setIsTransitioning: (value: boolean) => void
}

export function useCourseRoute({
  positions,
  isMeasured,
  minZoom,
  winSize,
  setZoom,
  setOffset,
  setIsTransitioning,
}: UseCourseRouteParams) {
  const navigate = useNavigate()
  const location = useLocation()
  const processedCourseIdsRef = useRef<string[] | null>(null)

  const [courseStoreIds, setCourseStoreIds] =
    useState<string[]>(readCourseStoreIds)
  const [courseTitle, setCourseTitle] = useState<string | null>(() => {
    return readLocalStorage(COURSE_TITLE_STORAGE_KEY)
  })
  const [hasCenteredCourse, setHasCenteredCourse] = useState(false)
  const [isCourseVisible, setIsCourseVisible] = useState(() => {
    return readLocalStorage(IS_COURSE_VISIBLE_STORAGE_KEY) !== 'false'
  })

  // 코스 추천 결과 처리 및 카메라 포커싱 (localStorage 연동)
  useEffect(() => {
    const stateCourseIds = (location.state as { courseStoreIds?: string[] })
      ?.courseStoreIds
    const stateCourseTitle = (location.state as { courseTitle?: string })
      ?.courseTitle

    let activeCourseIds = courseStoreIds

    // 같은 stateCourseIds 배열을 (다른 훅의 navigate로 인해 location.state가
    // 되살아나는 등) 이미 처리했다면 다시 처리하지 않는다.
    const isNewCourseState = Boolean(
      stateCourseIds &&
        stateCourseIds.length > 0 &&
        processedCourseIdsRef.current !== stateCourseIds,
    )

    // 1. 라우터 상태에 새 코스가 전달된 경우 localStorage 덮어쓰기
    if (isNewCourseState && stateCourseIds) {
      processedCourseIdsRef.current = stateCourseIds
      activeCourseIds = stateCourseIds
      setCourseStoreIds(stateCourseIds)
      setCourseTitle(stateCourseTitle || '추천 코스')
      setIsCourseVisible(true)
      try {
        localStorage.setItem(
          COURSE_STORE_IDS_STORAGE_KEY,
          JSON.stringify(stateCourseIds),
        )
        localStorage.setItem(
          COURSE_TITLE_STORAGE_KEY,
          stateCourseTitle || '추천 코스',
        )
        localStorage.setItem(IS_COURSE_VISIBLE_STORAGE_KEY, 'true')
      } catch {
        // Silently catch write quota or blocked errors
      }
      setHasCenteredCourse(false) // 새로운 코스가 확정되었으므로 다시 포커싱되게 리셋
    }

    // 개별 점포 포커스 요청(focusStoreId)이 함께 들어온 경우, 카메라는
    // useFocusStoreFromRoute가 담당하므로 코스 재포커싱을 양보합니다.
    // (재마운트 시 hasCenteredCourse가 초기화되며 두 포커싱이 경합하는 것을 방지)
    const stateFocusStoreId = (location.state as { focusStoreId?: string })
      ?.focusStoreId
    const hasFocusRequest = Boolean(stateFocusStoreId)

    // 코스 정보를 이미 state/localStorage에 반영했으므로, 카메라 센터링이
    // 끝나기 전에 effect가 재실행되더라도(예: 토글 클릭) 위 블록이 중복
    // 실행되지 않도록 location.state를 즉시 정리한다.
    if (isNewCourseState) {
      navigate(location.pathname, {
        replace: true,
        state: hasFocusRequest ? { focusStoreId: stateFocusStoreId } : {},
      })
    }

    if (hasFocusRequest) {
      if (!hasCenteredCourse) setHasCenteredCourse(true)
      return
    }

    // 포커싱 조건 만족 검사
    if (
      activeCourseIds.length === 0 ||
      positions.length === 0 ||
      !isMeasured ||
      !isCourseVisible ||
      hasCenteredCourse
    ) {
      return
    }

    // 코스 점포들의 위치 찾기
    const coursePositions = positions.filter((p) =>
      activeCourseIds.includes(p.store.id),
    )
    if (coursePositions.length === 0) return

    // 바운딩 박스 계산
    const lefts = coursePositions.map((p) => p.left)
    const rights = coursePositions.map((p) => p.left + p.width)
    const tops = coursePositions.map((p) => p.top)
    const bottoms = coursePositions.map((p) => p.top + p.height)

    const minX = Math.min(...lefts)
    const maxX = Math.max(...rights)
    const minY = Math.min(...tops)
    const maxY = Math.max(...bottoms)

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    const boxW = Math.max(100, maxX - minX)
    const boxH = Math.max(100, maxY - minY)

    const targetZoom = Math.min(
      1.5,
      Math.max(
        minZoom,
        Math.min((winSize.w * 0.7) / boxW, (winSize.h * 0.7) / boxH),
      ),
    )

    const targetX = winSize.w / 2 - centerX * targetZoom
    const targetY = winSize.h / 2 - centerY * targetZoom

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setZoom(targetZoom)
      setOffset(clampOffset({ x: targetX, y: targetY }, targetZoom, winSize))
      setHasCenteredCourse(true)
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
    hasCenteredCourse,
    isCourseVisible,
    courseStoreIds,
    setZoom,
    setOffset,
    setIsTransitioning,
  ])

  const toggleCourseVisible = useCallback(() => {
    setIsCourseVisible((prev) => {
      const next = !prev
      try {
        localStorage.setItem(IS_COURSE_VISIBLE_STORAGE_KEY, String(next))
      } catch {
        // Silently catch write errors
      }
      return next
    })
  }, [])

  return {
    courseStoreIds,
    courseTitle,
    isCourseVisible,
    toggleCourseVisible,
  }
}
