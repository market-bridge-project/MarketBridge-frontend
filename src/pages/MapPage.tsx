import MapHeader from '@/components/map/MapHeader'
import MapFooter from '@/components/map/MapFooter'
import MarketMap from '@/components/map/MarketMap'

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
