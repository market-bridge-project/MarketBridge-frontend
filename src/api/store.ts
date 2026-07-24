import { StoreResponse } from '@/types/store'
import { axiosInstance } from './api'

/**
 * 백엔드 API로부터 전체 상점 리스트를 조회합니다.
 * @returns 상점 리스트 배열
 */
export const getStores = async (): Promise<StoreResponse[]> => {
  const response = await axiosInstance.get<StoreResponse[]>('/market/store')
  return response.data
}
