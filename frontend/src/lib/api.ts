import axios from "axios";

const api = axios.create({
  // In development, Vite proxies /api to the backend. In production, set
  // VITE_API_BASE_URL to the deployed API URL (including /api/v1).
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
