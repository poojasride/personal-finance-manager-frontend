import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/forecast";

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [goalId, setGoalId] = useState("");
  const [goalForecast, setGoalForecast] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // =========================
  // GET FINANCIAL FORECAST
  // =========================
  const loadForecast = async () => {
    try {
      const res = await axios.get(API, { headers });
      setForecast(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // GET GOAL FORECAST
  // =========================
  const handleGoalForecast = async () => {
    try {
      const res = await axios.get(`${API}/goal/${goalId}`, {
        headers,
      });
      setGoalForecast(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* =======================
          FINANCIAL OVERVIEW
      ======================== */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">📊 Financial Forecast</h2>

        {forecast ? (
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-gray-600">Avg Income</p>
              <h3 className="text-xl font-bold text-green-600">
                ₹{forecast.avgIncome.toFixed(2)}
              </h3>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-gray-600">Avg Expense</p>
              <h3 className="text-xl font-bold text-red-600">
                ₹{forecast.avgExpense.toFixed(2)}
              </h3>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-gray-600">Monthly Savings</p>
              <h3 className="text-xl font-bold text-blue-600">
                ₹{forecast.monthlySavings.toFixed(2)}
              </h3>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg">
              <p className="text-gray-600">Yearly Projection</p>
              <h3 className="text-xl font-bold text-purple-600">
                ₹{forecast.projectedYearlySavings.toFixed(2)}
              </h3>
            </div>

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>


      {/* =======================
          SUGGESTIONS
      ======================== */}
      {forecast && (
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">💡 Suggestions</h3>

          {forecast.monthlySavings < 0 ? (
            <p className="text-red-600">
              ⚠️ You are overspending. Try reducing expenses.
            </p>
          ) : forecast.monthlySavings < 5000 ? (
            <p className="text-orange-600">
              ⚠️ Savings are low. Increase income or cut expenses.
            </p>
          ) : (
            <p className="text-green-600">
              ✅ Good job! Your savings are healthy.
            </p>
          )}
        </div>
      )}


      {/* =======================
          GOAL FORECAST
      ======================== */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-bold">🎯 Goal Forecast</h2>

        <input
          type="text"
          placeholder="Enter Goal ID"
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />

        <button
          onClick={handleGoalForecast}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
        >
          Calculate
        </button>

        {goalForecast && (
          <div className="mt-4 space-y-2">

            <p>
              📅 Months Needed:{" "}
              <span className="font-bold">
                {goalForecast.monthsNeeded}
              </span>
            </p>

            <p>
              🏁 Completion Date:{" "}
              <span className="font-bold">
                {new Date(
                  goalForecast.estimatedCompletionDate
                ).toLocaleDateString()}
              </span>
            </p>

          </div>
        )}
      </div>

    </div>
  );
}

export default Forecast;