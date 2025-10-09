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

  const handleAdd = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
      setEditingTask(null);
    } else {
      await createTask(taskData);
    }
    fetchTasks();
  };

  const handleEdit =async (task) => {
    await updateTask(task.id, task);
    fetchTasks();
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    // find the task
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { ...task, status: newStatus });
    fetchTasks();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <TaskForm
          onSubmit={handleAdd}
          existingTask={editingTask}
          onCancel={handleCancelEdit}
        />
      </div>
      <div>
        <TaskList
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </div>
  );
};

export default Dashboard;
