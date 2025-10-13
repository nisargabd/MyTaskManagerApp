import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';


export const fetchTasks = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const createTask = async (task) =>{
    const response = await axios.post(API_URL, task);
    return response.data
};

export const getAllTasks =  async ()=>{
    const response = await axios.get(API_URL);
    return response.data;
};

export const getTaskById = async (id)=>{
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateTask = async (id,task) =>{
    const response= await axios.put(`${API_URL}/${id}`,task);
    return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};