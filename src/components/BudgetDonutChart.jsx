import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Spent", value: 18000 },
  { name: "Remaining", value: 12000 },
];

const COLORS = ["#10b981", "#e5e7eb"];

function BudgetDonutChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="text-center mt-2">
        <p className="font-semibold">₹18,000 spent</p>
      </div>
    </div>
  );
}

export default BudgetDonutChart;