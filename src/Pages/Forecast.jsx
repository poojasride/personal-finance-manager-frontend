import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/forecast";

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [goalId, setGoalId] = useState("");
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
  // 🎯 GET GOAL FORECAST
  // =========================
  const handleGoalForecast = async () => {
    if (!goalId) return alert("Please enter Goal ID");

    try {
      const res = await axios.get(`${API}/goal/${goalId}`, {
        headers,
      });
      setGoalForecast(res.data);
    } catch (err) {
      console.log(err);
      alert("Goal not found or error occurred");
    }
  };

  useEffect(() => {
    loadForecast();
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
          <p>No data available</p>
        )}
      </div>

      {/* =======================
          💡 BACKEND SUGGESTION
      ======================== */}
      {forecast && (
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-2">💡 Suggestions</h3>
          <p
            className={`${
              forecast.monthlySavings < 0
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {forecast.suggestion}
          </p>
        </div>
      )}

      {/* =======================
          🎯 GOAL FORECAST
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
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          Calculate
        </button>

        {goalForecast && (
          <div className="mt-4 space-y-2">

            <p>
              💰 Monthly Savings:{" "}
              <span className="font-bold">
                ₹{goalForecast.monthlySavings?.toFixed(2)}
              </span>
            </p>

            <p>
              📅 Months Needed:{" "}
              <span className="font-bold">
                {goalForecast.monthsNeeded}
              </span>
            </p>

            <p>
              🏁 Completion Date:{" "}
              <span className="font-bold">
                {goalForecast.estimatedCompletionDate
                  ? new Date(
                      goalForecast.estimatedCompletionDate
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </p>

            {/* ⚠️ MESSAGE */}
            {goalForecast.message && (
              <p className="text-red-500">
                {goalForecast.message}
              </p>
            )}

            {/* 💡 SUGGESTION */}
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