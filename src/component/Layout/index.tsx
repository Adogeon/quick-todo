import './Layout.css'
import Tabs from './Tabs'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-2x1 mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Quick Todo</h1>
      </header>
      <Tabs />
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default Layout
