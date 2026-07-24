export interface StoreKeyword {
  name: string
  label: string
}

export interface StoreMenu {
  name: string
  // 가격이 숫자가 아니라 "변동" 같은 문자열로 오는 경우가 있음
  price: number | string
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
