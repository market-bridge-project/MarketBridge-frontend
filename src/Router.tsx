import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import { Home } from './pages/Home'
import { LandingPage } from './pages/LandingPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'landing',
        element: <LandingPage />,
      },
    ],
  },
])

export default router
