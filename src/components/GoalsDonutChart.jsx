import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function GoalsDonutChart({ goals = [] }) {

  /* ===============================
     CALCULATIONS
  =============================== */

  const {
    totalTarget,
    totalSaved,
    remainingAmount,
    savedPercentage,
    completedGoals,
    activeGoals,
  } = useMemo(() => {
    const totalTarget = goals.reduce(
      (sum, goal) => sum + (goal.targetAmount || 0),
      0
    );

    const totalSaved = goals.reduce(
      (sum, goal) => sum + (goal.savedAmount || 0),
      0
    );

    const remainingAmount = totalTarget - totalSaved;

    const savedPercentage =
      totalTarget > 0
        ? ((totalSaved / totalTarget) * 100).toFixed(1)
        : 0;

    const completedGoals = goals.filter(
      (goal) => goal.status === "completed"
    ).length;

    const activeGoals = goals.length - completedGoals;

    return {
      totalTarget,
      totalSaved,
      remainingAmount,
      savedPercentage,
      completedGoals,
      activeGoals,
    };
  }, [goals]);

  const chartData = [
    { name: "Saved", value: totalSaved },
    { name: "Remaining", value: remainingAmount > 0 ? remainingAmount : 0 },
  ];

  const formatCurrency = (amount) =>
    `₹${amount.toLocaleString()}`;

  /* ===============================
     EMPTY STATE
  =============================== */

  if (goals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-72 flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          No goals available. Add a goal to see analytics.
        </p>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Goals Analytics
        </h3>
        <p className="text-lg font-semibold text-gray-800">
          Overall Savings Progress
        </p>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="goalGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4f46e5" />
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
              <Cell fill="url(#goalGradient)" />
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
            Total Target
          </p>
          <p className="text-2xl font-bold text-gray-800">
            {formatCurrency(totalTarget)}
          </p>
          <p className="text-sm text-indigo-600 font-medium mt-1">
            {savedPercentage}% Achieved
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-100"></div>

      {/* Breakdown Section */}
      <div className="space-y-4 text-sm">

        {/* Saved */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Saved</span>
            <span className="font-medium text-indigo-600">
              {formatCurrency(totalSaved)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${savedPercentage}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-gray-700">
              {formatCurrency(remainingAmount > 0 ? remainingAmount : 0)}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full">
            <div
              className="h-2 bg-gray-300 rounded-full transition-all duration-700"
              style={{ width: `${100 - savedPercentage}%` }}
            />
          </div>
        </div>

      </div>

      {/* Footer Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">

        <div className="bg-indigo-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">Active Goals</p>
          <p className="text-lg font-semibold text-indigo-600">
            {activeGoals}
          </p>
        </div>

        <div className="bg-emerald-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">Completed Goals</p>
          <p className="text-lg font-semibold text-emerald-600">
            {completedGoals}
          </p>
        </div>

      </div>

    </div>
  );
}

export default GoalsDonutChart;