import axios from "axios";

const API_URL = "http://localhost:5000/api";
// const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api";

const API = axios.create({
  baseURL: `${API_URL}`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getProfile = () => API.get("/profile");

export const updateProfile = (data) => API.put("/profile", data);

export const changePassword = (data) => API.put("/change-password", data);
