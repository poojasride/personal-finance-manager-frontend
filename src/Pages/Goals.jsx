import React, { useEffect, useState } from "react";
import { getBudgets } from "../api/budgetApi";
import GoalChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

function Goals() {
  const [goals, setGoals] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    category: "General",
    deadline: "",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getBudgets();
      setGoals(data);
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

  // summary calculations
  const totalGoals = goals.length;

  const totalTarget = goals.reduce(
    (acc, goal) => acc + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (acc, goal) => acc + goal.savedAmount,
    0
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Goals Dashboard
        </h1>

        <p className="text-gray-500">
          Track and manage your financial goals
        </p>

      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Goals
          </p>
          <h2 className="text-2xl font-bold">
            {totalGoals}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Saved
          </p>
          <h2 className="text-2xl font-bold text-emerald-600">
            ₹{totalSaved}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Completed Goals
          </p>
          <h2 className="text-2xl font-bold text-blue-600">
            {completedGoals}
          </h2>
        </div>

      </div>

      {/* Chart + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

      

        {/* Add Goal Form */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Add New Goal
          </h3>

          <form className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">
                Goal Title
              </label>

              <input
                name="title"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Buy Car, House, Vacation"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Target Amount
              </label>

              <input
                type="number"
                name="targetAmount"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1"
                placeholder="500000"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Saved Amount
              </label>

              <input
                type="number"
                name="savedAmount"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Category
              </label>

              <input
                name="category"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1"
                placeholder="Car, House, Travel"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Deadline
              </label>

              <input
                type="date"
                name="deadline"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-1"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Goal
            </button>

          </form>

        </div>

          {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Goals Progress Overview
          </h3>

          <GoalChart goals={goals} />

        </div>

      </div>

      {/* Goals Table */}
      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-700">
            Goals List
          </h3>
        </div>

        <table className="w-full">

          <thead className="bg-gray-50 text-gray-500 text-sm">

            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Target</th>
              <th className="p-4 text-left">Saved</th>
              <th className="p-4 text-left">Progress</th>
              <th className="p-4 text-left">Deadline</th>
              <th className="p-4 text-left">Status</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {goals.map((goal) => {

              const percent =
                (goal.savedAmount / goal.targetAmount) * 100;

              return (

                <tr
                  key={goal._id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {goal.title}
                  </td>

                  <td className="p-4">
                    {goal.category}
                  </td>

                  <td className="p-4">
                    ₹{goal.targetAmount}
                  </td>

                  <td className="p-4">
                    ₹{goal.savedAmount}
                  </td>

                  <td className="p-4 w-48">

                    <div className="w-full bg-gray-200 h-2 rounded">

                      <div
                        className="bg-blue-500 h-2 rounded"
                        style={{ width: `${percent}%` }}
                      />

                    </div>

                    <span className="text-xs text-gray-500">
                      {percent.toFixed(0)}%
                    </span>

                  </td>

                  <td className="p-4">
                    {goal.deadline?.slice(0, 10)}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        goal.status === "completed"
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >

                      {goal.status}

                    </span>

                  </td>

                  <td className="p-4">
                    <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" />
                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Goals;