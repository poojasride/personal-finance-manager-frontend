import React, { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  deleteGoal,
} from "../api/goalApi";
import GoalChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Goals() {
  const [goals, setGoals] = useState([]);

  /* ======================
     LOAD GOALS
  ====================== */
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ======================
     FORMIK CONFIG
  ====================== */

  const initialValues = {
    title: "",
    targetAmount: "",
    savedAmount: "",
    category: "General",
    deadline: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),

    targetAmount: Yup.number()
      .typeError("Target must be a number")
      .positive("Target must be greater than 0")
      .required("Target amount is required"),

    savedAmount: Yup.number()
      .typeError("Saved amount must be a number")
      .min(0, "Saved amount cannot be negative")
      .required("Saved amount is required"),

    category: Yup.string().required("Category is required"),

    deadline: Yup.date().required("Deadline is required"),
  });

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);

      const formattedData = {
        ...values,
        targetAmount: Number(values.targetAmount),
        savedAmount: Number(values.savedAmount),
        status:
          Number(values.savedAmount) >= Number(values.targetAmount)
            ? "completed"
            : "active",
      };

      await createGoal(formattedData);

      resetForm();
      loadGoals();
    } catch (error) {
      console.log(error);
      alert("Error creating goal");
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      loadGoals();
    } catch (error) {
      console.log(error);
    }
  };

  /* ======================
     SUMMARY CALCULATIONS
  ====================== */

  const totalGoals = goals.length;

  const totalTarget = goals.reduce(
    (acc, goal) => acc + goal.targetAmount,
    0
  );

  const totalSaved = goals.reduce(
    (acc, goal) => acc + goal.savedAmount,
    0
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  /* ======================
     UI
  ====================== */

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Goals Dashboard
          </h1>
          <p className="text-gray-500">
            Track and manage your financial goals
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">

          <SummaryCard title="Total Goals" value={totalGoals} />

          <SummaryCard
            title="Total Target"
            value={`₹${totalTarget}`}
            color="text-blue-600"
          />

          <SummaryCard
            title="Total Saved"
            value={`₹${totalSaved}`}
            color="text-emerald-600"
          />

          <SummaryCard
            title="Completed Goals"
            value={completedGoals}
            color="text-purple-600"
          />

        </div>

        {/* FORM + CHART */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">

          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">
              Add New Goal
            </h3>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">

                  <FormInput name="title" label="Goal Title" />

                  <FormInput
                    name="targetAmount"
                    label="Target Amount"
                    type="number"
                  />

                  <FormInput
                    name="savedAmount"
                    label="Saved Amount"
                    type="number"
                  />

                  <FormInput
                    name="category"
                    label="Category"
                  />

                  <FormInput
                    name="deadline"
                    label="Deadline"
                    type="date"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {isSubmitting
                      ? "Creating..."
                      : "Create Goal"}
                  </button>

                </Form>
              )}
            </Formik>
          </div>

          {/* CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">
              Goals Progress Overview
            </h3>
            <GoalChart goals={goals} />
          </div>

        </div>

        {/* GOALS TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

          <div className="p-5 border-b">
            <h3 className="font-semibold text-gray-700">
              Goals List
            </h3>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Target</th>
                <th className="p-4 text-left">Saved</th>
                <th className="p-4 text-left">Progress</th>
                <th className="p-4 text-left">Deadline</th>
                <th className="p-4 text-left">Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {goals.map((goal) => {
                const percent =
                  goal.targetAmount > 0
                    ? (goal.savedAmount / goal.targetAmount) * 100
                    : 0;

                return (
                  <tr
                    key={goal._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-4 font-medium">
                      {goal.title}
                    </td>

                    <td className="p-4">
                      {goal.category}
                    </td>

                    <td className="p-4">
                      ₹{goal.targetAmount}
                    </td>

                    <td className="p-4">
                      ₹{goal.savedAmount}
                    </td>

                    <td className="p-4 w-48">
                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          className="bg-blue-500 h-2 rounded"
                          style={{
                            width: `${Math.min(percent, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {percent.toFixed(0)}%
                      </span>
                    </td>

                    <td className="p-4">
                      {goal.deadline?.slice(0, 10)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          goal.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {goal.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <Trash2
                        className="text-red-500 cursor-pointer hover:scale-110 transition"
                        onClick={() =>
                          handleDelete(goal._id)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Goals;

/* ======================
   REUSABLE COMPONENTS
====================== */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color || ""}`}>
        {value}
      </h2>
    </div>
  );
}

function FormInput({ name, label, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <Field
        name={name}
        type={type}
        className="w-full border p-2 rounded-lg mt-1"
      />

      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm"
      />
    </div>
  );
}