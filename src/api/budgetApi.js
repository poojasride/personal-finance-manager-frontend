import axios from "axios";

// const API_URL = "http://localhost:5000/api/budgets";
const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api/budgets";

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Add interceptor (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ==============================
// GET Budgets
// ==============================
export const getBudgets = async () => {
  const res = await api.get("/");
  return res.data;
};


// ==============================
// CREATE Budget
// ==============================
export const createBudget = async (data) => {
  const res = await api.post("/", data);
  return res.data;
};


// ==============================
// UPDATE Budget
// ==============================
export const updateBudget = async (id, data) => {
  const res = await api.put(`/${id}`, data);
  return res.data;
};


// ==============================
// DELETE Budget
// ==============================
export const deleteBudget = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};