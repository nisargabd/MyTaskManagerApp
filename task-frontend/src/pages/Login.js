// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const token = res.data?.token;
      const user = res.data?.user;

      if (!token) {
        throw new Error("No token returned from server");
      }

      // Save token + optional user info
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      await Swal.fire({
        icon: "success",
        title: "Logged in",
        text: "Redirecting to your dashboard...",
        timer: 900,
        showConfirmButton: false,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Invalid credentials";
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3 text-primary">Welcome back</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <a href="/register" className="text-decoration-none">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
