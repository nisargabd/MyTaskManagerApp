const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
  return data;
}

export async function createTask(task) {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(task),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data;
}

export async function updateTask(id, task) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(task),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
}

export async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
  });
  if (res.status === 204 || res.ok) return;
  const data = await res.json();
  throw new Error(data.message || 'Delete failed');
}