import { useState, type FormEvent, type ChangeEvent } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import Task from "./component/Task";
import "./App.css";

const useAddNewTask = () => {
  const [newTask, setNewTask] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTask(e.currentTarget.value);
  };
  const reset = () => setNewTask("");
  return { newTask, handleChange, reset };
};

function App() {
  const [taskList, setTaskList] = useState(["Task 1", "Task 2"]);
  const [doneList, setDoneList] = useState<string[]>([]);
  const { newTask, handleChange, reset } = useAddNewTask();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    setTaskList((prev) => [...prev, newTask]);
    reset();
  };

  const onDelete = (index: number) => {
    setTaskList((prev) => prev.filter((_, i) => i !== index));
  };

  const onDone = (index: number) => {
    setDoneList((prev) => [...prev, taskList[index]]);
    setTaskList((prev) => prev.filter((_, i) => i !== index));
  };

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
                <Task
                  name={task}
                  handleDelete={() => {
                    onDelete(index);
                  }}
                  handleDone={() => {
                    onDone(index);
                  }}
                />
              </li>
            );
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
                    <Task name={task} done />
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      ) : null}
    </>
  );
}

export default App;
