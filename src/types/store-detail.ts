export interface StoreKeyword {
  name: string
  label: string
}

export interface StoreMenu {
  name: string
  price: number
}

export interface StoreDetail {
  id: number
  name: string
  category: string
  intro: string | null
  imageUrl: string | null
  openTime: string | null
  phoneNumber: string | null
  zoneNumber: number
  keywords: StoreKeyword[]
  menus: StoreMenu[]
}
