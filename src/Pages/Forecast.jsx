import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/forecast";

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [goalId, setGoalId] = useState("");
  const [goalForecast, setGoalForecast] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ FIX: Check token
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  // =========================
  // GET FINANCIAL FORECAST
  // =========================
  const loadForecast = async () => {
    try {
      const res = await axios.get(API, { headers });
      console.log("Forecast API:", res.data); // 🔍 debug
      setForecast(res.data);
    } catch (err) {
      console.error("Forecast Error:", err.response?.data || err.message);
    }
  };

  // =========================
  // GET GOAL FORECAST
  // =========================
  const handleGoalForecast = async () => {
    if (!goalId) {
      alert("Enter Goal ID");
      return;
    }

    try {
      const res = await axios.get(`${API}/goal/${goalId}`, { headers });
      setGoalForecast(res.data);
    } catch (err) {
      console.error("Goal Forecast Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div className="p-6 space-y-6">

      {/* FINANCIAL FORECAST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">📊 Financial Forecast</h2>

        {forecast ? (
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-green-100 p-4 rounded-lg">
              <p>Avg Income</p>
              <h3>
                ₹{forecast?.avgIncome?.toFixed(2) || 0}
              </h3>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <p>Avg Expense</p>
              <h3>
                ₹{forecast?.avgExpense?.toFixed(2) || 0}
              </h3>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg">
              <p>Monthly Savings</p>
              <h3>
                ₹{forecast?.monthlySavings?.toFixed(2) || 0}
              </h3>
            </div>

            <div className="bg-purple-100 p-4 rounded-lg">
              <p>Yearly Projection</p>
              <h3>
                ₹{forecast?.projectedYearlySavings?.toFixed(2) || 0}
              </h3>
            </div>

          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {/* SUGGESTIONS */}
      {forecast && (
        <div className="bg-yellow-50 p-4 rounded-xl">
          <h3>💡 Suggestions</h3>

          {forecast.monthlySavings < 0 ? (
            <p>⚠️ Overspending</p>
          ) : forecast.monthlySavings < 5000 ? (
            <p>⚠️ Low savings</p>
          ) : (
            <p>✅ Good savings</p>
          )}
        </div>
      )}

      {/* GOAL FORECAST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2>🎯 Goal Forecast</h2>

        <input
          type="text"
          placeholder="Enter Goal ID"
          value={goalId}
          onChange={(e) => setGoalId(e.target.value)}
          className="border p-2 w-full"
        />

        <button onClick={handleGoalForecast}>
          Calculate
        </button>

        {goalForecast && (
          <div>
            <p>Months: {goalForecast.monthsNeeded}</p>
            <p>
              Date:{" "}
              {new Date(
                goalForecast.estimatedCompletionDate
              ).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Forecast;