import {
  useState,
  useEffect,
  useMemo,
  type SubmitEvent,
  type ChangeEvent,
} from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import TaskItem from './component/Task'
import './App.css'
import { taskDb, type Task } from './services/localdb.js'

const useAddNewTask = () => {
  const [newTask, setNewTask] = useState('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.currentTarget.value)
  }
  const reset = () => setNewTask('')
  return { newTask, handleChange, reset }
}

function App() {
  const [taskList, setTaskList] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const todoList = useMemo(
    () => taskList.filter((task) => !task.isDone),
    [taskList],
  )
  const doneList = useMemo(
    () => taskList.filter((task) => task.isDone),
    [taskList],
  )
  const { newTask, handleChange, reset } = useAddNewTask()

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskDb.getAll()
      data.sort((a, b) => b.createdAt - a.createdAt)
      setTaskList(data)
    } catch (error) {
      console.error('Failed to laod todos: ', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()

    return () => {
      taskDb.close()
    }
  }, [])

  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTask.trim() === '') return
    let newTaskObj: Task = {
      id: crypto.randomUUID(),
      label: newTask,
      isDone: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      synced: false,
    }

    try {
      setTaskList((prev) => [newTaskObj, ...prev])
      await taskDb.save(newTaskObj)
    } catch (error) {
      console.error('failed to add todo: ', error)
    }

    reset()
  }

  const onDelete = (index: number) => {
    setTaskList((prev) => prev.filter((_, i) => i !== index))
  }

  const onDone = async (index: number) => {
    const taskObj: Task = taskList[index]
    const update = {
      ...taskObj,
      isDone: !taskObj.isDone,
      updatedAt: Date.now(),
    }

    setTaskList((prev) => {
      const updateList = [...prev]
      updateList[index] = update
      return updateList
    })

    await taskDb.save(update)
  }

  return (
    <>
      <section id="new-task">
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="new-task"
            placeholder="Add your task here"
            value={newTask}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="icon-button add-button"
            aria-label="Add new task"
          >
            <PlusIcon className="icon add-icon" />
          </button>
        </form>
      </section>
      <div className="separator thick" />
      <section id="task-list">
        <ul>
          {todoList.map((task, index) => {
            return (
              <li key={index}>
                <TaskItem
                  label={task.label}
                  handleDelete={() => {
                    onDelete(index)
                  }}
                  handleDone={() => {
                    onDone(index)
                  }}
                  isDone={false}
                />
              </li>
            )
          })}
        </ul>
      </section>
      {doneList.length > 0 ? (
        <>
          <div className="separator" />
          <section id="done-list">
            <ul>
              {doneList.map((task, index) => {
                return (
                  <li key={index}>
                    <TaskItem
                      label={task.label}
                      isDone
                      handleDone={() => onDone(index)}
                    />
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      ) : null}
    </>
  )
}

export default App
