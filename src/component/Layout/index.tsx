import Tabs from './Tabs'
import styles from './Index.module.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <div className={styles.mobileLayout}>
        <header className={styles.mobileHeader}>
          <h1 className={styles.mobileTitle}>Quick Todo</h1>
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
        </aside>
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>{children}</div>
        </main>
      </div>
    </div>
  )
}

export default Layout
