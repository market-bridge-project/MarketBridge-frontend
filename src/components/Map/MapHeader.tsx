import mapIconSvg from '@/assets/icons/map_icon.svg'

const MapHeader = () => {
  return (
    <header className="relative flex items-center justify-center bg-app px-5 py-3 shrink-0 border-b border-border-default">
      <img
        src={mapIconSvg}
        alt=""
        aria-hidden="true"
        className="absolute left-5 h-5 w-5"
      />
      <h1 className="text-[16px] font-bold text-primary">잠실새마을전통시장</h1>
    </header>
  )
}

export default MapHeader
