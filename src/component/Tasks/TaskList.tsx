import type { ClientTask } from '#/types/ClientTask'
import { useMemo } from 'react'
import { ActiveTask, TrashTask } from '../TaskItem'

interface ActiveTaskListProps {
  tasks: ClientTask[]
  onDone: (id: string) => void
  onDelete: (id: string) => void
}

export const ActiveTaskList = ({
  tasks,
  onDone,
  onDelete,
}: ActiveTaskListProps) => {
  const todoList = useMemo(() => tasks.filter((t) => !t.is_done), [tasks])
  const doneList = useMemo(() => tasks.filter((t) => t.is_done), [tasks])
  return (
    <>
      <section id="task-list">
        <ul>
          {todoList.map((task, index) => {
            return (
              <li key={index}>
                <ActiveTask task={task} onDelete={onDelete} onToggle={onDone} />
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
                    <ActiveTask
                      task={task}
                      onDelete={onDelete}
                      onToggle={onDone}
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

interface TrashTaskListProps {
  tasks: ClientTask[]
  onRestore: (id: string) => void
}

export const TrashTaskList = ({ tasks, onRestore }: TrashTaskListProps) => {
  return (
    <section id="task-list">
      <ul>
        {tasks.map((task, index) => {
          return (
            <li key={index}>
              <TrashTask task={task} onRestore={onRestore} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
