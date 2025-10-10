import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protected route component
function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function NavBar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  // keep navbar in sync across tabs and after login/logout
  useEffect(() => {
    const onStorage = () => setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-sm px-4 py-3 mb-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/" className="text-lg font-semibold text-gray-800">
            Task Management App
          </Link>
        </div>

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
            <div>
              <Link to="/login" className="text-sm text-indigo-600 hover:underline">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
