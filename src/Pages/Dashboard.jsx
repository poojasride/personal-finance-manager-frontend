import React from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  Target,
} from "lucide-react";

import MonthlyChart from "../components/MonthlyChart";

function Dashboard() {
  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen  ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-semibold">
          Hi, Welcome Back 👋
        </h1>
        <p className="text-gray-500 text-sm">
          Here's an overview of your finances
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Wallet className="text-emerald-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Balance</p>
            <h2 className="text-lg font-semibold">₹ 82,000</h2>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <TrendingDown className="text-orange-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">This Month Expenses</p>
            <h2 className="text-lg font-semibold">₹ 18,000</h2>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <TrendingUp className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Income</p>
            <h2 className="text-lg font-semibold">₹ 25,000</h2>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <PiggyBank className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Remaining Budget</p>
            <h2 className="text-lg font-semibold">₹ 30,000</h2>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Budget Progress */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <Target size={32} />
              <div>
                <h3 className="font-semibold">
                  37% of Your Monthly Budget Spent
                </h3>
                <p className="text-sm opacity-90">Keep It Up!</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-3 mt-3">
              <div className="bg-yellow-300 h-3 rounded-full w-[37%]"></div>
            </div>

            <div className="flex justify-between text-sm mt-2">
              <span>₹18,000 spent</span>
              <span>₹30,000 budget</span>
            </div>
          </div>

          {/* Income Trend */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold mb-3">Income Trend</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Salary</span>
                <span className="font-semibold">₹11,500</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Dividends</span>
                <span className="font-semibold">₹7,000</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Other</span>
                <span className="font-semibold">₹6,500</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-2">
          <MonthlyChart />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-5 col-span-2">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>

          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="pb-2">Category</th>
                <th className="pb-2">Date</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              <tr className="border-t">
                <td className="py-2">Groceries</td>
                <td>Apr 23</td>
                <td className="text-right text-emerald-600">₹10,000</td>
              </tr>

              <tr className="border-t">
                <td className="py-2">Internet</td>
                <td>Apr 22</td>
                <td className="text-right text-emerald-600">₹1,000</td>
              </tr>

              <tr className="border-t">
                <td className="py-2">Electricity</td>
                <td>Apr 16</td>
                <td className="text-right text-emerald-600">₹3,500</td>
              </tr>

              <tr className="border-t">
                <td className="py-2">Rent</td>
                <td>May 1</td>
                <td className="text-right text-emerald-600">₹15,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Goals */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-4">Financial Goals</h3>

          {/* Goal */}
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Laptop</span>
              <span>₹50,000</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded mt-1">
              <div className="bg-emerald-500 h-2 rounded w-[40%]"></div>
            </div>
          </div>

          {/* Goal */}
          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span>Vacation</span>
              <span>₹35,000</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded mt-1">
              <div className="bg-emerald-500 h-2 rounded w-[40%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
