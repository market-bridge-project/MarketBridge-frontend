export interface RecommendRequest {
  who: string
  what: string
  time: string
}

export interface RecommendedStore {
  storeId: number
  name: string
  category: string
  thumbnailUrl: string | null
}

export interface RecommendResult {
  courseTitle: string
  stores: RecommendedStore[]
}
