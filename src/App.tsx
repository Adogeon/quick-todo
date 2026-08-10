import { useState, type SubmitEvent, type ChangeEvent } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import type { Task } from '../types/Task'
import TaskItem from './component/Task'
import './App.css'

const useAddNewTask = () => {
  const [newTask, setNewTask] = useState('')
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.currentTarget.value)
  }
  const reset = () => setNewTask('')
  return { newTask, handleChange, reset }
}

function App() {
  const [taskList, setTaskList] = useState<Task[]>([
    { label: 'Task 1', isDone: false },
    { label: 'Task 2', isDone: false },
  ])
  const [doneList, setDoneList] = useState<Task[]>([])
  const { newTask, handleChange, reset } = useAddNewTask()

  const handleFormSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newTask.trim() === '') return
    let newTaskObj: Task = { label: newTask, isDone: false }
    setTaskList((prev) => [...prev, newTaskObj])
    reset()
  }

  const onDelete = (index: number) => {
    setTaskList((prev) => prev.filter((_, i) => i !== index))
  }

  const onDone = (index: number, list: 'TODO' | 'DONE') => {
    if (list == 'TODO') {
      let taskObj: Task = taskList[index]
      setDoneList((prev) => [...prev, taskObj])
      setTaskList((prev) => prev.filter((_, i) => i !== index))
    } else if (list == 'DONE') {
      let taskObj: Task = doneList[index]
      setTaskList((prev) => [...prev, taskObj])
      setDoneList((prev) => prev.filter((_, i) => i !== index))
    }
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
          {taskList.map((task, index) => {
            return (
              <li key={index}>
                <TaskItem
                  label={task.label}
                  handleDelete={() => {
                    onDelete(index)
                  }}
                  handleDone={() => {
                    onDone(index, 'TODO')
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
                      handleDone={() => onDone(index, 'DONE')}
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
