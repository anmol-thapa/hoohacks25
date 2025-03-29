import { Outlet } from 'react-router';
import style from './App.module.css';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className={style.container}>
      <div className={style.sidebar}>
        <Sidebar />

      </div>
      <div className={style.outlet}>

      </div>
      <Outlet />
    </div>
  )
}

export default App
