import { useNavigate, useLocation } from 'react-router-dom'
import backIcon from '../assets/icons/weui_back-filled.svg'
import vectorIcon from '../assets/icons/Vector.svg'
import mapIcon from '../assets/icons/map_icon.svg'

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

  const isShort = duration.includes('짧게') || duration.includes('중간')
  const courses = isShort ? DUMMY_COURSES.slice(0, 3) : DUMMY_COURSES

  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <header className="relative flex items-center justify-center bg-app px-5 py-3 border-b border-border-default">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-5 flex items-center"
        >
          <img src={backIcon} alt="뒤로가기" className="h-6 w-3" />
        </button>
        <h1 className="text-[16px] font-bold text-primary">추천 결과</h1>
      </header>

      <section className="relative flex h-[170px] items-center overflow-hidden bg-surface-green px-5">
        <h2 className="text-top leading-[38px] font-bold whitespace-pre-line">
          {title}
        </h2>
        <img
          src={mapIcon}
          alt=""
          className="absolute right-5 bottom-0 h-[90.09px] w-[101.25px]"
        />
      </section>

      <div className="flex-1 px-5 pt-8">
        <div className="rounded-3xl bg-white p-[18px] shadow-[0_14px_30px_0_rgba(43,27,14,0.08)]">
          <div className="flex flex-col gap-4">
            {courses.map((course, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  navigate('/store-detail', { state: { storeId: '22' } })
                }
                className="flex items-center gap-4 rounded-2xl border border-border-default bg-white p-4 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="h-[78px] w-[73px] shrink-0 rounded-xl border border-border-default bg-glow" />
                <div className="flex-1 text-left">
                  <p className="text-[17px] font-bold leading-[22px] text-primary">
                    {course.name}
                  </p>
                  <p className="mt-1 text-[13px] font-medium leading-[18px] text-secondary">
                    {course.tags}
                  </p>
                </div>
                <img
                  src={vectorIcon}
                  alt="상세보기"
                  className="h-[16.97px] w-[9.49px]"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 px-5 pt-6 pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 rounded-2xl border border-border-default bg-elevated py-4 text-[18px] font-bold leading-[22px] text-brand shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]"
        >
          다시 추천받기
        </button>
        <button
          type="button"
          onClick={() =>
            navigate('/store-detail', { state: { storeId: '22' } })
          }
          className="flex-1 rounded-2xl bg-brand py-4 text-[18px] font-bold leading-[22px] text-white shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]"
        >
          코스 확인하기
        </button>
      </div>
    </div>
  )
}

export default RecommendResult
