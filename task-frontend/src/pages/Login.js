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

      const { token } = res.data;
      if (!token) throw new Error("No token returned from server");

      localStorage.setItem("token", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Redirecting to dashboard...",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        navigate("/", { replace: true });
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "420px" }}>
        <h3 className="text-center mb-3 text-primary">Welcome Back</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
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
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
