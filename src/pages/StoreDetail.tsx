import { useNavigate } from 'react-router-dom'

const DUMMY_TAGS = ['경기 후', '혼밥', '간식']

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
      <header className="flex items-center px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-brand"
        >
          &lt; 지도
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="mt-2 overflow-hidden rounded-2xl bg-gray-200">
          <div className="aspect-[16/10] w-full bg-gray-300" />
        </div>

        <h2 className="mt-5 text-2xl font-bold">광장 호떡집</h2>
        <p className="mt-1 text-sm text-gray-500">음식 · 호떡, 어묵, 핫도그</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {DUMMY_TAGS.map((tag, i) => (
            <span
              key={i}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                i === 0
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="mt-6 text-base font-bold">한 줄 소개</h3>
        <p className="mt-2 text-sm text-gray-600">dfsdf</p>

        <h3 className="mt-6 text-base font-bold">메뉴판</h3>
        <div className="mt-3 rounded-2xl bg-white p-5">
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
        <div className="mt-3 rounded-2xl bg-white p-5">
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
          className="w-full rounded-2xl bg-₩ py-4 text-base font-semibold text-white"
        >
          지도에서 위치 보기
        </button>
      </div>
    </div>
  )
}

export default StoreDetail
