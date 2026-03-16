import React, { useEffect, useState, useMemo } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getTransactions } from "../api/transactionApi";

const COLORS = ["#ef4444", "#f59e0b", "#6366f1", "#10b981", "#3b82f6"];

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getTransactions();
      setTransactions(res || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CALCULATIONS
  =============================== */

  const {
    totalIncome,
    totalExpense,
    totalBalance,
    totalSavings,
    expenseByCategory,
    monthlyData,
  } = useMemo(() => {
    const incomeTx = transactions.filter((t) => t.type === "income");
    const expenseTx = transactions.filter((t) => t.type === "expense");

    const totalIncome = incomeTx.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTx.reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = totalIncome - totalExpense;
    const totalSavings = totalBalance;

    // Expense by category
    const categoryMap = {};
    expenseTx.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

    const expenseByCategory = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    // Monthly Income vs Expense
    const monthlyMap = {};
    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });

      if (!monthlyMap[month])
        monthlyMap[month] = { month, income: 0, expense: 0 };

      if (t.type === "income") monthlyMap[month].income += t.amount;
      else monthlyMap[month].expense += t.amount;
    });

    const monthlyData = Object.values(monthlyMap);

    return {
      totalIncome,
      totalExpense,
      totalBalance,
      totalSavings,
      expenseByCategory,
      monthlyData,
    };
  }, [transactions]);

  const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Financial Analytics
        </h1>
        <p className="text-gray-500 text-sm">
          Deep insights into your income & spending behavior
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={<Wallet />}
          color="emerald"
        />

        <KpiCard
          title="Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp />}
          color="green"
        />

        <KpiCard
          title="Expense"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown />}
          color="red"
        />

        <KpiCard
          title="Savings"
          value={formatCurrency(totalSavings)}
          icon={<DollarSign />}
          color="blue"
        />
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Breakdown Donut */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-semibold mb-4 text-gray-700">
            Expense Breakdown
          </h2>

          {expenseByCategory.length === 0 ? (
            <p className="text-gray-400 text-sm">No expense data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  dataKey="value"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Legend */}
          <div className="grid grid-cols-4 gap-3 text-sm mt-24">
            {expenseByCategory.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                ></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Income vs Expense Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
          <h2 className="font-semibold mb-4 text-gray-700">
            Income vs Expense
          </h2>

          {monthlyData.length === 0 ? (
            <p className="text-gray-400 text-sm">No monthly data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

/* =========================
   KPI CARD COMPONENT
========================= */

function KpiCard({ title, value, icon, color }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-2xl font-bold mt-1">{value}</h2>
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
