import { Store } from '@/types/store'

export interface LayoutItem {
  id: number | string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
}

export interface ComputedPosition {
  store: Store
  left: number
  top: number
  width: number
  height: number
}

export const Y_SHIFT = 130
export const TOTAL_MAP_HEIGHT = 3090

export const SECTIONS = [
  { id: 1, name: '◂ 1구역', top: 200 - Y_SHIFT, bottom: 795 - Y_SHIFT },
  { id: 2, name: '2구역 ▸', top: 401 - Y_SHIFT, bottom: 795 - Y_SHIFT },
  { id: 3, name: '3구역', top: 832 - Y_SHIFT, bottom: 1126 - Y_SHIFT },
  { id: 4, name: '4구역', top: 1164 - Y_SHIFT, bottom: 1508 - Y_SHIFT },
  { id: 5, name: '5구역', top: 1546 - Y_SHIFT, bottom: 1790 - Y_SHIFT },
  { id: 6, name: '6구역', top: 1828 - Y_SHIFT, bottom: 2122 - Y_SHIFT },
  { id: 7, name: '7구역', top: 2160 - Y_SHIFT, bottom: 2470 - Y_SHIFT },
  { id: 8, name: '8구역', top: 2480 - Y_SHIFT, bottom: 2740 - Y_SHIFT },
  { id: 9, name: '9구역', top: 2760 - Y_SHIFT, bottom: 3109 - Y_SHIFT },
]

export const CROSSWALKS = [
  { id: 'road-1', top: 801 - Y_SHIFT, height: 19 },
  { id: 'road-2', top: 1134 - Y_SHIFT, height: 22 },
  { id: 'road-3', top: 1516 - Y_SHIFT, height: 22 },
  { id: 'road-4', top: 1798 - Y_SHIFT, height: 22 },
  { id: 'road-5', top: 2130 - Y_SHIFT, height: 22 },
  { id: 'road-6', top: 2744 - Y_SHIFT, height: 22 },
]

export const CORRIDOR = { left: 645, width: 88 }

export function computeLayout(
  layoutItems: LayoutItem[],
  stores: Store[],
): { positions: ComputedPosition[]; bigBlocks: LayoutItem[] } {
  const positions: ComputedPosition[] = []
  const bigBlocks: LayoutItem[] = []

  layoutItems.forEach((item) => {
    let clipY = item.y - Y_SHIFT
    let clipH = item.height

    if (item.type === 'block') {
      const MASK_LEFT = 70
      const MASK_RIGHT = 1368

      let clipX = item.x
      let clipW = item.width

      if (clipX < MASK_LEFT) {
        const overlap = MASK_LEFT - clipX
        clipX = MASK_LEFT
        clipW = Math.max(0, clipW - overlap)
      }

      if (clipX + clipW > MASK_RIGHT) {
        clipW = Math.max(0, MASK_RIGHT - clipX)
      }

      CROSSWALKS.forEach((road) => {
        const roadTopLimit = road.top - 8
        const roadBottomLimit = road.top + road.height + 8
        const blockBottom = clipY + clipH

        if (
          clipY < roadTopLimit &&
          blockBottom > roadTopLimit &&
          blockBottom < roadBottomLimit
        ) {
          clipH = roadTopLimit - clipY
        } else if (
          clipY > roadTopLimit &&
          clipY < roadBottomLimit &&
          blockBottom > roadBottomLimit
        ) {
          const overlap = roadBottomLimit - clipY
          clipY = roadBottomLimit
          clipH = Math.max(0, clipH - overlap)
        } else if (clipY < roadTopLimit && blockBottom > roadBottomLimit) {
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
      let storeInfo = stores.find((s) => s.id === String(item.id))

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

export const MAX_ZOOM = 2.5
export const MAP_WIDTH = 1438

export function clampOffset(
  offset: { x: number; y: number },
  zoom: number,
  winSize: { w: number; h: number },
): { x: number; y: number } {
  const mapW = MAP_WIDTH * zoom
  const mapH = TOTAL_MAP_HEIGHT * zoom

  let minX = winSize.w - mapW
  let maxX = 0
  if (mapW < winSize.w) {
    minX = (winSize.w - mapW) / 2
    maxX = (winSize.w - mapW) / 2
  }
  const nextX = Math.max(minX, Math.min(maxX, offset.x))

  let minY = winSize.h - mapH
  let maxY = 0
  if (mapH < winSize.h) {
    minY = (winSize.h - mapH) / 2
    maxY = (winSize.h - mapH) / 2
  } else {
    minY -= 180 * zoom
    maxY += 35 * zoom
  }
  const nextY = Math.max(minY, Math.min(maxY, offset.y))

  return { x: nextX, y: nextY }
}

export function calculateZoomOffset(
  nextZoom: number,
  pivotX: number,
  pivotY: number,
  currentZoom: number,
  currentOffset: { x: number; y: number },
  winSize: { w: number; h: number },
): { x: number; y: number } {
  const mapX = (pivotX - currentOffset.x) / currentZoom
  const mapY = (pivotY - currentOffset.y) / currentZoom

  const nextX = pivotX - mapX * nextZoom
  const nextY = pivotY - mapY * nextZoom

  return clampOffset({ x: nextX, y: nextY }, nextZoom, winSize)
}
