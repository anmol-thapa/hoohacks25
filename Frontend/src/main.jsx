import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { AuthProvider } from './auth/UserAuth.jsx'
import Login from './pages/Login/Login.jsx'
import Home from './pages/Outlets/Home/Home.jsx'
import Schedule from './pages/Outlets/Schedule/Schedule.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/schedule',
        element: <Schedule />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
