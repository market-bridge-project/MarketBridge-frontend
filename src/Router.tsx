import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { LandingPage } from './pages/Landing/LandingPage'
import { SearchPage, RecommendResult, StoreDetail } from './pages'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: 'ai-course-recommend',
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
