import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DUMMY_STORES } from '@/api/stores'
import { getStores } from '@/api/store'
import { StoreResponse } from '@/types/store'
import marketLayoutData from '@/api/market-layout-fin.json'
import {
  computeLayout,
  getMappedLayoutWithApiData,
  type LayoutItem,
} from '../mapLayoutHelper'

export function useMapStoreData() {
  const {
    data: apiStores,
    error: apiError,
    isLoading,
  } = useQuery<StoreResponse[]>({
    queryKey: ['apiStores'],
    queryFn: getStores,
  })

  useEffect(() => {
    if (apiError) {
      console.error('[React Query] apiStores error:', apiError)
    }
  }, [apiError])

  const { positions, bigBlocks } = useMemo(() => {
    const { layoutItems, stores } = getMappedLayoutWithApiData(
      marketLayoutData as LayoutItem[],
      DUMMY_STORES,
      apiStores,
    )
    return computeLayout(layoutItems, stores)
  }, [apiStores])

  return { positions, bigBlocks, isLoading }
}
