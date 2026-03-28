import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/reports";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"];

export default function Report() {
  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadData = async () => {
    try {
      setLoading(true);

      const [summaryRes, categoryRes, trendRes] = await Promise.all([
        axios.get(`${API}/summary`, { headers }),
        axios.get(`${API}/expense-category`, { headers }),
        axios.get(`${API}/monthly-trend`, { headers }),
      ]);

      setSummary(summaryRes.data);
      setCategoryData(categoryRes.data);

      const formattedTrend = trendRes.data.map((item) => ({
        name: `${item._id.month}/${item._id.year}`,
        total: item.total,
      }));

      setTrendData(formattedTrend);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">📊 Financial Reports</h1>
        <button
          onClick={loadData}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card
          title="Total Income"
          value={summary.totalIncome}
          color="text-green-600"
          icon={<TrendingUp />}
        />

        <Card
          title="Total Expense"
          value={summary.totalExpense}
          color="text-red-600"
          icon={<TrendingDown />}
        />

        <Card
          title="Savings"
          value={summary.savings}
          color="text-blue-600"
          icon={<Wallet />}
        />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* PIE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-4">Expense by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="total"
                nameKey="_id"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE */}
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* STATUS */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-2">Financial Status</h3>

        <p
          className={`text-2xl font-bold ${
            summary.status === "Loss ⚠️"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {summary.status || "No Data"}
        </p>
      </div>

      {loading && (
        <div className="text-center text-gray-600 animate-pulse">
          Loading dashboard...
        </div>
      )}
    </div>
  );
}

// REUSABLE CARD
function Card({ title, value, color, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition transform">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-500">{title}</p>
        <div className="text-gray-400">{icon}</div>
      </div>

      <h2 className={`text-3xl font-bold ${color}`}>
        ₹{value || 0}
      </h2>
    </div>
  );
}
