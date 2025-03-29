import style from './Sidebar.module.css';

export default function Sidebar() {
  return (
    <div className={style.sidebar}>

      <div className={style.navButtons}>
        <p>1</p>
        <p>2</p>
        <p>3</p>
      </div>

    </div>
  )
}