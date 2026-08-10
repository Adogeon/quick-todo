import { createFileRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      const response = await fetch('api/health')
      const data = await response.json()

      return {
        apiStatus: 'online',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        apiStatus: 'offline',
        timestamp: new Date().toISOString(),
      }
    }
  },
  component: Home,
})

function Home() {
  const data = Route.useLoaderData()

  return (
    <div className="p-8">
      <div>{data.apiStatus}</div>
      <App />
    </div>
  )
}
