import { useNavigate, useLocation } from 'react-router-dom'
import { DUMMY_STORES } from '@/api/stores'
import backIcon from '../assets/icons/weui_back-filled.svg'

const StoreDetail = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { storeId } = (location.state as { storeId?: string }) ?? {}

  const store = DUMMY_STORES.find((s) => s.id === storeId) ?? DUMMY_STORES[0]

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="flex items-center gap-2 bg-app px-5 py-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-1"
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
          <span className="text-sm font-medium text-brand">지도</span>
        </button>
      </header>

      <div className="bg-glow px-5 pb-6">
        <div className="mt-4 overflow-hidden rounded-2xl">
          <div className="aspect-[16/10] w-full bg-gray-200" />
        </div>

        <h2 className="mt-5 text-2xl font-bold">{store.name}</h2>
        <p className="mt-1 text-sm text-gray-500">{store.category}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <h3 className="mt-6 text-base font-bold">한 줄 소개</h3>
        <p className="mt-2 text-sm text-gray-600">{store.description}</p>

        {store.isFood && store.menus && (
          <>
            <h3 className="mt-6 text-base font-bold">메뉴판</h3>
            <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
              <ul className="flex flex-col gap-4">
                {store.menus.map((menu, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{menu.name}</span>
                    <span className="mx-2 flex-1 border-b border-dotted border-gray-300" />
                    <span className="text-sm font-bold">{menu.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <h3 className="mt-6 text-base font-bold">운영 정보</h3>
        <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
          <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600">
            {store.info}
          </p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-8">
        <button
          type="button"
          className="w-full rounded-2xl bg-brand py-4 text-base font-semibold text-white shadow-[0_10px_22px_0_rgba(21,95,58,0.24)]"
        >
          지도에서 위치 보기
        </button>
      </div>
    </div>
  )
}

export default StoreDetail
