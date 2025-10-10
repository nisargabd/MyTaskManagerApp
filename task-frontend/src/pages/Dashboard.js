import React, { useEffect, useState, useRef } from 'react';
import { fetchTasks, deleteTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // task being edited
  const nav = useNavigate();
  const didFetchRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
      return;
    }
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    (async () => {
      try {
        const data = await fetchTasks();
        setTasks(data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message || 'Failed to load tasks');
      }
    })();
  }, [nav]);

  const onCreated = (task) => {
    setTasks(prev => [task, ...prev]);
    setShowForm(false);
  };

  const onUpdated = (task) => {
    setTasks(prev => prev.map(t => (t.id === task.id ? task : t)));
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  const startEdit = (task) => {
    setEditing(task);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Your Tasks</h2>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="px-3 py-1 bg-green-600 text-white rounded">Add Task</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-4">
          <TaskForm
            initial={editing}
            onCreated={onCreated}
            onUpdated={onUpdated}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {err && <div className="text-red-600 mb-2">{err}</div>}

      <ul className="space-y-3">
        {tasks.map(t => (
          <li key={t.id} className="p-3 border rounded bg-white flex justify-between items-start">
            <div>
              <div className="font-semibold">{t.title}</div>
              {t.description && <div className="text-sm text-gray-700">{t.description}</div>}
              <div className="text-xs text-gray-500">status: {t.status}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => startEdit(t)} className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">Edit</button>
              <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
