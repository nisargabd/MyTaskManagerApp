import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <span className="navbar-brand">Task Manager</span>
      <div className="ms-auto d-flex align-items-center">
        <span className="text-white me-3">Welcome, {user.name} ({user.role})</span>
        <img
          src={`https://ui-avatars.com/api/?name=${user.name}`}
          alt="profile"
          className="rounded-circle me-3"
          width="40"
          height="40"
        />
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
