import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasksByUser, setTasksByUser] = useState({}); // { [userId]: { loading, tasks, error, open } }
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setErr('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || 'Failed to load users');
    }
  }

  async function toggleTasks(userId) {
    setTasksByUser(prev => {
      const cur = prev[userId] || {};
      // if already loaded, just toggle open
      if (cur.tasks && !cur.loading) return { ...prev, [userId]: { ...cur, open: !cur.open } };
      return { ...prev, [userId]: { ...(cur || {}), loading: true, error: null, open: true } };
    });

    // if tasks already loaded, nothing more to fetch
    if (tasksByUser[userId] && tasksByUser[userId].tasks) return;

    try {
      const res = await api.get(`/admin/users/${userId}/tasks`);
      setTasksByUser(prev => ({ ...prev, [userId]: { loading: false, tasks: res.data || [], error: null, open: true } }));
    } catch (e) {
      setTasksByUser(prev => ({ ...prev, [userId]: { loading: false, tasks: [], error: e?.response?.data?.message || e.message || 'Failed', open: true } }));
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Delete this user and their tasks? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setTasksByUser(prev => {
        const cp = { ...prev };
        delete cp[userId];
        return cp;
      });
    } catch (e) {
      alert(e?.response?.data?.message || e.message || 'Delete failed');
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button onClick={loadUsers} className="px-3 py-1 bg-indigo-600 text-white rounded">Refresh</button>
          <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
        </div>
      </div>

      {err && <div className="text-red-600 mb-2">{err}</div>}

      <section>
        <h3 className="text-xl mb-2">Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="space-y-2">
            {users.map(u => {
              const info = tasksByUser[u.id] || {};
              return (
                <li key={u.id} className="p-3 border rounded flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{u.username || u.email}</div>
                      <div className="text-sm text-gray-600">role: {u.role}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTasks(u.id)}
                        className="px-2 py-1 bg-sky-500 text-white rounded text-sm"
                      >
                        {info.open ? 'Hide Tasks' : 'View Tasks'}
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Delete User
                      </button>
                    </div>
                  </div>

                  {info.open && (
                    <div className="mt-3 pl-3">
                      {info.loading ? (
                        <div>Loading tasks...</div>
                      ) : info.error ? (
                        <div className="text-red-600">{info.error}</div>
                      ) : (info.tasks || []).length === 0 ? (
                        <div className="text-sm text-gray-600">No tasks for this user.</div>
                      ) : (
                        <ul className="space-y-1">
                          {(info.tasks || []).map(t => (
                            <li key={t.id} className="p-2 border rounded bg-gray-50">
                              <div className="font-semibold">{t.title}</div>
                              {t.description && <div className="text-sm text-gray-700">{t.description}</div>}
                              <div className="text-xs text-gray-500">status: {t.status}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}