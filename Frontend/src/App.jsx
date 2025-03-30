import { Outlet } from 'react-router';
import style from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar';
import { useAuth } from './auth/UserAuth';
import { Navigate } from 'react-router';

function App() {
  const { user } = useAuth();

  // Force users to complete a questionnaire
  if (!user.questionnaire) {
    return <Navigate to='/questionnaire' />
  }

  return (
    <div className={style.container}>
      <Sidebar />
      <div className={style.outlet}>
        <Outlet />
      </div>
    </div>
  )
}

export default App