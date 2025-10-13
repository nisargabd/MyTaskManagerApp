// src/pages/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import { fetchTasks, deleteTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]); // All tasks
  const [err, setErr] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const nav = useNavigate();
  const didFetchRef = useRef(false);

  const pageSize = 5;

  
  const fetchTasksData = async () => {
    try {
      const data = await fetchTasks();
      console.log('Fetched tasks:', data);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e.message || 'Failed to load tasks');
    }
  };

  // ✅ Run only once on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      nav('/login');
      return;
    }
    if (!didFetchRef.current) {
      didFetchRef.current = true;
      fetchTasksData();
    }
  }, [nav]);

  // ✅ After create/update/delete
  const onCreated = () => { fetchTasksData(); setShowForm(false); };
  const onUpdated = () => { fetchTasksData(); setEditing(null); setShowForm(false); };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      fetchTasksData();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };
  const startEdit = (task) => { setEditing(task); setShowForm(true); };
  const openCreate = () => { setEditing(null); setShowForm(true); };

  // ✅ Filtering, Searching, Sorting (Frontend Only)
  const filteredTasks = tasks
    .filter(t =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t => (statusFilter ? t.status === statusFilter : true))
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = aVal?.toString().toLowerCase();
        bVal = bVal?.toString().toLowerCase();
      }
      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });

  // ✅ Pagination
  const totalPages = Math.ceil(filteredTasks.length / pageSize) || 1;
  const displayedTasks = filteredTasks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>
        <button onClick={openCreate} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
          Add Task
        </button>
      </div>

      {/* Search / Filter / Sort */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="border p-2 rounded min-w-[150px]"
        />

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="border p-2 rounded"
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); }}
          className="border p-2 rounded"
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>

        <select
          value={order}
          onChange={(e) => { setOrder(e.target.value); }}
          className="border p-2 rounded"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Task Form */}
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

      {/* Error */}
      {err && <div className="text-red-600 mb-2">{err}</div>}

      {/* Task List */}
      <ul className="space-y-3">
        {displayedTasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          displayedTasks.map(t => (
            <li key={t.id} className="p-3 border rounded bg-white flex justify-between items-start">
              <div>
                <div className="font-semibold">{t.title}</div>
                {t.description && <div className="text-sm text-gray-700">{t.description}</div>}
                <div className="text-xs text-gray-500">
                  Status:{' '}
                  <span className={`font-medium ${
                    t.status === 'completed'
                      ? 'text-green-600'
                      : t.status === 'inprogress'
                      ? 'text-yellow-600'
                      : 'text-gray-600'
                  }`}>
                    {t.status}
                  </span>{' '}
                  | Created: {new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
