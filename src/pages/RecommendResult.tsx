import { useNavigate, useLocation } from 'react-router-dom'
import backIcon from '../assets/icons/weui_back-filled.svg'
import vectorIcon from '../assets/icons/Vector.svg'

const DUMMY_COURSES = [
  { name: '광장 호떡집', tags: '간식 · 호떡' },
  { name: '광장 호떡집', tags: '간식 · 호떡' },
  { name: '광장 호떡집', tags: '간식 · 호떡' },
  { name: '광장 호떡집', tags: '간식 · 호떡' },
]

const RecommendResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { companion = [], purpose = [], duration = [] } = location.state ?? {}

  const title = `${companion[0] ?? ''} ${purpose[0] ?? ''}를\n${duration[0] ?? ''} 가지는 코스`

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="flex items-center px-5 py-3">
        <button type="button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold">추천 결과</h1>
        <div className="w-10" />
      </header>

      <section className="bg-surface-green px-5 pt-4 pb-12">
        <h2 className="text-top leading-[38px] font-bold whitespace-pre-line">
          {title}
        </h2>
      </section>

      <div className="flex-1 px-5 pt-8">
        <div className="rounded-3xl bg-white p-[18px]">
          <div className="flex flex-col gap-4">
            {DUMMY_COURSES.map((course, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate('/store-detail')}
                className="flex items-center gap-4 rounded-2xl border border-border-default bg-white p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="h-16 w-16 shrink-0 rounded-xl bg-surface-green" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{course.name}</p>
                  <p className="mt-1 text-xs text-gray-500">{course.tags}</p>
                </div>
                <img src={vectorIcon} alt="상세보기" className="h-[16.97px] w-[9.49px]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pt-6 pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full rounded-2xl border border-gray-300 bg-white py-4 text-base font-semibold"
        >
          다시 추천받기
        </button>
      </div>
    </div>
  )
}

export default RecommendResult
