import React, { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { getAllTasks, createTask, updateTask, deleteTask } from "../api/taskService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    if (editingTask) {
      await updateTask(editingTask.id, task);
      setEditingTask(null);
    } else {
      await createTask(task);
    }
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="dashboard">
      <h2>Task Management Dashboard</h2>
      <TaskForm onSubmit={handleAddTask} existingTask={editingTask} />
      <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />
    </div>
  );
};

export default Dashboard;
