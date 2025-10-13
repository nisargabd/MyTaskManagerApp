import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Swal from "sweetalert2";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await login({ email, password });
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user); // ✅ instantly updates navbar
      }

      await Swal.fire({
        icon: "success",
        title: "Logged in",
        text: "Redirecting to your dashboard...",
        timer: 900,
        showConfirmButton: false,
      });

      if (data?.user?.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (ex) {
      setErr(ex?.message || "Login failed");
      console.error("Login error:", ex);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: ex?.message || "Invalid credentials",
      });
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3 text-primary">Welcome back</h3>
        {err && <div className="text-danger text-center mb-3">{err}</div>}

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
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
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
