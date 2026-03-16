import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Target,
} from "lucide-react";

import MonthlyChart from "../components/MonthlyChart";
import { getTransactions } from "../api/transactionApi";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const monthlyBudget = 0;

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (error) {
      console.error("Error loading transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = income - expenses;

  const budgetPercent = Math.min((expenses / monthlyBudget) * 100, 100).toFixed(
    0,
  );

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Finance Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track your financial activity
          </p>
        </div>

        <div className="bg-white border px-5 py-2 rounded-xl shadow-sm text-sm text-gray-600">
          {new Date().toDateString()}
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* Balance */}

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <h2 className="text-2xl font-bold mt-1">
                ₹ {totalBalance.toLocaleString()}
              </h2>
            </div>

            <div className="bg-white/20 p-3 rounded-lg">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        {/* Expenses */}

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Expenses</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
                ₹ {expenses.toLocaleString()}
              </h2>
            </div>

            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="text-red-500" size={20} />
            </div>
          </div>
        </div>

        {/* Income */}

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Income</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
                ₹ {income.toLocaleString()}
              </h2>
            </div>

            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="text-green-500" size={20} />
            </div>
          </div>
        </div>

        {/* Remaining */}

        <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Remaining Budget</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">
              ₹ {Math.abs(monthlyBudget - expenses).toLocaleString()}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg">
              <PiggyBank className="text-blue-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart + Budget */}

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        {/* Chart */}

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-5">Monthly Overview</h3>

          <MonthlyChart transactions={transactions} />
        </div>

        {/* Budget Card */}

        <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <Target className="text-emerald-500" size={20} />
              <h3 className="font-semibold text-gray-700">Monthly Budget</h3>
            </div>

            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
              {budgetPercent}% used
            </span>
          </div>

          <div className="grid grid-cols-3 text-center mb-5">
            <div>
              <p className="text-xs text-gray-500">Spent</p>
              <p className="text-red-500 font-semibold">
                ₹ {expenses.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Budget</p>
              <p className="font-semibold">
                ₹ {monthlyBudget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-emerald-600 font-semibold">
                ₹ {(monthlyBudget - expenses).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                budgetPercent > 80
                  ? "bg-red-500"
                  : budgetPercent > 50
                    ? "bg-yellow-400"
                    : "bg-emerald-500"
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transactions */}

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h3 className="font-semibold text-gray-700 mb-6">
          Recent Transactions
        </h3>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="text-left py-3">Category</th>
              <th className="text-left">Date</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.map((t) => (
              <tr key={t._id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3">{t.category}</td>

                <td>{new Date(t.date).toLocaleDateString()}</td>

                <td
                  className={`text-right font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ₹ {t.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recentTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
