import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* Professional color palette */
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

function CategoryDonutChart({ transactions = [] }) {
  /* ======================
     FILTER ONLY EXPENSES
  ====================== */
  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  /* ======================
     GROUP BY CATEGORY
  ====================== */
  const categoryMap = {};

  expenses.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  const chartData = Object.keys(categoryMap).map(
    (category) => ({
      name: category,
      value: categoryMap[category],
    })
  );

  const totalExpense = expenses.reduce(
    (acc, t) => acc + t.amount,
    0
  );

  /* ======================
     UI
  ====================== */
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">

      <h3 className="font-semibold text-gray-700 mb-2">
        Expense by Category
      </h3>

      {chartData.length === 0 ? (
        <p className="text-gray-400 text-sm text-center">
          No expense data available
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${value.toLocaleString()}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="text-center -mt-40 mb-16">
            <p className="text-gray-400 text-sm">
              Total Expense
            </p>
            <p className="text-xl font-bold text-red-500">
              ₹{totalExpense.toLocaleString()}
            </p>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-sm mt-24">
            {chartData.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                ></div>
                <span className="text-gray-600">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default CategoryDonutChart;