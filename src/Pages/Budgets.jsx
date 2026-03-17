import React, { useEffect, useState } from "react";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../api/budgetApi";
import { getTransactions } from "../api/transactionApi";
import BudgetDonutChart from "../components/BudgetDonutChart";
import { Trash2, Pencil } from "lucide-react";
import { getCategories } from "../api/categoryApi";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingBudget, setEditingBudget] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadBudgets();
    loadTransactions();
    loadCategories();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTransactions = async () => {
    try {
      const transactionsData = await getTransactions();
      setTransactions(transactionsData);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res); // axios response data

      console.log("categories:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Attach spent + status logic
  const budgetsWithTracking = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === budget.category &&
          new Date(t.date) >= new Date(budget.startDate) &&
          new Date(t.date) <= new Date(budget.endDate),
      )
      .reduce((acc, t) => acc + t.amount, 0);

    const remaining = budget.limitAmount - spent;
    const percentage = (spent / budget.limitAmount) * 100;

    let status = "Safe";
    if (percentage >= 100) status = "Exceeded";
    else if (percentage >= 80) status = "Warning";

    return {
      ...budget,
      spent,
      remaining,
      percentage,
      status,
    };
  });

  const totalBudget = budgetsWithTracking.reduce(
    (acc, item) => acc + item.limitAmount,
    0,
  );

  const totalSpent = budgetsWithTracking.reduce(
    (acc, item) => acc + item.spent,
    0,
  );

  const remaining = totalBudget - totalSpent;

  const initialValues = {
    category: "",
    limitAmount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
  };

  const validationSchema = Yup.object({
    category: Yup.string().min(3).required("Category required"),
    limitAmount: Yup.number().positive().required("Amount required"),
    period: Yup.string().required(),
    startDate: Yup.date().required(),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required(),
  });

  const onSubmit = async (values, { resetForm }) => {
    try {
      if (editingBudget) {
        await updateBudget(editingBudget._id, values);
        alert("Budget updated successfully!");
        setEditingBudget(null);
      } else {
        await createBudget(values);
        alert("Budget created successfully!");
      }

      resetForm();
      loadBudgets();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status) => {
    if (status === "Safe") return "bg-emerald-500";
    if (status === "Warning") return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?",
    );

    if (!confirmDelete) return;

    try {
      await deleteBudget(id);
      loadBudgets();
    } catch (error) {
      console.log(error);
      alert("Error deleting budget");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
        Budget Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Budget" value={totalBudget} />
        <SummaryCard
          title="Total Spent"
          value={totalSpent}
          color="text-red-500"
        />
        <SummaryCard
          title="Remaining"
          value={remaining}
          color="text-emerald-600"
        />
      </div>

      {/* FORM + CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* FORM CARD */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">
            {editingBudget ? "Edit Budget" : "Add Budget"}
          </h3>

          <Formik
            enableReinitialize
            initialValues={editingBudget || initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, isSubmitting }) => (
              <Form className="space-y-4">
                <SelectField name="category" label="Category">
                  <option value="">Select Category</option>

                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </SelectField>

                <FormInput
                  name="limitAmount"
                  label="Amount"
                  type="number"
                  placeholder="5000"
                />

                <SelectField name="period" label="Period">
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </SelectField>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    name="startDate"
                    label="Start Date"
                    type="date"
                    full
                  />
                  <FormInput name="endDate" label="End Date" type="date" full />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-md hover:shadow-xl transition duration-300"
                >
                  {isSubmitting
                    ? editingBudget
                      ? "Updating..."
                      : "Adding..."
                    : editingBudget
                      ? "Update Budget"
                      : "Add Budget"}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* CHART CARD */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">Budget Overview</h3>
          <BudgetDonutChart budgets={budgetsWithTracking} />
        </div>
      </div>

      {/* BUDGET MONITORING TABLE */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-700">Budget Monitoring</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
              <tr>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Limit</th>
                <th className="p-4 text-left">Spent</th>
                <th className="p-4 text-left">Remaining</th>
                <th className="p-4 text-left">Progress</th>
                <th className="p-4 text-left">Start Date</th>
                <th className="p-4 text-left">End Date</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {budgetsWithTracking.map((budget) => (
                <tr
                  key={budget._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium text-gray-700">
                    {budget.category}
                  </td>
                  <td className="p-4">₹{budget.limitAmount}</td>
                  <td className="p-4 text-red-500">₹{budget.spent}</td>
                  <td className="p-4 text-emerald-600">₹{budget.remaining}</td>

                  <td className="p-4 w-64">
                    <div className="w-full bg-gray-200 h-3 rounded-full">
                      <div
                        className={`${getStatusColor(budget.status)} h-3 rounded-full`}
                        style={{
                          width: `${Math.min(budget.percentage, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>

                  <td className="p-4 ">{budget.startDate.slice(0, 10)}</td>
                  <td className="p-4 ">{budget.endDate.slice(0, 10)}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-white rounded-full text-sm ${getStatusColor(budget.status)}`}
                    >
                      {budget.status}
                    </span>
                  </td>

                  <td className="p-4 flex justify-center gap-4">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="text-blue-500 hover:text-blue-700 transition"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {budgetsWithTracking.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No budgets found
            </div>
          )}

          {/* {budgetsWithTracking.category === "General" && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
              Default
            </span>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Budgets;

/* =======================
   REUSABLE COMPONENTS
======================= */
function SummaryCard({ title, value, color = "text-gray-700" }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>₹{value}</h2>
    </div>
  );
}

function FormInput({ name, label, type = "text", placeholder, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
}

function SelectField({ name, label, children, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Field
        as="select"
        name={name}
        className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
      >
        {children}
      </Field>
    </div>
  );
}
