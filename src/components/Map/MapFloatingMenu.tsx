import { useNavigate } from 'react-router-dom'
import listIconSvg from '@/assets/icons/list_icon.svg'
import aiIconSvg from '@/assets/icons/ai_icon.svg'
import aiSearchIconSvg from '@/assets/icons/ai_search_icon.svg'

interface FloatingActionButtonProps {
  bottom: number
  iconSrc: string
  iconAlt: string
  label: string
  isOpen: boolean
  onClick: () => void
}

const FLOATING_BUTTON_BASE_CLASS =
  'absolute right-[16px] z-50 w-[125px] h-[48px] rounded-full bg-[rgba(255,255,255,0.90)] border border-[#EDE5DE] flex items-center pl-[12px] pr-[14px] shadow-[0_8px_20px_-6px_rgba(10,54,28,0.12)] active:scale-95 transition-all duration-300 ease-out select-none'

const FloatingActionButton = ({
  bottom,
  iconSrc,
  iconAlt,
  label,
  isOpen,
  onClick,
}: FloatingActionButtonProps) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation()
      onClick()
    }}
    onPointerDown={(e) => e.stopPropagation()}
    onPointerMove={(e) => e.stopPropagation()}
    onPointerUp={(e) => e.stopPropagation()}
    onPointerCancel={(e) => e.stopPropagation()}
    tabIndex={isOpen ? 0 : -1}
    aria-hidden={!isOpen}
    className={`${FLOATING_BUTTON_BASE_CLASS} ${
      isOpen
        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
        : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
    }`}
    style={{ bottom: `${bottom}px`, backdropFilter: 'blur(4px)' }}
  >
    <img
      src={iconSrc}
      alt={iconAlt}
      className="w-[32px] h-[32px] object-contain select-none shrink-0 mr-[16px]"
    />
    <span className="text-[13px] font-bold text-[#2B2B2B] leading-none shrink-0">
      {label}
    </span>
  </button>
)

interface MapFloatingMenuProps {
  isOpen: boolean
  onToggle: () => void
}

const MapFloatingMenu = ({ isOpen, onToggle }: MapFloatingMenuProps) => {
  const navigate = useNavigate()

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <>
      {/* 검색 버튼 */}
      <FloatingActionButton
        bottom={144}
        iconSrc={aiSearchIconSvg}
        iconAlt="검색 아이콘"
        label="검색"
        isOpen={isOpen}
        onClick={() => navigate('/store-list')}
      />

      {/* AI 추천 버튼 */}
      <FloatingActionButton
        bottom={80}
        iconSrc={aiIconSvg}
        iconAlt="AI 추천 아이콘"
        label="AI 추천"
        isOpen={isOpen}
        onClick={() => navigate('/recommended')}
      />

      {/* 메뉴 버튼 */}
      <div
        className="absolute right-[16px] bottom-[16px] z-50 flex flex-col items-end select-none"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onPointerCancel={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="w-[48px] h-[48px] rounded-full bg-[#116C3D] border-[2.5px] border-white flex items-center justify-center shadow-[0_12px_28px_-10px_rgba(10,54,28,0.28)] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <img
            src={listIconSvg}
            alt="메뉴 아이콘"
            className="w-[5px] h-[20px] object-contain select-none"
          />
        </button>
      </div>
    </>
  )
}

export default MapFloatingMenu
