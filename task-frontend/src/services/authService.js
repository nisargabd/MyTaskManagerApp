const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function register({ username, email, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }
  throw new Error(data.message || 'Register failed');
}

export async function login({ email, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (res.ok) {
    if (data.token) localStorage.setItem('token', data.token);
    if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }
  const msg = data?.message || 'Login failed';
  throw new Error(msg);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}