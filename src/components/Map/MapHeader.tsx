import mapIconSvg from '@/assets/icons/map_icon.svg'

const MapHeader = () => {
  return (
    <header className="flex items-center justify-center bg-app px-5 py-3 shrink-0 border-b border-border-default">
      <div className="flex items-center gap-2">
        <img src={mapIconSvg} alt="" aria-hidden="true" className="h-5 w-5" />
        <h1 className="text-[16px] font-bold text-primary">
          잠실새마을전통시장
        </h1>
      </div>
    </header>
  )
}

export default MapHeader
