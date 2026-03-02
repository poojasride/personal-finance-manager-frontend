import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  {
    name: "Jan",
    income: 40000,
    expense: 24000,
  },
  {
    name: "Feb",
    income: 30000,
    expense: 13980,
  },
  {
    name: "Mar",
    income: 50000,
    expense: 28000,
  },
  {
    name: "Apr",
    income: 47800,
    expense: 39000,
  },
  {
    name: "May",
    income: 58900,
    expense: 48000,
  },
  {
    name: "Jun",
    income: 63900,
    expense: 38000,
  },
];

function MonthlyChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-[300px]">
      
      <h3 className="font-semibold mb-4">Monthly Summary</h3>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="income"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="expense"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default MonthlyChart;