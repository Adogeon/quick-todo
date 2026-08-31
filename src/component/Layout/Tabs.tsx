import { Link, useRouterState } from '@tanstack/react-router'

const Tabs = () => {
  return (
    <div className="flex gap-1 border-b boreder-gray-200">
      <Link
        to="/"
        className={`px-4 py-2 text-sm font-medium transition-colors relative`}
      >
        Active
      </Link>
      <Link
        to="/trash"
        className={`px-4 py-2 text-sm font-medium transition-colors relative`}
      >
        Trash
      </Link>
    </div>
  )
}

export default Tabs
