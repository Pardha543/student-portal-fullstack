// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // you store it as "token"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // IMPORTANT
  }
  return config;
});

export default api;