interface ZoomControlsProps {
  zoom: number
  minZoom: number
  maxZoom?: number
  onZoomIn: () => void
  onZoomOut: () => void
}

const ZoomControls = ({
  zoom,
  minZoom,
  maxZoom = 2.5,
  onZoomIn,
  onZoomOut,
}: ZoomControlsProps) => {
  return (
    <div
      className="absolute right-3 bottom-3 flex flex-col z-50 select-none"
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerCancel={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col bg-white border border-[#E5E2DC] rounded-2xl shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= maxZoom}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f3ef] active:scale-90 transition-all text-[#6F6A62] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg font-bold"
        >
          +
        </button>
        <hr className="border-[#E5E2DC]" />
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= minZoom}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f5f3ef] active:scale-90 transition-all text-[#6F6A62] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-lg font-bold"
        >
          −
        </button>
      </div>
    </div>
  )
}

export default ZoomControls
