import { useState } from 'react'
import { type ClientTask } from '#/types/ClientTask'
import {
  TrashIcon,
  ArrowPathRoundedSquareIcon,
} from '@heroicons/react/24/outline'

interface BaseTaskItemProps {
  task: ClientTask
}

interface ActiveItemProps extends BaseTaskItemProps {
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

interface TrashItemProps extends BaseTaskItemProps {
  onRestore: (id: string) => void
}

export const ActiveTask = ({ task, onToggle, onDelete }: ActiveItemProps) => {
  const handleDelete = () => {
    if (confirm('Move this task to trash ?')) onDelete(task.id)
  }

  return (
    <div className={`task ${task.is_done ? 'done' : ''}`}>
      <input
        type="checkbox"
        onChange={() => onToggle(task.id)}
        checked={task.is_done}
        className="w-4 h-4 cursor-pointer"
      />
      <span>{task.label}</span>
      <span className="task-buttons">
        <button
          onClick={handleDelete}
          className="icon-button"
          aria-label="Delete task"
        >
          <TrashIcon className="icon" />
        </button>
      </span>
    </div>
  )
}

export const TrashTask = ({ task, onRestore }: TrashItemProps) => {
  const handleRestore = () => {
    if (confirm('Restore this task to active ?')) onRestore(task.id)
  }

  return (
    <div className={`task`}>
      <span>{task.label}</span>
      <span className="task-buttons">
        <button
          onClick={handleRestore}
          className="icon-button"
          aria-label="Delete task"
        >
          <ArrowPathRoundedSquareIcon className="icon" />
        </button>
      </span>
    </div>
  )
}
