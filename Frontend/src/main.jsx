import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from './auth/UserAuth.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'

import './index.css'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'

// Outlet pages
import Home from './pages/Outlets/Home/Home.jsx'
import Schedule from './pages/Outlets/Schedule/Schedule.jsx'
import Learn from './pages/Outlets/Learn/Learn.jsx'
import Questionnaire from './pages/Questionnaire/Questionnaire.jsx'
import Tracker from './pages/Tracker.jsx'

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
      },
      {
        path: '/learn',
        element: <Learn />
      },
      {
        path: '/tracker',
        element: <Tracker />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/questionnaire',
    element: <Questionnaire />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)