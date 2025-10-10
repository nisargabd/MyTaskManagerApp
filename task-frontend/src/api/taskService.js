
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getAllTasks = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await axios.post(API_URL, taskData, getAuthHeaders());
  return res.data;
};

export const updateTask = async (id, updatedData) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedData, getAuthHeaders());
  return res.data;
};

export const deleteTask = async (id) => {
  await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
};
