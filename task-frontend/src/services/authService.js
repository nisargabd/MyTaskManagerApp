import api from './api';

export async function register({ username, email, password }) {
  const res = await api.post('/auth/register', { username, email, password });
  const data = res.data;
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password });
  const data = res.data;
  // store token & user immediately so subsequent requests (e.g. fetching tasks) have the token
  if (data.token) localStorage.setItem('token', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}
