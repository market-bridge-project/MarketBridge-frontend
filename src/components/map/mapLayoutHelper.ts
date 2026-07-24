import { Store, StoreResponse } from '@/types/store'
import marketLayoutData from '@/api/market-layout-fin.json'

export interface LayoutItem {
  id: number | string
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  storeNo?: number | null
  isVacant?: boolean
  imageUrl?: string | null
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

const curatedStoreNames = new Map<number, string>(
  (marketLayoutData as LayoutItem[])
    .filter(
      (item): item is LayoutItem & { storeNo: number } =>
        item.type === 'store' && typeof item.storeNo === 'number',
    )
    .map((item) => [item.storeNo, item.name]),
)

export function getCuratedStoreName(storeNo: number): string | undefined {
  return curatedStoreNames.get(storeNo)
}

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
          hours: '',
          isFood: false,
          isDummy: true,
        },
        left: item.x,
        top: clipY,
        width: item.width,
        height: clipH,
      })
    } else if (item.type === 'store') {
      let storeInfo = stores.find((s) => s.id === String(item.id))

      if (!storeInfo) {
        const isVacantStore = item.name === '빈 점포' || item.isVacant
        storeInfo = {
          id: String(item.id),
          name: item.name,
          category: isVacantStore ? '생활·서비스' : '음식',
          hours: '09:00~21:00',
          isFood: !isVacantStore && Number(item.id) % 2 === 0,
          isVacant: isVacantStore,
          storeNo: item.storeNo,
          imageUrl: item.imageUrl ?? undefined,
        }
      } else {
        const isVacantStore = item.name === '빈 점포' || item.isVacant
        storeInfo = {
          ...storeInfo,
          name: item.name,
          storeNo: item.storeNo,
          isVacant: isVacantStore,
          imageUrl: item.imageUrl ?? storeInfo.imageUrl,
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

const FOOD_CATEGORIES = [
  '음식점',
  '음식',
  '떡·빵·간식',
  '반찬·식재료',
  '농산물',
  '수산·정육',
]

function toStore(apiStore: StoreResponse): Store {
  return {
    id: String(apiStore.id),
    name: apiStore.name,
    category: apiStore.category,
    hours: apiStore.openTime || '',
    isFood: FOOD_CATEGORIES.includes(apiStore.category),
    menuNames: apiStore.menuNames,
    imageUrl: apiStore.imageUrl ?? undefined,
  }
}

export function getMappedLayoutWithApiData(
  layoutItems: LayoutItem[],
  stores: Store[],
  apiStores?: unknown,
): { layoutItems: LayoutItem[]; stores: Store[] } {
  let apiStoresList: StoreResponse[] = []
  if (Array.isArray(apiStores)) {
    apiStoresList = apiStores as StoreResponse[]
  } else if (apiStores && typeof apiStores === 'object') {
    const obj = apiStores as Record<string, unknown>
    if (Array.isArray(obj.result)) {
      apiStoresList = obj.result as StoreResponse[]
    } else if (Array.isArray(obj.data)) {
      apiStoresList = obj.data as StoreResponse[]
    } else if (Array.isArray(obj.content)) {
      apiStoresList = obj.content as StoreResponse[]
    } else if (Array.isArray(obj.stores)) {
      apiStoresList = obj.stores as StoreResponse[]
    } else if (Array.isArray(obj.storeList)) {
      apiStoresList = obj.storeList as StoreResponse[]
    }
  }

  if (!apiStoresList || apiStoresList.length === 0) {
    return { layoutItems, stores }
  }

  const mappedStores = apiStoresList.map(toStore)

  const apiStoresById = new Map(apiStoresList.map((b) => [b.id, b]))
  const mappedLayout = layoutItems.map((item) => {
    if (item.type === 'store') {
      if (item.storeNo === null || item.storeNo === undefined) {
        return item
      }
      const matched = apiStoresById.get(item.storeNo)
      if (matched) {
        return {
          ...item,
          id: String(matched.id),
          imageUrl: matched.imageUrl,
        }
      }
      return {
        ...item,
        name: '빈 점포',
        isVacant: true,
      }
    }
    return item
  })

  return { layoutItems: mappedLayout, stores: mappedStores }
}
