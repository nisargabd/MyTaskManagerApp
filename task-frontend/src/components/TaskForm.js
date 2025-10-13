// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { createTask, updateTask } from '../services/taskService';

export default function TaskForm({ initial = null, onCreated, onUpdated, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || '');
      setDescription(initial.description || '');
      setStatus(initial.status || 'todo'); // ✅ ensure status is prefilled
    }
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!title.trim()) {
      setErr('Title is required');
      return;
    }

    const payload = { title, description, status }; // ✅ include status in payload
    try {
      if (initial) {
        const updatedTask = await updateTask(initial.id, payload);
        onUpdated(updatedTask); // pass updated task back
      } else {
        await createTask(payload);
        onCreated();
      }
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Failed to save task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50 space-y-3">
      {err && <div className="text-red-600">{err}</div>}

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initial ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
