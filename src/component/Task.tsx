import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { type MouseEvent } from "react";

interface TaskProps {
  name: string;
  handleDelete?: (e: MouseEvent) => void;
  handleDone?: (e: MouseEvent) => void;
  done?: boolean;
}

const Task = (props: TaskProps) => {
  const handleDeleteClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Do you want to delete this task ?")) {
      props.handleDelete?.(e);
    }
  };

  const handleDoneClick = (e: MouseEvent) => {
    e.stopPropagation();
    props.handleDone?.(e);
  };

  return (
    <div className={`task ${props.done ? "done" : ""}`}>
      <span>{props.name}</span>
      <span className="task-buttons">
        <button
          onClick={handleDeleteClick}
          className="icon-button"
          aria-label="Delete task"
        >
          <TrashIcon className="icon" />
        </button>
        <button
          onClick={handleDoneClick}
          className="icon-button"
          aria-label="Mark done"
        >
          <CheckIcon className="icon" />
        </button>
      </span>
    </div>
  );
};

export default Task;
