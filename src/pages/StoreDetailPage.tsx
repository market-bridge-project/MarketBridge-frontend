import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStoreDetail } from '@/api/storeDetail'
import { getCuratedStoreName } from '@/components/map/mapLayoutHelper'
import backIcon from '../assets/icons/weui_back-filled.svg'

const StoreDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { storeId, courseStoreIds, courseTitle } =
    (location.state as {
      storeId?: number | string
      courseStoreIds?: string[]
      courseTitle?: string
    }) ?? {}
  const numericStoreId = Number(storeId)

  const {
    data: store,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['storeDetail', numericStoreId],
    queryFn: () => getStoreDetail(numericStoreId),
    enabled: Number.isFinite(numericStoreId),
  })

  const name = store ? (getCuratedStoreName(store.id) ?? store.name) : ''

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/map')
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="relative flex items-center justify-center bg-app px-5 py-3 h-12 shrink-0 border-b border-border-default">
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-5 flex items-center"
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
      </header>

      {isLoading && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-500">불러오는 중...</p>
        </div>
      )}

      {!isLoading && (isError || !store) && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-500">
            매장 정보를 불러오지 못했어요.
          </p>
        </div>
      )}

      {!isLoading && store && (
        <>
          <div className="bg-glow px-5 pb-6">
            <div className="mt-4 overflow-hidden rounded-2xl">
              {store.imageUrl ? (
                <img
                  src={store.imageUrl}
                  alt={name}
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-gray-200" />
              )}
            </div>

            <h2 className="mt-5 text-2xl font-bold">{name}</h2>
            <p className="mt-1 text-sm text-gray-500">{store.category}</p>

            {store.keywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {store.keywords.map((keyword) => (
                  <span
                    key={keyword.name}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    {keyword.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <h3 className="mt-6 text-base font-bold">한 줄 소개</h3>
            <p className="mt-2 text-sm text-gray-600">
              {store.intro ?? '등록된 소개가 없어요.'}
            </p>

            {store.menus.length > 0 && (
              <>
                <h3 className="mt-6 text-base font-bold">메뉴판</h3>
                <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
                  <ul className="flex flex-col gap-4">
                    {store.menus.map((menu) => (
                      <li
                        key={menu.name}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{menu.name}</span>
                        <span className="mx-2 flex-1 border-b border-dotted border-gray-300" />
                        <span className="text-sm font-bold">
                          {typeof menu.price === 'number'
                            ? `${menu.price.toLocaleString('ko-KR')}원`
                            : menu.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <h3 className="mt-6 text-base font-bold">운영 정보</h3>
            <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
              <ul className="flex flex-col gap-2 text-sm text-gray-600">
                <li>운영시간 {store.openTime ?? '정보 없음'}</li>
                <li>전화번호 {store.phoneNumber ?? '정보 없음'}</li>
                <li>{store.zoneNumber}구역</li>
              </ul>
            </div>
          </div>

          <div className="px-5 pt-4 pb-8">
            <button
              type="button"
              onClick={() =>
                navigate('/map', {
                  state: {
                    focusStoreId: String(store.id),
                    ...(courseStoreIds && courseStoreIds.length > 0
                      ? { courseStoreIds, courseTitle }
                      : {}),
                  },
                })
              }
              className="w-full rounded-2xl bg-brand py-4 text-base font-semibold text-white shadow-[0_10px_22px_0_rgba(21,95,58,0.24)]"
            >
              지도에서 위치 보기
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default StoreDetail
