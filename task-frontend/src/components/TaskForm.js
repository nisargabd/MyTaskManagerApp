import React, { useState, useEffect, use } from "react";

const TaskForm = ({ onSubmit, existingTask }) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [status, setStatus] = useState("To Do");

useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setStatus(existingTask.status);
    }
}, [existingTask]); 

    const handleSubmit = (e) => {       
        e.preventDefault();
        onSubmit({ title, description, status });
        setTitle("");
        setDescription("");
        setStatus("To Do");
    };
    
    return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{existingTask ? "Edit Task" : "Add New Task"}</h3>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">{existingTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;