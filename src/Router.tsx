import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import MapPage from './pages/MapPage'
import SearchPage from './pages/RecommendPage'
import RecommendResult from './pages/RecommendResultPage'
import StoreDetail from './pages/StoreDetailPage'
import { LandingPage } from './pages/LandingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <MapPage />,
      },
      {
        path: 'recommended',
        element: <SearchPage />,
      },
      {
        path: 'recommend-result',
        element: <RecommendResult />,
      },
      {
        path: 'store-detail',
        element: <StoreDetail />,
      },
      {
        path: 'landing',
        element: <LandingPage />,
      },
    ],
  },
])

export default router
