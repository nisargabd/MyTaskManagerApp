import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tasksByUser, setTasksByUser] = useState({});
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3); // users per page

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setErr("");
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load users");
    }
  };

  const toggleTasks = async (userId) => {
    setTasksByUser((prev) => {
      const cur = prev[userId] || {};
      if (cur.tasks && !cur.loading) return { ...prev, [userId]: { ...cur, open: !cur.open } };
      return { ...prev, [userId]: { ...(cur || {}), loading: true, error: null, open: true } };
    });

    if (tasksByUser[userId]?.tasks) return;

    try {
      const res = await api.get(`/admin/users/${userId}/tasks`);
      setTasksByUser((prev) => ({
        ...prev,
        [userId]: { loading: false, tasks: res.data || [], error: null, open: true },
      }));
    } catch (e) {
      setTasksByUser((prev) => ({
        ...prev,
        [userId]: { loading: false, tasks: [], error: e?.response?.data?.message || e.message || "Failed", open: true },
      }));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user and their tasks?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTasksByUser((prev) => {
        const cp = { ...prev };
        delete cp[userId];
        return cp;
      });
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return u.username?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <button
          onClick={loadUsers}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />
        <div className="relative min-w-[140px]">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none w-full p-2 border rounded pr-8"
          >
            <option value="createdAt">Date</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            ▼
          </div>
        </div>
        <div className="relative min-w-[100px]">
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="appearance-none w-full p-2 border rounded pr-8"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            ▼
          </div>
        </div>
      </div>

      {err && <div className="text-red-600 mb-2">{err}</div>}

      {paginatedUsers.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <ul className="space-y-3">
          {paginatedUsers.map((u) => {
            const info = tasksByUser[u.id] || {};
            return (
              <li key={u.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <div className="font-medium">{u.username || u.email}</div>
                    <div className="text-gray-600 text-sm">role: {u.role}</div>
                  </div>

                  <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => toggleTasks(u.id)}
                      className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition text-sm"
                    >
                      {info.open ? "Hide Tasks" : "View Tasks"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    >
                      Delete User
                    </button>
                  </div>
                </div>

                {info.open && (
                  <div className="mt-3 pl-3 border-l border-gray-200">
                    {info.loading ? (
                      <div>Loading tasks...</div>
                    ) : info.error ? (
                      <div className="text-red-600">{info.error}</div>
                    ) : (info.tasks || []).length === 0 ? (
                      <div className="text-sm text-gray-600">No tasks for this user.</div>
                    ) : (
                      <ul className="space-y-2">
                        {info.tasks.map((t) => (
                          <li key={t.id} className="p-2 border rounded bg-gray-50">
                            <div className="font-semibold">{t.title}</div>
                            {t.description && <div className="text-gray-700 text-sm">{t.description}</div>}
                            <div className="text-xs text-gray-500">
                              Status:{" "}
                              <span
                                className={`font-medium ${
                                  t.status === "completed"
                                    ? "text-green-600"
                                    : t.status === "inprogress"
                                    ? "text-yellow-600"
                                    : "text-gray-600"
                                }`}
                              >
                                {t.status}
                              </span>{" "}
                              | Created: {new Date(t.createdAt).toLocaleDateString()}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 rounded">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
