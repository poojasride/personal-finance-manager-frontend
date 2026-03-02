import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";

function Analytics() {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">Total Balance</p>
              <h2 className="text-xl font-bold">₹45,000</h2>
            </div>
            <Wallet className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Income</p>
          <h2 className="text-xl font-bold text-green-600">₹25,000</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Expense</p>
          <h2 className="text-xl font-bold text-red-500">₹10,000</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500">Savings</p>
          <h2 className="text-xl font-bold text-blue-500">₹15,000</h2>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Expense Breakdown</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart here (Recharts)
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Income vs Expense</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Chart here
          </div>
        </div>

      </div>

    </div>
  );
}

export default Analytics;