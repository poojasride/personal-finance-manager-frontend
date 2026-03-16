import axios from "axios";


const API_URL = "http://localhost:5000/api";
// const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api/goals";

export const getGoals = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createGoal = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateGoal = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteGoal = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

export const addSavingsToGoal = async (id, amount) => {
  const res = await axios.patch(`${API_URL}/${id}/add-savings`, {
    amount,
  });
  return res.data;
};