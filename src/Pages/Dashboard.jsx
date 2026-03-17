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
import { getBudget } from "../api/budgetApi"; // ✅ NEW
import { data } from "react-router-dom";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0); // ✅ from API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Load both data
  const loadData = async () => {
    try {
      const [txnRes, budgetRes] = await Promise.all([
        getTransactions(),
        getBudget(),
      ]);

      setTransactions(txnRes?.data || txnRes || []);
      setMonthlyBudget(budgetRes?.data.limitAmount || 0); // ✅ important
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalBalance = income - expenses;

  // ✅ Budget logic
  const hasBudget = monthlyBudget > 0;

  const remainingBudget = hasBudget
    ? Math.max(monthlyBudget - expenses, 0)
    : 0;

  const isOverBudget = hasBudget && expenses > monthlyBudget;

  const budgetPercent = hasBudget
    ? Math.min((expenses / monthlyBudget) * 100, 100).toFixed(0)
    : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header */}
      <div className="flex justify-between mb-10">
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <div>{new Date().toDateString()}</div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">

        {/* Balance */}
        <div className="bg-green-500 text-white p-6 rounded-xl">
          <p>Total Balance</p>
          <h2>₹ {totalBalance.toLocaleString()}</h2>
        </div>

        {/* Expense */}
        <div className="bg-white p-6 rounded-xl border">
          <p>Expenses</p>
          <h2>₹ {expenses.toLocaleString()}</h2>
        </div>

        {/* Income */}
        <div className="bg-white p-6 rounded-xl border">
          <p>Income</p>
          <h2>₹ {income.toLocaleString()}</h2>
        </div>

        {/* Remaining */}
        <div className="bg-white p-6 rounded-xl border">
          <p>Remaining Budget</p>

          {!hasBudget ? (
            <p className="text-gray-400">No budget set</p>
          ) : (
            <p
              className={`font-semibold ${
                isOverBudget ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹ {remainingBudget.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Chart + Budget */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border">
          <h3>Monthly Overview</h3>
          <MonthlyChart transactions={transactions} />
        </div>

        {/* Budget */}
        <div className="bg-white p-6 rounded-xl border">

          <h3 className="mb-4">Monthly Budget</h3>

          {!hasBudget ? (
            <p className="text-gray-400">No budget set</p>
          ) : (
            <>
              <p>Spent: ₹ {expenses.toLocaleString()}</p>
              <p>Budget: ₹ {monthlyBudget.toLocaleString()}</p>
              <p>Remaining: ₹ {remainingBudget.toLocaleString()}</p>

              <div className="w-full bg-gray-200 h-3 mt-4 rounded">
                <div
                  className={`h-3 rounded ${
                    budgetPercent > 80
                      ? "bg-red-500"
                      : budgetPercent > 50
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white p-6 rounded-xl border">
        <h3 className="mb-4">Recent Transactions</h3>

        {recentTransactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th>Category</th>
                <th>Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t._id}>
                  <td>{t.category}</td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td
                    className={`text-right ${
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    ₹ {Number(t.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;