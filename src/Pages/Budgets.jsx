import React, { useEffect, useState } from "react";
import { getBudgets, createBudget } from "../api/budgetApi";
import BudgetDonutChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Budgets() {

  const [budgets, setBudgets] = useState([]);

  // Load budgets when page loads
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Step 1: Initial values
  const initialValues = {
    category: "",
    limitAmount: "",
    period: "monthly",
    startDate: "",
    endDate: "",
  };

  // ✅ Step 2: Validation schema
  const validationSchema = Yup.object({

    category: Yup.string()
      .min(3, "Category must be at least 3 characters")
      .required("Category is required"),

    limitAmount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .required("Amount is required"),

    period: Yup.string()
      .required("Period is required"),

    startDate: Yup.date()
      .required("Start date is required"),

    endDate: Yup.date()
      .min(
        Yup.ref("startDate"),
        "End date must be after start date"
      )
      .required("End date is required"),
  });

  // ✅ Step 3: Submit function
  const onSubmit = async (values, { resetForm, setSubmitting }) => {

    try {

      setSubmitting(true);

      await createBudget(values);

      alert("Budget created successfully");

      resetForm();

      loadBudgets();

    } catch (error) {

      console.log(error);
      alert("Error creating budget");

    } finally {

      setSubmitting(false);

    }

  };

  // Summary calculations
  const totalBudget = budgets.reduce(
    (acc, item) => acc + item.limitAmount,
    0
  );

  const totalSpent = budgets.reduce(
    (acc, item) => acc + (item.spent || 0),
    0
  );

  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Budget Dashboard
        </h1>
        <p className="text-gray-500">
          Manage your budget professionally
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Budget</p>
          <h2 className="text-2xl font-bold mt-1">
            ₹{totalBudget}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <h2 className="text-2xl font-bold text-red-500 mt-1">
            ₹{totalSpent}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Remaining Budget</p>
          <h2 className="text-2xl font-bold text-emerald-600 mt-1">
            ₹{remaining}
          </h2>
        </div>

      </div>

      {/* Form + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ✅ FORM */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Add Budget
          </h3>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (

              <Form className="space-y-4">

                {/* Category */}
                <div>
                  <label className="text-sm text-gray-600">
                    Category
                  </label>

                  <Field
                    name="category"
                    type="text"
                    placeholder="Food, Rent, Travel"
                    className="w-full border p-2 rounded-lg mt-1"
                  />

                  <ErrorMessage
                    name="category"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm text-gray-600">
                    Amount
                  </label>

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
                </div>

                {/* Period */}
                <div>
                  <label className="text-sm text-gray-600">
                    Period
                  </label>

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
                </div>

                {/* Dates */}
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
                >
                  {isSubmitting ? "Creating..." : "Create Budget"}
                </button>

              </Form>

            )}
          </Formik>

        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold text-gray-700 mb-4">
            Budget Overview
          </h3>

          <BudgetDonutChart budgets={budgets} />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">
          <h3 className="font-semibold text-gray-700">
            Budget List
          </h3>
        </div>

        <table className="w-full">

          <tbody>

            {budgets.map((budget) => (

              <tr key={budget._id} className="border-t">

                <td className="p-4">{budget.category}</td>

                <td className="p-4">₹{budget.limitAmount}</td>

                <td className="p-4">{budget.period}</td>

                <td className="p-4">
                  {budget.startDate?.slice(0, 10)}
                </td>

                <td className="p-4">
                  {budget.endDate?.slice(0, 10)}
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
  );
}

export default Budgets;