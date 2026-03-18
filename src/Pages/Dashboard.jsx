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
import { getBudgets } from "../api/budgetApi";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [txnRes, budgetRes] = await Promise.all([
        getTransactions(),
        getBudgets(),
      ]);

      const txnData = txnRes || [];
      const budgetData = budgetRes || [];

      setTransactions(txnData);

      const now = new Date();

      const currentBudgets = budgetData.filter((b) => {
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);
        return now >= start && now <= end;
      });

      const totalBudget = currentBudgets.reduce(
        (acc, curr) => acc + Number(curr.limitAmount || 0),
        0,
      );

      setMonthlyBudget(totalBudget);
    } catch (error) {
      console.error("Error loading dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const totalBalance = income - expenses;

  const hasBudget = monthlyBudget > 0;
  const remainingBudget = hasBudget ? monthlyBudget - expenses : 0;
  const isOverBudget = hasBudget && expenses > monthlyBudget;

  const budgetPercent = hasBudget
    ? Math.min((expenses / monthlyBudget) * 100, 100)
    : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* HEADER */}
      <div className="flex justify-between mb-10 items-center">
        <h1 className="text-3xl font-bold">Finance Dashboard</h1>
        <div className="text-gray-500">{new Date().toDateString()}</div>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {/* TOTAL BALANCE */}
        <div className="bg-green-500 text-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p>Total Balance</p>
            <h2 className="text-xl font-bold">
              ₹ {totalBalance.toLocaleString()}
            </h2>
          </div>
          <Wallet size={40} />
        </div>

        {/* EXPENSE */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p>Expenses</p>
            <h2 className="text-lg font-semibold">
              ₹ {expenses.toLocaleString()}
            </h2>
          </div>
          <TrendingDown className="text-red-500" size={36} />
        </div>

        {/* INCOME */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
            <p>Income</p>
            <h2 className="text-lg font-semibold">
              ₹ {income.toLocaleString()}
            </h2>
          </div>
          <TrendingUp className="text-green-500" size={36} />
        </div>

        {/* BUDGET */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
          <div>
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
          <PiggyBank size={36} className="text-purple-500" />
        </div>
      </div>

      {/* CHART + BUDGET */}
      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <TrendingUp size={18} /> Monthly Overview
          </h3>
          <MonthlyChart transactions={transactions} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              <h3 className="font-semibold text-lg">Monthly Budget</h3>
            </div>

            {hasBudget && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  isOverBudget
                    ? "bg-red-100 text-red-600"
                    : budgetPercent > 70
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-green-100 text-green-600"
                }`}
              >
                {isOverBudget
                  ? "Over Budget"
                  : budgetPercent > 70
                    ? "Warning"
                    : "On Track"}
              </span>
            )}
          </div>

          {/* NO BUDGET */}
          {!hasBudget ? (
            <div className="text-center py-10 text-gray-400">
              <PiggyBank size={40} className="mx-auto mb-2" />
              <p>No budget set</p>
            </div>
          ) : (
            <>
              {/* TOP NUMBERS */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Spent</p>
                  <h2 className="font-bold text-lg">
                    ₹ {expenses.toLocaleString()}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <h2 className="font-bold text-lg">
                    ₹ {monthlyBudget.toLocaleString()}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Remaining</p>
                  <h2
                    className={`font-bold text-lg ${
                      isOverBudget ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹ {remainingBudget.toLocaleString()}
                  </h2>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage</span>
                  <span>{Math.round(budgetPercent)}%</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      budgetPercent > 80
                        ? "bg-gradient-to-r from-red-400 to-red-600"
                        : budgetPercent > 50
                          ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                          : "bg-gradient-to-r from-green-400 to-green-600"
                    }`}
                    style={{ width: `${budgetPercent}%` }}
                  />
                </div>
              </div>

              {/* FOOTER INFO */}
              <div className="flex justify-between text-sm mt-3">
                <p className="text-gray-500">
                  Daily avg: ₹{" "}
                  {Math.round(expenses / new Date().getDate()).toLocaleString()}
                </p>

                {isOverBudget && (
                  <p className="text-red-500 font-medium">⚠ Budget exceeded</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="mb-4 font-semibold">Recent Transactions</h3>

        {recentTransactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <table className="w-full">
            <thead className="text-gray-500 text-sm">
              <tr>
                <th className="text-left pb-2">Category</th>
                <th className="text-left pb-2">Date</th>
                <th className="text-right pb-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.map((t) => (
                <tr
                  key={t._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-2">{t.category}</td>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td
                    className={`text-right font-medium ${
                      t.type === "income" ? "text-green-600" : "text-red-500"
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
