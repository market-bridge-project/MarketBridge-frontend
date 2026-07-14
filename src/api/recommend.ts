import { axiosInstance } from './api'
import type { ApiResponse } from '@/types/api'
import type { RecommendRequest, RecommendResult } from '@/types/recommend'

export const postRecommend = async (payload: RecommendRequest) => {
  const { data } = await axiosInstance.post<ApiResponse<RecommendResult>>(
    '/recommend',
    payload,
  )
  return data.result
}
