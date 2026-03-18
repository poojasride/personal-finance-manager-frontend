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
        0
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

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="mb-4 flex items-center gap-2 font-semibold">
            <Target size={18} /> Monthly Budget
          </h3>

          {!hasBudget ? (
            <p className="text-gray-400">No budget set</p>
          ) : (
            <>
              <p>Spent: ₹ {expenses.toLocaleString()}</p>
              <p>Budget: ₹ {monthlyBudget.toLocaleString()}</p>
              <p>Remaining: ₹ {remainingBudget.toLocaleString()}</p>

              {/* PROGRESS BAR */}
              <div className="w-full bg-gray-200 h-3 mt-4 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    budgetPercent > 80
                      ? "bg-red-500"
                      : budgetPercent > 50
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${budgetPercent}%` }}
                />
              </div>

              {isOverBudget && (
                <p className="text-red-500 mt-2 text-sm">
                  ⚠️ Budget exceeded!
                </p>
              )}
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