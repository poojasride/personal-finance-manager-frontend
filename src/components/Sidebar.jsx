import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  TrendingUp,
  Repeat,
  Tags,
  PlusCircle,
  Download,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Active class (UI upgraded only)
  const activeClass = (path) => {
    return location.pathname === path
      ? "bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500 shadow-sm"
      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-16 left-0 z-50
        w-72 h-[calc(100vh-64px)]
        bg-white/95 backdrop-blur-md
        border-r border-gray-200
        shadow-xl

        flex flex-col justify-between

        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Top Section */}
        <div className="p-6 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex justify-between items-center mb-6 lg:hidden">
            <h2 className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Finance Tracker
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Add Transaction Button */}
          <Link
            to="/transactions"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-3
              bg-gradient-to-r from-emerald-500 to-teal-500
              text-white font-medium
              p-3 rounded-xl mb-6
              shadow-md hover:shadow-lg
              transition duration-300"
          >
            <PlusCircle size={20} />
            Add Transaction
          </Link>

          {/* Navigation Menu */}
          <nav className="space-y-2 text-sm">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/dashboard")}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/transactions"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/transactions")}`}
            >
              <Wallet size={18} />
              Transactions
            </Link>

            <Link
              to="/budgets"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/budgets")}`}
            >
              <PiggyBank size={18} />
              Budgets
            </Link>

            <Link
              to="/goals"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/goals")}`}
            >
              <Target size={18} />
              Goals
            </Link>

            <Link
              to="/forecast"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/forecast")}`}
            >
            <TrendingUp size={18} />
              Forecast
            </Link>

            <Link
              to="/analytics"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/analytics")}`}
            >
              <BarChart3 size={18} />
              Analytics
            </Link>

            <Link
              to="/recurring"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/recurring")}`}
            >
              <Repeat size={18} />
              Recurring
            </Link>

            <Link
              to="/categories"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/categories")}`}
            >
              <Tags size={18} />
              Categories
            </Link>

            <Link
              to="/export-csv"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/export-csv")}`}
            >
              <Download size={18} />
              Export CSV
            </Link>

            <Link
              to="/export-pdf"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/export-pdf")}`}
            >
              <Download size={18} />
              Export PDF
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${activeClass("/settings")}`}
            >
              <Settings size={18} />
              Settings
            </Link>
          </nav>
        </div>

        {/* Logout Section */}
        <div className="p-6 border-t bg-gray-50">
          <Link
            to="/logout"
            className="flex items-center gap-3 px-4 py-2 rounded-lg
              text-gray-600 font-medium
              hover:bg-red-500 hover:text-white
              transition duration-300"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
