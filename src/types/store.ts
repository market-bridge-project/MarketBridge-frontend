export interface Store {
  id: string
  name: string
  category: string
  hours: string
  isFood: boolean
  menuNames?: string[]
  imageUrl?: string
  isDummy?: boolean
  isVacant?: boolean
  storeNo?: number | null
}

export interface StoreResponse {
  id: number
  name: string
  category: string
  openTime?: string | null
  imageUrl?: string | null
  menuNames?: string[]
}
