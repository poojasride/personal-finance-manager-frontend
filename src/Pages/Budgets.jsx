import React, { useEffect, useState } from "react";
import { getBudgets } from "../api/budgetApi";
import BudgetDonutChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

function Budgets() {
  const [budgets, setBudgets] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    limitAmount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const totalBudget = budgets.reduce(
    (acc, item) => acc + item.limitAmount,
    0
  );

  const totalSpent = budgets.reduce(
    (acc, item) => acc + (item.spent || 0),
    0
  );

  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-6 bg-gray-50 min-h-screen ">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Budget Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your budget professionally
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Budget
          </p>
          <h2 className="text-2xl font-bold mt-1">
            ₹{totalBudget}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Spent
          </p>
          <h2 className="text-2xl font-bold text-red-500 mt-1">
            ₹{totalSpent}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Remaining Budget
          </p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">
            ₹{remaining}
          </h2>
        </div>

      </div>

      {/* Chart + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      

        {/* Add Budget Form */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Add Budget
          </h3>

          <form className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">
                Category
              </label>

              <input
                name="category"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Food, Rent, Travel"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Amount
              </label>

              <input
                type="number"
                name="limitAmount"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Period
              </label>

              <select
                name="period"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="monthly">
                  Monthly
                </option>
                <option value="yearly">
                  Yearly
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-gray-600">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg mt-1"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Create Budget
            </button>

          </form>

        </div>

          {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Budget Overview
          </h3>

          <BudgetDonutChart budgets={budgets} />

        </div>

      </div>

      {/* Budget Table */}
      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-700">
            Budget List
          </h3>
        </div>

        <table className="w-full">

          <thead className="bg-gray-50 text-gray-500 text-sm">

            <tr>
              <th className="p-4 text-left">
                Category
              </th>
              <th className="p-4 text-left">
                Amount
              </th>
              <th className="p-4 text-left">
                Period
              </th>
              <th className="p-4 text-left">
                Start
              </th>
              <th className="p-4 text-left">
                End
              </th>
              <th className="p-4"></th>
            </tr>

          </thead>

          <tbody>

            {budgets.map((budget) => (

              <tr
                key={budget._id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4 font-medium">
                  {budget.category}
                </td>

                <td className="p-4">
                  ₹{budget.limitAmount}
                </td>

                <td className="p-4 capitalize">
                  {budget.period}
                </td>

                <td className="p-4">
                  {budget.startDate?.slice(0, 10)}
                </td>

                <td className="p-4">
                  {budget.endDate?.slice(0, 10)}
                </td>

                <td className="p-4">
                  <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" />
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Budgets;