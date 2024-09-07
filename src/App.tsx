import { useState, type FormEvent, type ChangeEvent } from "react";
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
  const { newTask, handleChange, reset } = useAddNewTask();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTaskList((prev) => [...prev, newTask]);
    reset();
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
          <button type="submit" value="submit">
            {" "}
            Add
          </button>
        </form>
      </section>
      <section id="task-list">
        <ul>
          {taskList.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default App;
