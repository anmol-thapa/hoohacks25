import { NavLink } from 'react-router';
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
        <NavLink to='/' activeClassName={style.active}>
          Schedule
        </NavLink>
        <NavLink to='/learn' activeClassName={style.active}>
          Learn
        </NavLink>
        <NavLink to='/tracker' activeClassName={style.active}>
          Tracker
        </NavLink>
      </div>

      <p className={style.logout} onClick={logout}>
        Logout
      </p>
    </div>
  );
}
