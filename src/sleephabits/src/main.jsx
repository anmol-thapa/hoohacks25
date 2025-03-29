import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import { AuthProvider } from './auth/UserAuth.jsx'
import Login from './pages/Login.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </StrictMode>,
)
