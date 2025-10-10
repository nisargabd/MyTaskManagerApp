import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Table } from "react-bootstrap";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserTasks, setSelectedUserTasks] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
    setFilteredUsers(res.data);
  };

  const fetchTasksForUser = async (userId, userName) => {
    const res = await axios.get(`http://localhost:5000/api/admin/users/${userId}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSelectedUserTasks(res.data);
    setSelectedUserName(userName);
    setShowModal(true);
  };

  const deleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "User will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "User removed successfully.", "success");
      fetchUsers();
    }
  };

  // 🔍 Search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  // ⬆️⬇️ Sort by name or role
  const handleSort = (field) => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const valA = a[field].toLowerCase();
      const valB = b[field].toLowerCase();
      if (sortOrder === "asc") return valA.localeCompare(valB);
      else return valB.localeCompare(valA);
    });
    setFilteredUsers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 📄 Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">User Management</h3>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Table striped bordered hover responsive className="shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>#</th>
            <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
              Name {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th>Email</th>
            <th onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
              Role {sortOrder === "asc" ? "↑" : "↓"}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u, i) => (
            <tr key={u.id}>
              <td>{indexOfFirstUser + i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span
                  className={`badge ${
                    u.role === "admin" ? "bg-danger" : "bg-success"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info me-2"
                  onClick={() => fetchTasksForUser(u.id, u.name)}
                >
                  View Tasks
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
            >
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 🪟 Modal for Viewing Tasks */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUserName}'s Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUserTasks.length > 0 ? (
            <Table striped bordered>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {selectedUserTasks.map((task, i) => (
                  <tr key={task.id}>
                    <td>{i + 1}</td>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>
                      <span
                        className={`badge ${
                          task.status === "Completed"
                            ? "bg-success"
                            : task.status === "In Progress"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td>{new Date(task.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center text-muted mb-0">
              No tasks found for this user.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
