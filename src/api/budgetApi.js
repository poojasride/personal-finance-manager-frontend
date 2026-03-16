import axios from "axios";

const API_URL = "http://localhost:5000/api/budgets";
// const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api/budgets";

export const getBudgets = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createBudget = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// UPDATE budget 
export const updateBudget = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};


export const deleteBudget = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};