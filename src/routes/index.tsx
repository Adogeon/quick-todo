import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '#/hooks/useTodo'
import TaskInput from '#/component/Tasks/TaskInput'
import { ActiveTaskList } from '#/component/Tasks/TaskList'
import { useEffect } from 'react'
import { taskDb } from '#/services/localdb'

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
  const { tasks, loadActive, addTodo, toggleTodo, deleteTodo } = useTodos()

  useEffect(() => {
    loadActive()
    ;() => {
      taskDb.close()
    }
  }, [])

  return (
    <>
      <TaskInput addTodo={addTodo} />
      <ActiveTaskList tasks={tasks} onDelete={deleteTodo} onDone={toggleTodo} />
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
