import { useNavigate } from 'react-router-dom'
import backIcon from '../assets/icons/weui_back-filled.svg'

const DUMMY_TAGS = ['혼자', '혼자', '혼자']

const DUMMY_MENUS = [
  { name: '핫도그', price: '2,500원' },
  { name: '핫도그', price: '2,500원' },
  { name: '핫도그', price: '2,500원' },
  { name: '핫도그', price: '2,500원' },
  { name: '핫도그', price: '2,500원' },
]

const StoreDetail = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="flex items-center gap-2 border-b border-gray-200 px-5 py-3">
        <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-1">
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
          <span className="text-sm font-medium text-brand">지도</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="mt-4 overflow-hidden rounded-2xl">
          <div className="aspect-[16/10] w-full bg-gray-200" />
        </div>

        <h2 className="mt-5 text-2xl font-bold">광장 호떡집</h2>
        <p className="mt-1 text-sm text-gray-500">음식 · 호떡, 어묵, 핫도그</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {DUMMY_TAGS.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-border-default bg-badge px-4 py-2 font-pretendard text-[13px] font-medium leading-[16px] text-brand"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-6 text-base font-bold">한 줄 소개</h3>
        <p className="mt-2 text-sm text-gray-600">dfsdf</p>

        <h3 className="mt-6 text-base font-bold">메뉴판</h3>
        <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
          <ul className="flex flex-col gap-4">
            {DUMMY_MENUS.map((menu, i) => (
              <li key={i} className="flex items-center justify-between">
                <span className="text-sm font-medium">{menu.name}</span>
                <span className="mx-2 flex-1 border-b border-dotted border-gray-300" />
                <span className="text-sm font-bold">{menu.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="mt-6 text-base font-bold">운영 정보</h3>
        <div className="mt-3 rounded-2xl border border-border-default bg-white p-5 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
          <p className="text-sm leading-relaxed text-gray-600">
            중앙 통로 3번 입구 · 10:00 ~ 22:00
            <br />
            월요일 휴무 · 02-XXX-XXXX
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
