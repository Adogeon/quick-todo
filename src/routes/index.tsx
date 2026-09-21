import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '#/context/taskContext'
import { useAuth } from '#/context/authContext'
import TaskInput from '#/component/Tasks/TaskInput'
import { ActiveTaskList } from '#/component/Tasks/TaskList'

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

function ActiveView() {
  const { active, loadFromLocal, addTodo, toggleTodo, deleteTodo } = useTodos()
  const { isLogin } = useAuth()

  return (
    <>
      <TaskInput addTodo={addTodo} />
      <ActiveTaskList
        tasks={active}
        onDelete={deleteTodo}
        onDone={toggleTodo}
      />
    </>
  )
}

function Home() {
  const data = Route.useLoaderData()

  return (
    <div className="p-8">
      <div>{data.apiStatus}</div>
      <ActiveView />
    </div>
  )
}
