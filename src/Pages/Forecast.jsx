import React, { useEffect, useState } from "react";
import axios from "axios";

const GOAL_API = "https://personal-finance-manager-backend-n06b.onrender.com/api/goals";

function Forecast() {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalForecast, setGoalForecast] = useState(null);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // ✅ Load goals
  const loadGoals = async () => {
    try {
      const res = await axios.get(GOAL_API, { headers });
      setGoals(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Forecast
  const handleGoalForecast = async () => {
    if (!selectedGoal) return alert("Select a goal");

    try {
      const res = await axios.get(
        `https://personal-finance-manager-backend-n06b.onrender.com/api/forecast/goal/${selectedGoal}`,
        { headers }
      );
      setGoalForecast(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">🎯 Goal Forecast</h2>

      {/* ✅ DROPDOWN */}
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
        <div className="mt-4 space-y-2">

          <p>
            💰 Monthly Savings: ₹{goalForecast.monthlySavings?.toFixed(2)}
          </p>

          <p>
            📅 Months Needed: {goalForecast.monthsNeeded}
          </p>

          <p>
            🏁 Completion Date:{" "}
            {goalForecast.estimatedCompletionDate
              ? new Date(
                  goalForecast.estimatedCompletionDate
                ).toLocaleDateString()
              : "N/A"}
          </p>

        </div>
      )}
    </div>
  );
}

export default Forecast;