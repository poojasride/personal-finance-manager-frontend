import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getBudgets } from "../api/budgetApi";

const COLORS = ["#10b981", "#e5e7eb"];

function BudgetDonutChart() {
  const [budgets, setBudgets] = useState([]);

  // Load budgets
  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await getBudgets();
      setBudgets(res);
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate totals from API response
  const totalSpent = budgets.reduce(
    (sum, item) => sum + (item.spent || 0),
    0
  );

  const totalRemaining = budgets.reduce(
    (sum, item) => sum + (item.remaining || 0),
    0
  );

  const totalBudget = totalSpent + totalRemaining;

  // Chart data format required by recharts
  const chartData = [
    { name: "Spent", value: totalSpent },
    { name: "Remaining", value: totalRemaining },
  ];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={3}
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>

          <Tooltip formatter={(value) => `₹${value}`} />

        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="text-center -mt-28 mb-10">
        <p className="text-gray-400 text-sm">Total Budget</p>
        <p className="text-xl font-bold">
          ₹{totalBudget.toLocaleString()}
        </p>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          Spent ₹{totalSpent}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          Remaining ₹{totalRemaining}
        </div>

      </div>

    </div>
  );
}

export default BudgetDonutChart;