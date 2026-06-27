import MapHeader from '@/components/Map/MapHeader'
import MapFooter from '@/components/Map/MapFooter'

const MapPage = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-app">
      <MapHeader />

      <main className="flex flex-1 items-center justify-center">
        <p className="text-secondary text-sm font-semibold">
          지도가 여기에 표시됩니다
        </p>
      </main>

      <MapFooter />
    </div>
  )
}

export default MapPage
