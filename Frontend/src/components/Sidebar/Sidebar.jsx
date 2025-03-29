import { NavLink } from 'react-router';
import style from './Sidebar.module.css';

export default function Sidebar() {

  return (
    <div className={style.sidebar}>

      <div className={style.navButtons}>
        <NavLink to='/'>
          <p>Home</p>
        </NavLink>
        <NavLink to='/schedule'>
          <p>Schedule</p>
        </NavLink>
      </div>
    </div>
  )
}