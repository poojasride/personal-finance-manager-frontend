import React, { useEffect, useState } from "react";
import { getBudgets } from "../api/budgetApi";
import ExpenseChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

function Expense() {
  const [transactions, setTransactions] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    isRecurring: false,
    recurringInterval: "",
  });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await getBudgets();
      setTransactions(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ======================
     CALCULATIONS
  ====================== */

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 md:py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Transactions Dashboard
          </h1>

          <p className="text-gray-500 text-sm sm:text-base">
            Track your income and expenses
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <SummaryCard
            title="Total Income"
            value={totalIncome}
            color="text-emerald-600"
          />

          <SummaryCard
            title="Total Expense"
            value={totalExpense}
            color="text-red-500"
          />

          <SummaryCard
            title="Balance"
            value={balance}
            color="text-blue-600"
          />

        </div>


        {/* FORM + CHART */}
        <div className="grid gap-6 mt-6 lg:grid-cols-2">

          {/* FORM */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 md:p-6">

            <h3 className="font-semibold mb-4 text-gray-700">
              Add Transaction
            </h3>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <Input
                label="Title"
                name="title"
                onChange={handleChange}
                full
              />

              <Input
                label="Description"
                name="description"
                onChange={handleChange}
                full
              />

              <Input
                label="Amount"
                name="amount"
                type="number"
                onChange={handleChange}
              />

              <Select
                label="Type"
                name="type"
                onChange={handleChange}
                options={[
                  { value: "expense", label: "Expense" },
                  { value: "income", label: "Income" },
                ]}
              />

              <Input
                label="Category"
                name="category"
                onChange={handleChange}
              />

              <Input
                label="Date"
                name="date"
                type="date"
                onChange={handleChange}
              />

              {/* Recurring */}
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  name="isRecurring"
                  onChange={handleChange}
                />
                <label className="text-sm">Recurring</label>
              </div>

              {formData.isRecurring && (
                <Select
                  name="recurringInterval"
                  onChange={handleChange}
                  full
                  options={[
                    { value: "", label: "Select interval" },
                    { value: "daily", label: "Daily" },
                    { value: "weekly", label: "Weekly" },
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                />
              )}

              <div className="sm:col-span-2">
                <button className="w-full bg-emerald-500 text-white py-2.5 rounded-lg hover:bg-emerald-600 transition font-medium">
                  Add Transaction
                </button>
              </div>

            </form>

          </div>


          {/* CHART */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 md:p-6">

            <h3 className="font-semibold text-gray-700 mb-4">
              Overview
            </h3>

            <div className="w-full h-[280px] sm:h-[320px] md:h-[350px]">

              <ExpenseChart transactions={transactions} />

            </div>

          </div>

        </div>


        {/* TRANSACTIONS */}
        <div className="bg-white rounded-xl shadow-sm border mt-6">

          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700">
              Transactions
            </h3>
          </div>


          {/* MOBILE VIEW (CARD) */}
          <div className="block md:hidden">

            {transactions.map((t) => (
              <div
                key={t._id}
                className="border-b p-4 flex flex-col gap-2"
              >

                <div className="flex justify-between">

                  <span className="font-semibold">
                    {t.title}
                  </span>

                  <Trash2 className="text-red-500 w-4 h-4" />

                </div>

                <span className="text-sm text-gray-500">
                  {t.category}
                </span>

                <div className="flex justify-between items-center">

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      t.type === "income"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.type}
                  </span>

                  <span className="font-bold">
                    ₹{t.amount}
                  </span>

                </div>

              </div>
            ))}

          </div>


          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-50 text-sm text-gray-500">

                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4"></th>
                </tr>

              </thead>

              <tbody>

                {transactions.map((t) => (
                  <tr key={t._id} className="border-t">

                    <td className="p-4">{t.title}</td>
                    <td className="p-4">{t.category}</td>

                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          t.type === "income"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>

                    <td className="p-4 font-semibold">
                      ₹{t.amount}
                    </td>

                    <td className="p-4">
                      {t.date?.slice(0, 10)}
                    </td>

                    <td className="p-4">
                      <Trash2 className="text-red-500 cursor-pointer" />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Expense;


/* ======================
   COMPONENTS
====================== */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border">

      <p className="text-sm text-gray-500">{title}</p>

      <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${color}`}>
        ₹{value}
      </h2>

    </div>
  );
}


function Input({ label, name, type = "text", onChange, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>

      {label && (
        <label className="text-sm text-gray-600">
          {label}
        </label>
      )}

      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full border p-2 rounded-lg mt-1 focus:ring-2 focus:ring-emerald-500 outline-none"
      />

    </div>
  );
}


function Select({ label, name, onChange, options, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>

      {label && (
        <label className="text-sm text-gray-600">
          {label}
        </label>
      )}

      <select
        name={name}
        onChange={onChange}
        className="w-full border p-2 rounded-lg mt-1"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

    </div>
  );
}