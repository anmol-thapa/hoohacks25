import { Navigate } from 'react-router';
import { useAuth } from './UserAuth.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/login' />
  }

  return children;
}

