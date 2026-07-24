import { useState, useMemo, useCallback } from 'react'
import { clampOffset, type ComputedPosition } from '../mapLayoutHelper'

interface UseStoreSelectionParams {
  positions: ComputedPosition[]
  zoom: number
  winSize: { w: number; h: number }
  movedRef: React.MutableRefObject<number>
  setOffset: (offset: { x: number; y: number }) => void
  setIsTransitioning: (value: boolean) => void
}

export function useStoreSelection({
  positions,
  zoom,
  winSize,
  movedRef,
  setOffset,
  setIsTransitioning,
}: UseStoreSelectionParams) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const selectedStore = useMemo(() => {
    if (!selectedId) return null
    const s = positions.find((pos) => pos.store.id === selectedId)?.store
    if (!s || s.isDummy || s.isVacant) return null
    return s
  }, [selectedId, positions])

  const handleShopClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      if (movedRef.current <= 6) {
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
    [positions, zoom, winSize, movedRef, setOffset, setIsTransitioning],
  )

  const handleContainerClick = useCallback(() => {
    if (movedRef.current <= 6) {
      setSelectedId(null)
      setHighlightedId(null)
    }
  }, [movedRef])

  return {
    selectedId,
    highlightedId,
    selectedStore,
    setSelectedId,
    setHighlightedId,
    handleShopClick,
    handleContainerClick,
  }
}
