import axios from "axios";

// Routing strategy:
// - Local dev  → Vite proxy in vite.config.js: /api → http://localhost:5001/api
// - Production → vercel.json rewrite:          /api → https://shopease-1-opkc.onrender.com/api
// VITE_API_URL is kept as an optional override (e.g. staging environments)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
