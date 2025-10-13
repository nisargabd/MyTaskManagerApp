import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { register } from "../services/authService";

const Register = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await register({ username, email, password, role });
      if (data?.user) {
        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "You can now log in to your account.",
          showConfirmButton: false,
          timer: 2000,
        });
        nav("/login");
      }
    } catch (ex) {
      const message = ex?.response?.data?.message || ex.message || "Register failed";
      setErr(message);
      console.error("Register error:", ex);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-md mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>

      {err && <div className="text-red-600 mb-2 text-center">{err}</div>}

      <form onSubmit={submit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <label className="block mb-3">
          Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
