import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import axios from "axios";

function MonthlyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const API_URL = "http://localhost:5000/api";
      // const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api";

      const res = await axios.get(`${API_URL}/transactions`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log( "Monthly chart jsx transaction",res.data)

      const transactions = res.data;

      const monthlyData = {};

      transactions.forEach((t) => {
        const month = new Date(t.date).toLocaleString("default", {
          month: "short",
        });

        if (!monthlyData[month]) {
          monthlyData[month] = {
            name: month,
            income: 0,
            expense: 0,
          };
        }

        if (t.type === "income") {
          monthlyData[month].income += t.amount;
        } else {
          monthlyData[month].expense += t.amount;
        }
      });

      setData(Object.values(monthlyData));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-[300px]">
      <h3 className="font-semibold mb-4">Monthly Summary</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />

          <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyChart;
