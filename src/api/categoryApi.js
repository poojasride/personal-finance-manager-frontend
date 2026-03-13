import axios from "axios";

const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api";

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res;
};
