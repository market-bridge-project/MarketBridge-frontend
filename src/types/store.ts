export interface Store {
  id: string
  name: string
  category: string
  subCategory: string
  hours: string
  description: string
  isFood: boolean
  tags: string[]
  menus?: { name: string; price: string }[]
  info: string
  rating: number
  badgeText: string
  imageUrl?: string
  block?: number
  column?: 'leftOuter' | 'leftInner' | 'rightInner' | 'rightOuter'
  span?: number
  isDummy?: boolean
  isVacant?: boolean
}
