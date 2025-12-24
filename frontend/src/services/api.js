import axios from "axios";

const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // If it doesn't end in /api and isn't localhost (or even if it is), ensure /api appended
  // But be careful not to double append if the user ALREADY put /api
  if (!url.endsWith("/api")) {
    url += "/api";
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});

// ALWAYS send token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Create a response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - auto logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
