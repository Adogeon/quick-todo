import { createFileRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <App />
    </div>
  )
}
