import React, { useEffect, useState } from "react";
import axios from "axios";

const API =
  "https://personal-finance-manager-backend-n06b.onrender.com/api/forecast";

const GOAL_API =
  "https://personal-finance-manager-backend-n06b.onrender.com/api/goals";

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [goals, setGoals] = useState([]); // ✅ store goals
  const [selectedGoal, setSelectedGoal] = useState(""); // ✅ selected goal id
  const [goalForecast, setGoalForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // =========================
  // 📊 GET FINANCIAL FORECAST
  // =========================
  const loadForecast = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API, { headers });
      setForecast(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🎯 GET ALL GOALS
  // =========================
  const loadGoals = async () => {
    try {
      const res = await axios.get(GOAL_API, { headers });
      setGoals(res.data); // ✅ fill dropdown
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // 🎯 GET GOAL FORECAST
  // =========================
  const handleGoalForecast = async () => {
    if (!selectedGoal) return alert("Please select a goal");

    try {
      const res = await axios.get(`${API}/goal/${selectedGoal}`, {
        headers,
      });
      setGoalForecast(res.data);
    } catch (err) {
      console.log(err);
      alert("Goal not found or error occurred");
    }
  };

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    loadForecast();
    loadGoals(); // ✅ load goals here
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* =======================
          📊 FINANCIAL OVERVIEW
      ======================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">📊 Financial Forecast</h2>

        {loading ? (
          <p>Loading...</p>
        ) : forecast ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <p>Avg Income</p>
              <h3 className="text-green-600">
                ₹{forecast.avgIncome.toFixed(2)}
              </h3>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <p>Avg Expense</p>
              <h3 className="text-red-600">
                ₹{forecast.avgExpense.toFixed(2)}
              </h3>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <p>Monthly Savings</p>
              <h3 className="text-blue-600">
                ₹{forecast.monthlySavings.toFixed(2)}
              </h3>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg">
              <p>Yearly Projection</p>
              <h3 className="text-purple-600">
                ₹{forecast.projectedYearlySavings.toFixed(2)}
              </h3>
            </div>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* =======================
          💡 SUGGESTION
      ======================== */}
      {forecast && (
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3>💡 Suggestions</h3>
          <p
            className={
              forecast.monthlySavings < 0 ? "text-red-600" : "text-green-600"
            }
          >
            {forecast.suggestion}
          </p>
        </div>
      )}

      {/* =======================
          🎯 GOAL FORECAST
      ======================== */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-lg font-bold">🎯 Goal Forecast</h2>

        <select
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}
          className="border p-2 rounded-lg w-full"
        >
          <option value="">Select Goal</option>

          {goals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.title} (₹{goal.targetAmount})
            </option>
          ))}
        </select>

        <button
          onClick={handleGoalForecast}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Calculate
        </button>

        {/* RESULT */}
        {goalForecast && (
          <div className="space-y-2">
            <p>
              💰 Monthly Savings: ₹
              {goalForecast.monthlySavings?.toFixed(2)}
            </p>

            <p>📅 Months Needed: {goalForecast.monthsNeeded}</p>

            <p>
              🏁 Completion Date:{" "}
              {goalForecast.estimatedCompletionDate
                ? new Date(
                    goalForecast.estimatedCompletionDate
                  ).toLocaleDateString()
                : "N/A"}
            </p>

            {goalForecast.message && (
              <p className="text-red-500">{goalForecast.message}</p>
            )}

            {goalForecast.suggestion && (
              <p className="text-blue-600">
                💡 {goalForecast.suggestion}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Forecast;