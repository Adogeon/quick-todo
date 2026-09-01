import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '@/hooks/useTodo'
import TaskList from '#/component/Tasks/TaskList'
import { useEffect } from 'react'
import { taskDb } from '#/services/localdb'

export const Route = createFileRoute('/trash')({
  component: RouteComponent,
})

function RouteComponent() {
  const { tasks, loadTrash, restoreTodos } = useTodos()

  useEffect(() => {
    loadTrash()

    return () => {
      taskDb.close()
    }
  }, [])

  return (
    <>
      <TaskList tasks={tasks} />
    </>
  )
}
