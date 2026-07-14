import { axiosInstance } from './api'
import type { ApiResponse } from '@/types/api'
import type { KeywordGroups } from '@/types/keyword'

export const getKeywords = async () => {
  const { data } =
    await axiosInstance.get<ApiResponse<KeywordGroups>>('/market/keyword')
  return data.result
}
