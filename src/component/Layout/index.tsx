import Tabs from './Tabs'
import styles from './Index.module.css'
import { useAuth } from '#/context/authContext'
import { Link } from '@tanstack/react-router'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div className={styles.container}>
      <div className={styles.mobileLayout}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>Quick Todo</h1>
          <div className={styles.mobileAuth}>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>
        <Tabs />
        <div className={styles.mobileContent}>{children}</div>
      </div>
      <div className={styles.desktopLayout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>Quick Todo</h1>
            <Tabs />
          </div>
          <div className={styles.sidebarFooter}>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm text-blu-500 hover:text-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </aside>
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
