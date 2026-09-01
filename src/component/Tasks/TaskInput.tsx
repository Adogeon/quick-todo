import { type SubmitEvent } from 'react'
import { useTextInput } from '#/hooks/useTextInput'
import { PlusIcon } from '@heroicons/react/24/outline'

interface TaskInputProps {
  addTodo: (text: string) => void
}

const TaskInput = ({ addTodo }: TaskInputProps) => {
  const {
    newInput: newTask,
    debouncedInput: debouncedTask,
    handleChange,
    reset,
  } = useTextInput()
  const handleFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (debouncedTask.trim() === '') return
    addTodo(debouncedTask)
    reset()
  }
  return (
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
  )
}

export default TaskInput
