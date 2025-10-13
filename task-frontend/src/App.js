import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected route component
function ProtectedRoute({ children, allowedRoles, user }) {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

// Navbar component
function NavBar({ user, setUser }) {
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-sm px-4 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-800">
          Task Management App
        </Link>
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link to="/admin" className="text-sm text-indigo-600 hover:underline">
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">Welcome, {user.username || user.email}</span>
              <button onClick={onLogout} className="px-3 py-1 bg-red-500 text-white rounded">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm text-indigo-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  // hide navbar on login/register pages
  const hideNav = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <NavBar user={user} setUser={setUser} />}
      <div className="container mx-auto px-4">
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]} user={user}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

// Wrap App in Router to access useLocation for navbar hiding
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
