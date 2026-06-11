import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

/**
 * REQUEST INTERCEPTOR
 * Automatically attaches the correct token based on route
 */
api.interceptors.request.use((config) => {
  const isAdminRoute = window.location.pathname.startsWith("/admin");

  const token = isAdminRoute
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * RESPONSE INTERCEPTOR
 * Handles unauthorized access (401)
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    if (status === 401) {
      if (isAdminRoute) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default api;