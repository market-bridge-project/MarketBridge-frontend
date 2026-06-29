import { useNavigate } from 'react-router-dom'
import listIconSvg from '@/assets/icons/list_icon.svg'
import aiIconSvg from '@/assets/icons/ai_icon.svg'
import aiSearchIconSvg from '@/assets/icons/ai_search_icon.svg'

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
      <button
        type="button"
        onClick={() => navigate('/store-list')}
        className={`absolute right-[25px] bottom-[162px] z-50 w-[125px] h-[48px] rounded-full bg-[rgba(255,255,255,0.90)] border border-[#EDE5DE] flex items-center pl-[12px] pr-[14px] shadow-[0_8px_20px_-6px_rgba(10,54,28,0.12)] active:scale-95 transition-all duration-300 ease-out select-none ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <img
          src={aiSearchIconSvg}
          alt="검색 아이콘"
          className="w-[32px] h-[32px] object-contain select-none shrink-0 mr-[16px]"
        />
        <span className="text-[13px] font-bold text-[#2B2B2B] leading-none shrink-0">
          검색
        </span>
      </button>

      {/* AI 추천 버튼 */}
      <button
        type="button"
        onClick={() => navigate('/recommended')}
        className={`absolute right-[25px] bottom-[102px] z-50 w-[125px] h-[48px] rounded-full bg-[rgba(255,255,255,0.90)] border border-[#EDE5DE] flex items-center pl-[12px] pr-[14px] shadow-[0_8px_20px_-6px_rgba(10,54,28,0.12)] active:scale-95 transition-all duration-300 ease-out select-none ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <img
          src={aiIconSvg}
          alt="AI 추천 아이콘"
          className="w-[32px] h-[32px] object-contain select-none shrink-0 mr-[16px]"
        />
        <span className="text-[13px] font-bold text-[#2B2B2B] leading-none shrink-0">
          AI 추천
        </span>
      </button>

      {/* 메뉴 버튼 */}
      <div
        className="absolute right-[25px] bottom-[20px] z-50 flex flex-col items-end select-none"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerMove={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onPointerCancel={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleToggle}
          className="w-[70px] h-[70px] rounded-full bg-[#116C3D] border-[3px] border-white flex items-center justify-center shadow-[0_12px_28px_-10px_rgba(10,54,28,0.28)] active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <img
            src={listIconSvg}
            alt="메뉴 아이콘"
            className="w-[7px] h-[29px] object-contain select-none"
          />
        </button>
      </div>
    </>
  )
}

export default MapFloatingMenu
