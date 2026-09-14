import { createFileRoute } from '@tanstack/react-router'
import { useTodos } from '@/context/taskContext'
import { TrashTaskList } from '#/component/Tasks/TaskList'
import { useEffect } from 'react'
import { taskDb } from '#/services/localdb'

export const Route = createFileRoute('/trash')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trash, loadTrash, restoreTodo, permanentDelete } = useTodos()

  useEffect(() => {
    loadTrash()
    return () => {
      taskDb.close()
    }
  }, [])

  return (
    <>
      <TrashTaskList
        tasks={trash}
        onRestore={restoreTodo}
        onDelete={permanentDelete}
      />
    </>
  )
}
