// src/utils/axios.js
import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";

const api = axios.create({
  baseURL: getBackendUrl() + "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
