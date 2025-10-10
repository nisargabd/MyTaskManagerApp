import React, { useState, useEffect } from "react";
import { createTask, updateTask } from "../services/taskService";

const statusOptions = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const TaskForm = ({ initial = null, onCreated, onUpdated, onCancel }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(
    initial?.description || ""
  ); /* renamed to description */
  const [status, setStatus] = useState("todo");
  const [err, setErr] = useState("");
  const editing = !!initial?.id;

  useEffect(() => {
    setTitle(initial?.title || "");
    setDescription(initial?.description || "");
    setErr("");
  }, [initial]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Title required");
    try {
      if (editing) {
        const updated = await updateTask(
          initial.id,
          {
            title: title.trim(),
            description: description.trim() || null,
          }
        );
        if (onUpdated) onUpdated(updated);
      } else {
        const created = await createTask({
          title: title.trim(),
          description: description.trim() || null,
        });
        if (onCreated) onCreated(created); // parent updates UI
      }
      setTitle("");
      setDescription("");
      if (onCancel) onCancel(); // close form after success
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex.message || "Save failed");
      console.error("TaskForm error:", ex);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {editing ? "Edit Task" : "Add New Task"}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        {err && <div className="text-red-600">{err}</div>}
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end space-x-3">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
            >
              {editing ? "Update Task" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
