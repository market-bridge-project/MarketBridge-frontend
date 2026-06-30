import { Store } from '@/types/store'
import foodIconSvg from '@/assets/icons/FoodIcon.svg'
import storeIconSvg from '@/assets/icons/StoreIcon.svg'

interface ShopCardProps {
  store: Store
  isSelected: boolean
  onClick: (e: React.MouseEvent, id: string) => void
  style: React.CSSProperties
}

const ShopCard = ({ store, isSelected, onClick, style }: ShopCardProps) => {
  // 1. 공터 (Dummy) 혹은 빈 점포 (Vacant) 인 경우 회색 테마 적용
  const isGrayCell = store.isDummy || store.isVacant

  if (isGrayCell) {
    return (
      <div
        style={style}
        className="absolute rounded-lg bg-[#f0f0f0] border border-[#e7e7e7]
          shadow-[0_1px_0_#dadada,0_2px_0_#cecece,0_2px_3px_rgba(0,0,0,0.05)]
          pointer-events-none z-[1]"
      />
    )
  }

  // 2. 일반 영업 점포 (흰색 배경 + 녹색 테두리 + 녹색 하단 그림자)
  const borderClass = isSelected
    ? 'border-2 border-[#155f3a]'
    : 'border border-[#155f3a]/25'

  const shadowClass = isSelected
    ? 'shadow-[0_1px_0_#0f462a,0_2px_0_#0a3520,0_3px_5px_rgba(21,95,58,0.3)] z-20'
    : 'shadow-[0_1px_0_#155f3a,0_2px_0_#0f462a,0_2px_3px_rgba(21,95,58,0.15)] z-10'

  return (
    <button
      type="button"
      onClick={(e) => onClick(e, store.id)}
      style={style}
      className={`absolute rounded-lg bg-[#fefcfa] ${borderClass} ${shadowClass}
        cursor-pointer select-none transition-all duration-150
        flex items-center gap-1.5 px-2 overflow-hidden`}
    >
      {/* 점포 뱃지 */}
      <div className="w-[18px] h-[18px] flex items-center justify-center shrink-0">
        <img
          src={store.isFood ? foodIconSvg : storeIconSvg}
          alt={store.isFood ? '음식점' : '일반점포'}
          className="w-full h-full object-contain"
        />
      </div>
      {/* 점포 정보 */}
      <div className="flex flex-col min-w-0 leading-none items-start">
        <span className="text-[10px] font-bold text-[#155f3a] leading-tight truncate w-full text-left">
          {store.name}
        </span>
        <span className="text-[7.5px] text-[#6F6A62]/70 font-semibold mt-0.5">
          {store.id}
        </span>
      </div>
    </button>
  )
}

export default ShopCard
