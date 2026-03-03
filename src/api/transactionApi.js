import axios from "axios";

const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:5000/api/transactions",
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YTIzMjlkYWIzZjM5OGU2YTFjNTgwOCIsImlhdCI6MTc3MjUzNDg5MiwiZXhwIjoxNzcyNjIxMjkyfQ.MIGOAbshQX2DAag4ocPaMOtXPtfSaHS230CctctijdU`,
    "Content-Type": "application/json",
  },
});

export const getTransactions = async () => {
  const res = await api.get("/");
  return res.data;
};

export const createTransaction = async (data) => {
  const res = await api.post("/", data);
  return res.data;
};

export const deleteTransaction = async (id) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};