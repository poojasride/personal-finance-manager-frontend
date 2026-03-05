import React, { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
} from "../api/goalApi";
import GoalChart from "../components/GoalsDonutChart";
import { Trash2, Pencil } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Goals() {
  const [goals, setGoals] = useState([]);
  const [editingGoal, setEditingGoal] = useState(null);

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

      if (editingGoal) {
        await updateGoal(editingGoal._id, formattedData);
        alert("Goal updated successfully!");
        setEditingGoal(null);
      } else {
        await createGoal(formattedData);
        alert("Goal created successfully!");
      }

      resetForm();
      loadGoals();
    } catch (error) {
      console.log(error);
      alert("Error saving goal");
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     DELETE GOAL
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
  const totalTarget = goals.reduce((acc, goal) => acc + goal.targetAmount, 0);
  const totalSaved = goals.reduce((acc, goal) => acc + goal.savedAmount, 0);
  const completedGoals = goals.filter((goal) => goal.status === "completed")
    .length;

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden p-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            Goals Dashboard
          </h1>
          <p className="text-gray-500">Track and manage your financial goals</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard title="Total Goals" value={totalGoals} />
          <SummaryCard title="Total Target" value={`₹${totalTarget}`} color="text-blue-600" />
          <SummaryCard title="Total Saved" value={`₹${totalSaved}`} color="text-emerald-600" />
          <SummaryCard title="Completed Goals" value={completedGoals} color="text-purple-600" />
        </div>

        {/* FORM + CHART */}
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* FORM */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-6">
              {editingGoal ? "Edit Goal" : "Add New Goal"}
            </h3>

            <Formik
              enableReinitialize
              initialValues={editingGoal || initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <FormInput name="title" label="Goal Title" />
                  <FormInput name="targetAmount" label="Target Amount" type="number" />
                  <FormInput name="savedAmount" label="Saved Amount" type="number" />
                  <FormInput name="category" label="Category" />
                  <FormInput name="deadline" label="Deadline" type="date" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white font-medium shadow-md hover:shadow-xl transition duration-300"
                  >
                    {isSubmitting
                      ? editingGoal
                        ? "Updating..."
                        : "Creating..."
                      : editingGoal
                        ? "Update Goal"
                        : "Create Goal"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* CHART */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-6">Goals Progress Overview</h3>
            <GoalChart goals={goals} />
          </div>
        </div>

        {/* GOALS TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-x-auto">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-700">Goals List</h3>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Target</th>
                <th className="p-4 text-left">Saved</th>
                <th className="p-4 text-left">Progress</th>
                <th className="p-4 text-left">Deadline</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {goals.map((goal) => {
                const percent = goal.targetAmount
                  ? (goal.savedAmount / goal.targetAmount) * 100
                  : 0;

                return (
                  <tr key={goal._id} className="border-t hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{goal.title}</td>
                    <td className="p-4">{goal.category}</td>
                    <td className="p-4">₹{goal.targetAmount}</td>
                    <td className="p-4 text-emerald-600">₹{goal.savedAmount}</td>

                    <td className="p-4 w-48">
                      <div className="w-full bg-gray-200 h-3 rounded-full">
                        <div
                          className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{percent.toFixed(0)}%</span>
                    </td>

                    <td className="p-4">{goal.deadline?.slice(0, 10)}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          goal.status === "completed"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {goal.status}
                      </span>
                    </td>

                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(goal._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
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

/* =======================
   REUSABLE COMPONENTS
======================= */
function SummaryCard({ title, value, color = "text-gray-700" }) {
  return (
    <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
    </div>
  );
}

function FormInput({ name, label, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-xs mt-1"
      />
    </div>
  );
}