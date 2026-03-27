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

const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/reports";

const COLORS = ["#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6"];

function Report() {
  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // =====================
  // LOAD DATA
  // =====================
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

      // format trend
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* =========================
          📊 SUMMARY CARDS
      ========================= */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Income</p>
          <h2 className="text-2xl font-bold text-green-600">
            ₹{summary.totalIncome || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Total Expense</p>
          <h2 className="text-2xl font-bold text-red-600">
            ₹{summary.totalExpense || 0}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <p className="text-gray-500">Savings</p>
          <h2 className="text-2xl font-bold text-blue-600">
            ₹{summary.savings || 0}
          </h2>
        </div>
      </div>

      {/* =========================
          📊 CHARTS
      ========================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Expense by Category</h3>

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

        {/* LINE CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4">Monthly Expense Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* =========================
          💡 STATUS
      ========================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Financial Status</h3>

        <p
          className={`text-lg font-bold ${
            summary.status === "Loss ⚠️"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {summary.status}
        </p>
      </div>

      {loading && <p className="text-center">Loading...</p>}
    </div>
  );
}

export default Report;