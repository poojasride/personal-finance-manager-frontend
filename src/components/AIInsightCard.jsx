import { useEffect, useState } from "react";
import { getAIInsight } from "../api/aiApi";

function AIInsightCard() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsight();
  }, []);

  const loadInsight = async () => {
    try {
      const data = await getAIInsight();
      setInsight(data.insight);
    } catch (error) {
      console.error("AI Insight error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm rounded-2xl p-6 flex items-start gap-4">

      {/* AI Icon */}
      <div className="text-3xl">🤖</div>

      {/* Content */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          AI Financial Insight
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          {loading
            ? "Analyzing your financial data..."
            : insight || "No insights available yet."}
        </p>
      </div>
    </div>
  );
}

export default AIInsightCard;7