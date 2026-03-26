import axios from "axios";

// const API_URL = "http://localhost:5000/api/goals";
const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api/goals";

// ✅ axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ==============================
// GET Goals
// ==============================
export const getGoals = async () => {
  const res = await api.get("/");
  return res.data;
};


// ==============================
// CREATE Goal
// ==============================
export const createGoal = async (data) => {
  const res = await api.post("/", data);
  return res.data;
};


// ==============================
// UPDATE Goal
// ==============================
export const updateGoal = async (id, data) => {
  const res = await api.put(`/${id}`, data);
  return res.data;
};


// ==============================
// DELETE Goal
// ==============================
export const deleteGoal = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};


// ==============================
// ADD Savings to Goal
// ==============================
export const addSavingsToGoal = async (id, amount) => {
  const res = await api.patch(`/${id}/add`, {
    amount,
  });
  return res.data;
};