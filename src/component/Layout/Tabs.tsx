import { Link, useRouterState } from '@tanstack/react-router'
import styles from './Tabs.module.css'
import { useTodos } from '#/context/taskContext'
const Tabs = () => {
  const location = useRouterState({ select: (state) => state.location })
  const currentPath = location.pathname
  const { active, trash } = useTodos()
  const activeCount = active.length
  const trashCount = trash.length

  return (
    <>
      <div className={styles.mobileTabs}>
        <Link to="/" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/' ? styles.active : ''}`}
          >
            Active
          </span>
          {activeCount > 0 && (
            <span className={styles.tabCount}>{activeCount}</span>
          )}
        </Link>
        <Link to="/trash" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/trash' ? styles.active : ''}`}
          >
            Trash
            {trashCount > 0 && (
              <span className={styles.tabCount}>{trashCount}</span>
            )}
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
          {activeCount > 0 && (
            <span className={styles.tabCount}>{activeCount}</span>
          )}
        </Link>
        <Link to="/trash" className={styles.tabLink}>
          <span
            className={`${styles.tabLabel} ${currentPath === '/trash' ? styles.active : ''}`}
          >
            Trash
          </span>
          {trashCount > 0 && (
            <span className={styles.tabCount}>{trashCount}</span>
          )}
        </Link>
      </div>
    </>
  )
}

export default Tabs
