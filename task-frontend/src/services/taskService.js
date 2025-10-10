import api from './api';

export async function fetchTasks() {
  const res = await api.get('/tasks');
  return res.data;
}

export async function createTask(task) {
  // task = { title, description, status? }
  const res = await api.post('/tasks', task);
  return res.data;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}

export async function updateTask(id, updates) {
  // updates = { title?, description?, status? }
  const res = await api.put(`/tasks/${id}`, updates);
  return res.data;
}