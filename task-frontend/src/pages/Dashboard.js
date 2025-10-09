import React, { useEffect, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { getAllTasks, createTask, updateTask, deleteTask } from "../api/taskService";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  // view: 'list' | 'form'
  const [view, setView] = useState("list");

  const fetchTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSave = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.id, { ...editingTask, ...taskData });
      setEditingTask(null);
    } else {
      await createTask(taskData);
    }
    await fetchTasks();
    setView("list");
  };

  const handleEdit = (task) => {
    // open the form with the existing task data
    setEditingTask(task);
    setView("form");
  };

  const handleCancel = () => {
    setEditingTask(null);
    setView("list");
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    await fetchTasks();
  };

  const handleStatusChange = async (id, newStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateTask(id, { ...task, status: newStatus });
    await fetchTasks();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
          <p className="text-sm text-gray-500">Manage and track your tasks</p>
        </div>
        {view === "list" && (
          <div>
            <button
              onClick={() => { setEditingTask(null); setView("form"); }}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
            >
              + Add Task
            </button>
          </div>
        )}
      </div>

      <div>
        {view === "form" ? (
          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">{editingTask ? "Edit Task" : "Add Task"}</h3>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
            <TaskForm onSubmit={handleSave} existingTask={editingTask} onCancel={handleCancel} />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
