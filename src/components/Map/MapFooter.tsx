import { useNavigate } from 'react-router-dom'

const MapFooter = () => {
  const navigate = useNavigate()

  return (
    <footer className="shrink-0 border-t border-border-default bg-elevated">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex w-full items-center justify-center py-4 text-[16px] font-bold text-brand"
      >
        지도
      </button>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  )
}

export default MapFooter
