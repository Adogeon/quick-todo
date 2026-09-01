import { Link, useRouterState } from '@tanstack/react-router'
import styles from './Tabs.module.css'

const Tabs = () => {
  const location = useRouterState({ select: (state) => state.location })
  const currentPath = location.pathname

  return (
    <>
      <div className={styles.mobileTabs}>
        <Link to="/" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/' ? styles.active : ''}`}
          >
            Active
          </span>
        </Link>
        <Link to="/trash" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/trash' ? styles.active : ''}`}
          >
            Trash
          </span>
        </Link>
      </div>
      <div className={styles.desktopTabs}>
        <Link to="/" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/' ? styles.active : ''}`}
          >
            Active
          </span>
        </Link>
        <Link to="/trash" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/trash' ? styles.active : ''}`}
          >
            Trash
          </span>
        </Link>
      </div>
    </>
  )
}

export default Tabs
