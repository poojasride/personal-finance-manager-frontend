import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  Repeat,
  Tags,
  CreditCard,
  PlusCircle,
  Download,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Function to check active page
  const activeClass = (path) => {
    return location.pathname === path
      ? "bg-emerald-100 text-emerald-600 font-semibold"
      : "text-gray-600 hover:bg-gray-100";
  };

  return (
    <>
      {/* Mobile background overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
    fixed top-16 left-0 z-50
    w-64 h-[calc(100vh-64px)]
    bg-white border-r shadow-sm

    flex flex-col justify-between

    transform transition-transform duration-300

    ${isOpen ? "translate-x-0" : "-translate-x-full"}

    lg:translate-x-0
  `}
      >
        {/* Top section */}
        <div className="p-4 overflow-y-auto">
          {/* Mobile close button */}
          <div className="flex justify-between items-center mb-4 lg:hidden">
            <h2 className="font-bold text-emerald-600">Finance Tracker</h2>

            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Add Transaction button */}
          <Link
            to="/transactions"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 bg-emerald-500 text-white p-3 rounded-lg mb-4 hover:bg-emerald-600"
          >
            <PlusCircle size={20} />
            Add Transaction
          </Link>

          {/* Menu items */}

          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/dashboard")}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            to="/transactions"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/transactions")}`}
          >
            <Wallet size={20} />
            Transactions
          </Link>

          <Link
            to="/budgets"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/budgets")}`}
          >
            <PiggyBank size={20} />
            Budgets
          </Link>

          <Link
            to="/goals"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/goals")}`}
          >
            <Target size={20} />
            Goals
          </Link>

          <Link
            to="/analytics"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/analytics")}`}
          >
            <BarChart3 size={20} />
            Analytics
          </Link>

          <Link
            to="/recurring"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/recurring")}`}
          >
            <Repeat size={20} />
            Recurring
          </Link>

          <Link
            to="/categories"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/categories")}`}
          >
            <Tags size={20} />
            Categories
          </Link>

         
          <Link
            to="/export-csv"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/export-csv")}`}
          >
            <Download size={20} />
            Export CSV
          </Link>

          <Link
            to="/export-pdf"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/export-pdf")}`}
          >
            <Download size={20} />
            Export PDF
          </Link>

          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 p-2 rounded-lg ${activeClass("/settings")}`}
          >
            <Settings size={20} />
            Settings
          </Link>
        </div>

        {/* Logout */}
        <div className="p-4 border-t">
          <Link
            to="/logout"
            className="flex items-center gap-3 p-2 rounded-lg text-gray-600 hover:bg-red-500 hover:text-white"
          >
            <LogOut size={20} />
            Logout
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
