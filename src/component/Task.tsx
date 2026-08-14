import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { type MouseEvent, type ChangeEvent } from 'react'

interface TaskProps {
  label: string
  handleDelete?: (e: MouseEvent) => void
  handleDone?: (e: ChangeEvent) => void
  isDone?: boolean
}

const TaskItem = (props: TaskProps) => {
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('Do you want to delete this task ?')) {
      props.handleDelete?.(e)
    }
  }

  const handleDoneClick = (e: ChangeEvent) => {
    e.stopPropagation()
    props.handleDone?.(e)
  }

  return (
    <div className={`task ${props.isDone ? 'done' : ''}`}>
      <input
        type="checkbox"
        onChange={handleDoneClick}
        checked={props.isDone}
      />
      <span>{props.label}</span>
      <span className="task-buttons">
        <button
          onClick={handleDeleteClick}
          className="icon-button"
          aria-label="Delete task"
        >
          <TrashIcon className="icon" />
        </button>
      </span>
    </div>
  )
}

export default TaskItem
