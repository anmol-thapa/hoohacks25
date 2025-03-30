import { NavLink, Navigate } from 'react-router';
import style from './Sidebar.module.css';
import { useAuth } from '../../auth/UserAuth.jsx';

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <div className={style.sidebar}>

      <div className={style.appName}>
        <h1>Dormio</h1>
      </div>

      <div className={style.navButtons}>
        <NavLink to='/'>
          Home
        </NavLink>
        <NavLink to='/schedule'>
          Schedule
        </NavLink>
        <NavLink to='/learn'>
          Learn
        </NavLink>
        <NavLink to='/tracker'>
          Tracker
        </NavLink>
        <p onClick={logout} style={{ cursor: 'pointer' }}>
          Logout
        </p>
      </div>
    </div>
  )
}