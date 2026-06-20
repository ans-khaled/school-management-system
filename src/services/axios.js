import axios from "axios";
import { BASE } from "./api-constants";

const api = axios.create({
  baseURL: BASE,
});

// Read the token fresh on EVERY request — this is the fix for your bug
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional but useful: catch 401s in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // e.g. clear token + redirect to /login
    }
    return Promise.reject(error);
  },
);

export default api;
