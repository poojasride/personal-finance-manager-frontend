import React, { useEffect, useState } from "react";
import { getBudgets, createBudget, deleteBudget } from "../api/budgetApi";
import { getTransactions } from "../api/transactionApi";
import BudgetDonutChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadBudgets();
    loadTransactions();
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
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Attach spent + status logic
  const budgetsWithTracking = budgets.map((budget) => {
    const spent = transactions.data
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
     await createBudget(values);

      alert("Budget created successfully!")
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
      loadBudgets(); // reload list
    } catch (error) {
      console.log(error);
      alert("Error deleting budget");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Budget Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Budget</p>
          <h2 className="text-2xl font-bold">₹{totalBudget}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Spent</p>
          <h2 className="text-2xl font-bold text-red-500">₹{totalSpent}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Remaining</p>
          <h2 className="text-2xl font-bold text-emerald-600">₹{remaining}</h2>
        </div>
      </div>

      {/* Form + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* FORM */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Add Budget</h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="space-y-4">
              <label className="text-sm text-gray-600">Category</label>
              <Field
                name="category"
                placeholder="Food, Rent, Travel"
                className="w-full border p-2 rounded-lg mt-1"
              />
              <ErrorMessage
                name="category"
                component="div"
                className="text-red-500 text-sm"
              />
              <label className="text-sm text-gray-600">Amount</label>

              <Field
                name="limitAmount"
                type="number"
                placeholder="5000"
                className="w-full border p-2 rounded-lg mt-1"
              />

              <ErrorMessage
                name="limitAmount"
                component="div"
                className="text-red-500 text-sm"
              />
              <label className="text-sm text-gray-600">Period</label>
              <Field
                as="select"
                name="period"
                className="w-full border p-2 rounded-lg mt-1"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </Field>
              <ErrorMessage
                name="period"
                component="div"
                className="text-red-500 text-sm"
              />
              <div className="grid grid-cols-2 gap-4">
               <div>
                    <label className="text-sm text-gray-600">
                      Start Date
                    </label>

                    <Field
                      type="date"
                      name="startDate"
                      className="w-full border p-2 rounded-lg mt-1"
                    />

                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">
                      End Date
                    </label>

                    <Field
                      type="date"
                      name="endDate"
                      className="w-full border p-2 rounded-lg mt-1"
                    />

                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-2 rounded"
              >
                Create Budget
              </button>
            </Form>
          </Formik>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="mb-4 font-semibold">Budget Overview</h3>
          <BudgetDonutChart budgets={budgetsWithTracking} />
        </div>
      </div>

      {/* Budget Monitoring Table */}
      <div className="bg-white rounded-xl shadow">
        <div className="p-5 border-b">
          <h3 className="font-semibold">Budget Monitoring</h3>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-4">Category</th>
              <th className="p-4">Limit</th>
              <th className="p-4">Spent</th>
              <th className="p-4">Remaining</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {budgetsWithTracking.map((budget) => (
              <tr key={budget._id} className="border-t">
                <td className="p-4">{budget.category}</td>
                <td className="p-4">₹{budget.limitAmount}</td>
                <td className="p-4 text-red-500">₹{budget.spent}</td>
                <td className="p-4 text-emerald-600">₹{budget.remaining}</td>

                <td className="p-4 w-64">
                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className={`${getStatusColor(
                        budget.status,
                      )} h-3 rounded-full`}
                      style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 text-white rounded-full text-sm ${getStatusColor(
                      budget.status,
                    )}`}
                  >
                    {budget.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Budgets;
