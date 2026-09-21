import {
  createContext,
  useState,
  useCallback,
  useContext,
  useReducer,
  useMemo,
} from 'react'
import { taskDb } from '#/services/localdb'
import { useDebounceCallBack } from '#/hooks/useDebounce'
import { syncToServer } from '#/services/sync'
import { useAuth } from '#/hooks/useAuth'
import type { ClientTask } from '#/types/ClientTask'
interface TaskContextType {
  active: ClientTask[]
  trash: ClientTask[]
  isSyncing: boolean
  triggerSync: () => Promise<void>
  loadFromLocal: () => Promise<void>
  addTodo: (text: string) => Promise<void>
  toggleTodo: (id: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
  restoreTodo: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>
}

const TaskContext = createContext<TaskContextType | null>(null)

type TaskState = {
  tasks: ClientTask[]
}

type TaskAction = {
  type: string
  payload?: ClientTask | ClientTask[] | string
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_ONE':
      if (
        !action.payload ||
        typeof action.payload === 'string' ||
        Array.isArray(action.payload)
      )
        return state
      return { tasks: [...state.tasks, action.payload] }
    case 'ADD_MANY':
      if (!action.payload || !Array.isArray(action.payload)) return state
      const newTasks = [...state.tasks, ...action.payload]
      return { tasks: newTasks.sort((a, b) => b.create_date - a.create_date) }
    case 'UPDATE_ONE':
      if (
        !action.payload ||
        Array.isArray(action.payload) ||
        typeof action.payload === 'string'
      )
        return state
      const update = action.payload
      const updateTasks = state.tasks.map((t) =>
        t.id === update.id ? update : t,
      )
      return { tasks: updateTasks }
    case 'DELETE_ONE':
      if (!action.payload || typeof action.payload !== 'string') return state
      const task_id = action.payload
      const deletedTasks = state.tasks.filter((t) => t.id !== task_id)
      return { tasks: deletedTasks }
    default:
      return state
  }
}

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ tasks }, dispatch] = useReducer(taskReducer, { tasks: [] })
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const active = useMemo(() => tasks.filter((t) => !t.is_delete), [tasks])
  const trash = useMemo(() => tasks.filter((t) => t.is_delete), [tasks])
  const { token: sessionToken, isLogin } = useAuth()

  const triggerSync = useDebounceCallBack(() => {
    if (isLogin) return
    syncToServer(sessionToken).finally(() => {
      setIsSyncing(false)
    })
  }, 60_000)

  const loadFromLocal = async () => {
    try {
      const tasks = await taskDb.getAll()
      dispatch({ type: 'ADD_MANY', payload: tasks })
    } catch (error) {
      console.error('Failled to load tasks: ' + error)
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
        dispatch({ type: 'ADD_ONE', payload: newTaskObj })
        await taskDb.save(newTaskObj)
        setIsSyncing(true)
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
        dispatch({ type: 'UPDATE_ONE', payload: update })
        await taskDb.save(update)
        setIsSyncing(true)
        triggerSync()
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
        dispatch({ type: 'UPDATE_ONE', payload: update })
        await taskDb.save(update)
        setIsSyncing(true)
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
        dispatch({ type: 'UPDATE_ONE', payload: update })
        await taskDb.save(update)
        setIsSyncing(true)
        triggerSync()
      } catch (error) {
        console.log('Failed to delete task:', error)
      }
    },
    [trash, triggerSync],
  )

  const permanentDelete = useCallback(async (id: string) => {
    dispatch({ type: 'DELETE_ONE', payload: id })
    await taskDb.delete(id)
  }, [])

  return (
    <TaskContext.Provider
      value={{
        active,
        trash,
        isSyncing,
        triggerSync,
        loadFromLocal,
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
