import React, { useEffect, useState } from "react";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../api/transactionApi";
import ExpenseChart from "../components/BudgetDonutChart";
import { Trash2 } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Expense() {
  const [transactions, setTransactions] = useState([]);

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("Transaction", transactions);
  /* ======================
     FORMIK CONFIG
  ====================== */

  const initialValues = {
    title: "",
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Title must be at least 3 characters")
      .required("Title is required"),

    description: Yup.string().min(
      3,
      "Description must be at least 3 characters",
    ),

    amount: Yup.number()
      .typeError("Amount must be a number")
      .positive("Amount must be greater than 0")
      .required("Amount is required"),

    category: Yup.string()
      .min(3, "Category must be at least 3 characters")
      .required("Category is required"),

    date: Yup.date().required("Date is required"),
  });

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);

      await createTransaction({
        ...values,
        amount: Number(values.amount),
        recurringInterval: values.recurringInterval || null,
      });

      alert("Transaction created successfully");

      resetForm();
      loadTransactions();
    } catch (error) {
      console.log(error);
      alert("Error creating transaction");
    } finally {
      setSubmitting(false);
    }
  };

  /* ======================
     DELETE
  ====================== */

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      loadTransactions();
    } catch (error) {
      console.log(error);
    }
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

  /* ======================
     UI
  ====================== */

  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Transactions Dashboard
          </h1>
          <p className="text-gray-500">
            Track your income and expenses professionally
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
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
          <SummaryCard title="Balance" value={balance} color="text-blue-600" />
        </div>

        {/* FORM + CHART */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">
              Add Transaction
            </h3>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput name="title" label="Title" full />
                  <FormInput name="description" label="Description" full />
                  <FormInput name="amount" label="Amount" type="number" />

                  {/* Type */}
                  <div>
                    <label className="text-sm text-gray-600">Type</label>
                    <Field
                      as="select"
                      name="type"
                      className="w-full border p-2 rounded-lg mt-1"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </Field>
                  </div>

                  <FormInput name="category" label="Category" />
                  <FormInput name="date" label="Date" type="date" />

                  {/* Recurring */}
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Field type="checkbox" name="isRecurring" />
                    <label className="text-sm">Recurring</label>
                  </div>

                  {values.isRecurring && (
                    <div className="sm:col-span-2">
                      <label className="text-sm text-gray-600">
                        Recurring Interval
                      </label>
                      <Field
                        as="select"
                        name="recurringInterval"
                        className="w-full border p-2 rounded-lg mt-1"
                      >
                        <option value="">Select interval</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                      </Field>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700 transition"
                    >
                      {isSubmitting ? "Adding..." : "Add Transaction"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* CHART */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">Overview</h3>
            <ExpenseChart transactions={transactions} />
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-700">Transactions</h3>
          </div>

          <div className="overflow-x-auto">
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
                    <td className="p-4 font-semibold">₹{t.amount}</td>
                    <td className="p-4">{t.date?.slice(0, 10)}</td>
                    <td className="p-4">
                      <Trash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(t._id)}
                      />
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
   REUSABLE COMPONENTS
====================== */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>₹{value}</h2>
    </div>
  );
}

function FormInput({ name, label, type = "text", full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
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
