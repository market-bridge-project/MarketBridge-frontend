export interface Store {
  id: string
  name: string
  category: string
  subCategory: string
  hours: string
  description: string
  isFood: boolean
  menus?: { name: string; price: string }[]
  info: string
  rating: number
  imageUrl?: string
  isDummy?: boolean
  isVacant?: boolean
  storeNo?: number | null
}

export interface StoreResponse {
  id: number
  name: string
  category: string
  subCategory?: string
  hours?: string
  description?: string
  rating?: number
  imageUrl?: string | null
}
