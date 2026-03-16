import React, { useEffect, useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { getBudgets } from "../api/budgetApi";

const COLORS = ["#10b981", "#e5e7eb"]; // Spent / Remaining

function BudgetDonutChart() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await getBudgets();
      setBudgets(res || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     CALCULATIONS
  =============================== */

  const { totalSpent, totalRemaining, totalBudget, spentPercentage } =
    useMemo(() => {
      const totalSpent = budgets.reduce(
        (sum, item) => sum + (item.spent || 0),
        0
      );

      const totalRemaining = budgets.reduce(
        (sum, item) => sum + (item.remaining || 0),
        0
      );

      const totalBudget = totalSpent + totalRemaining;

      const spentPercentage =
        totalBudget > 0
          ? ((totalSpent / totalBudget) * 100).toFixed(1)
          : 0;

      return {
        totalSpent,
        totalRemaining,
        totalBudget,
        spentPercentage,
      };
    }, [budgets]);

  const chartData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: totalRemaining },
  ];

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString()}`;

  /* ===============================
     UI
  =============================== */

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-400 text-sm animate-pulse">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

      {/* Header */}
      <div className="mb-4">
       
        <p className="text-lg font-semibold text-gray-800">
          Overall Spending Overview
        </p>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="spentGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={75}
              outerRadius={95}
              paddingAngle={4}
              stroke="none"
              isAnimationActive
            >
              <Cell fill="url(#spentGradient)" />
              <Cell fill="#e5e7eb" />
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Total Budget
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalBudget)}
          </p>
          <p className="text-sm text-emerald-600 font-medium mt-1">
            {spentPercentage}% Spent
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-100"></div>

      {/* Detailed Legend Section */}
      <div className="space-y-4 text-sm">

        {/* Spent */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Spent</span>
            <span className="font-medium text-emerald-600">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-gray-700">
              {formatCurrency(totalRemaining)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-gray-300 rounded-full transition-all duration-700"
              style={{ width: `${100 - spentPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Empty State */}
      {totalBudget === 0 && (
        <div className="mt-6 text-center text-gray-400 text-sm">
          No budget data available.
        </div>
      )}

    </div>
  );
}

export default BudgetDonutChart;