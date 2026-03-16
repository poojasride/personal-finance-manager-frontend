import axios from "axios";

const API_URL = "http://localhost:5000/api";
// const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
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

/* ==============================
   GET CATEGORIES
============================== */

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

/* ==============================
   CREATE CATEGORY
============================== */

export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  return res.data;
};

/* ==============================
   UPDATE CATEGORY
============================== */

export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

/* ==============================
   DELETE CATEGORY
============================== */

export const deleteCategory = async (id) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};