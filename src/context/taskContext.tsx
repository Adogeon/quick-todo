import { createContext, useState, useCallback, useContext } from 'react'
import { taskDb } from '#/services/localdb'
import { useDebounceCallBack } from '#/hooks/useDebounce'
import { syncToServer } from '#/services/sync'
import { useAuth } from '#/context/authContext'
import type { ClientTask } from '#/types/ClientTask'
interface TaskContextType {
  tasks: ClientTask[]
  trash: ClientTask[]
  triggerSync: () => Promise<void>
  loadActive: () => Promise<void>
  loadTrash: () => Promise<void>
  addTodo: (text: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  restoreTodo: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | null>(null)

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<ClientTask[]>([])
  const [trash, setTrash] = useState<ClientTask[]>([])

  const { sessionToken } = useAuth()
  const triggerSync = useDebounceCallBack(() => {
    if (!sessionToken) return
    syncToServer(sessionToken)
  }, 30_000)

  const loadActive = async () => {
    try {
      const active = await taskDb.getActive()
      active.sort((a, b) => b.create_date - a.create_date)
      setTasks(active)
    } catch (error) {
      console.error('Failled to load tasks: ' + error)
    }
  }

  const loadTrash = async () => {
    try {
      const trashTask = await taskDb.getDelete()
      setTrash(trashTask)
    } catch (error) {
      console.error('Failed to load trash: ' + error)
    }
  }

  const addTodo = useCallback(
    async (text: string) => {
      let newTaskObj: ClientTask = {
        id: crypto.randomUUID(),
        label: text,
        is_done: false,
        create_date: Date.now(),
        update_date: Date.now(),
        version: 1,
        is_delete: 0,
        synced: 0,
      }

      try {
        setTasks((prev) => [newTaskObj, ...prev])
        await taskDb.save(newTaskObj)
        triggerSync()
      } catch (error) {
        console.error('failed to add todo: ', error)
      }
    },
    [triggerSync],
  )

  const toggleTodo = useCallback(
    async (id: string) => {
      try {
        let taskObj: ClientTask | undefined = tasks.find((t) => t.id === id)
        if (!taskObj) throw Error("Can't find the task with id")
        const update = {
          ...taskObj,
          is_done: !taskObj.is_done,
          synced: 0,
          version: taskObj.version + 1,
          update_date: Date.now(),
        }
        await taskDb.save(update)
        triggerSync()
        setTasks((prev) => prev.map((t) => (t.id === update.id ? update : t)))
      } catch (error) {
        console.log('Faild to update task:', error)
      }
    },
    [tasks, triggerSync],
  )

  const deleteTodo = useCallback(
    async (id: string) => {
      try {
        let taskObj: ClientTask | undefined = tasks.find((t) => t.id === id)
        if (!taskObj) throw Error("Can't find the task with id")
        const update = {
          ...taskObj,
          is_delete: 1,
          synced: 0,
          version: taskObj.version + 1,
          update_date: Date.now(),
        }
        await taskDb.save(update)
        setTasks((prev) => prev.filter((t) => t.id !== id))
        setTrash((prev) => [update, ...prev])
        triggerSync()
      } catch (error) {
        console.log('Failed to delete task:', error)
      }
    },
    [tasks, triggerSync],
  )

  const restoreTodo = useCallback(
    async (id: string) => {
      try {
        let taskObj: ClientTask | undefined = trash.find((t) => t.id === id)
        if (!taskObj) throw Error("Can't find the task with id" + id)
        const update = {
          ...taskObj,
          is_delete: 0,
          synced: 0,
          version: taskObj.version + 1,
          update_date: Date.now(),
        }
        await taskDb.save(update)
        setTrash((prev) => prev.filter((t) => t.id !== id))
        setTasks((prev) => [update, ...prev])
        triggerSync()
      } catch (error) {
        console.log('Failed to delete task:', error)
      }
    },
    [trash, triggerSync],
  )

  const permanentDelete = useCallback(async (id: string) => {
    await taskDb.delete(id)
    setTrash((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        trash,
        triggerSync,
        loadActive,
        loadTrash,
        addTodo,
        toggleTodo,
        deleteTodo,
        restoreTodo,
        permanentDelete,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTodos() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTodos muse be use within TaskProvider')
  }

  return context
}
