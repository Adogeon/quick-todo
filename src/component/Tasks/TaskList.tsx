import type { ClientTask } from '#/types/ClientTask'
import { useMemo } from 'react'
import TaskItem from '../Task'

interface TaskListProps {
  tasks: ClientTask[]
  onDone?: (id: string) => void
  onDelete?: (id: string) => void
}

const TaskList = ({ tasks, onDone, onDelete }: TaskListProps) => {
  const todoList = useMemo(() => tasks.filter((t) => !t.is_done), [tasks])
  const doneList = useMemo(() => tasks.filter((t) => t.is_done), [tasks])
  return (
    <>
      <section id="task-list">
        <ul>
          {todoList.map((task, index) => {
            return (
              <li key={index}>
                <TaskItem
                  label={task.label}
                  handleDelete={() => {
                    if (onDelete) {
                      onDelete(task.id)
                    }
                  }}
                  handleDone={() => {
                    if (onDone) {
                      onDone(task.id)
                    }
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
                      handleDelete={() => {
                        if (onDelete) onDelete(task.id)
                      }}
                      handleDone={() => {
                        if (onDone) onDone(task.id)
                      }}
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

export default TaskList
