import MapHeader from '@/components/Map/MapHeader'
import MapFooter from '@/components/Map/MapFooter'
import MarketMap from '@/components/Map/MarketMap'

const MapPage = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#f5f3ef]">
      <MapHeader />

      <main className="flex-1 relative overflow-hidden">
        <MarketMap />
      </main>

      <MapFooter />
    </div>
  )
}

export default MapPage
