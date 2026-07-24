import { axiosInstance } from './api'
import type { ApiResponse } from '@/types/api'
import type { StoreDetail } from '@/types/storeDetail'

export const getStoreDetail = async (storeId: number) => {
  const { data } = await axiosInstance.get<ApiResponse<StoreDetail>>(
    `/market/store/${storeId}`,
  )
  return data.result
}
