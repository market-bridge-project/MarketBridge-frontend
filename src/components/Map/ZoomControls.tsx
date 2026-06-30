interface ZoomControlsProps {
  zoom: number
  minZoom: number
  maxZoom?: number
  onZoomIn: () => void
  onZoomOut: () => void
  isMenuOpen?: boolean
}

const ZoomControls = ({
  zoom,
  minZoom,
  maxZoom = 2.5,
  onZoomIn,
  onZoomOut,
  isMenuOpen = false,
}: ZoomControlsProps) => {
  return (
    <div
      className={`absolute right-[25px] flex flex-col z-50 select-none transition-all duration-300 ease-out ${
        isMenuOpen ? 'bottom-[222px]' : 'bottom-[102px]'
      }`}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerCancel={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="w-[48px] h-[98px] flex flex-col items-center justify-between bg-[rgba(255,255,255,0.90)] border border-[#EDE5DE] rounded-[24px] shadow-[0_10px_24px_-10px_rgba(138,90,51,0.14)] overflow-hidden py-1"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {/* 줌인 */}
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= maxZoom}
          className="w-full flex-1 flex items-center justify-center text-[#2B2B2B] hover:bg-[#f5f3ef]/60 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-[20px] font-semibold leading-none"
        >
          +
        </button>

        {/* 구분선 */}
        <div className="w-[28px] h-[1px] bg-[#EDE5DE] shrink-0" />

        {/* 줌아웃 */}
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= minZoom}
          className="w-full flex-1 flex items-center justify-center text-[#2B2B2B] hover:bg-[#f5f3ef]/60 active:scale-90 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer text-[20px] font-semibold leading-none select-none pb-0.5"
        >
          −
        </button>
      </div>
    </div>
  )
}

export default ZoomControls
