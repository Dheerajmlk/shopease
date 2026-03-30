import axios from "axios";

// ALWAYS use a relative /api base URL — never an absolute URL.
//
// Why? Vite env vars (VITE_*) are baked into the JS bundle at build time.
// If VITE_API_URL=http://localhost:5001 is set anywhere (local .env OR
// Vercel dashboard), it becomes a hardcoded string in production JS,
// causing Mixed Content errors (HTTP on an HTTPS page) and
// ERR_CONNECTION_REFUSED (localhost doesn't exist on Vercel's servers).
//
// Routing is handled transparently at the infrastructure layer:
//   Local dev  → vite.config.js proxy:  /api  →  http://localhost:5001/api
//   Production → vercel.json rewrite:   /api  →  https://shopease-1-opkc.onrender.com/api
//
// No env vars needed. No localhost strings in the bundle. No mixed content.

const api = axios.create({
  baseURL: "/api",
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
