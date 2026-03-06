import React, { useEffect, useState, useMemo } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";
import ExpenseChart from "../components/ExpenseDonutChart";
import { Trash2, Pencil } from "lucide-react";
import { getCategories } from "../api/categoryApi";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadTransactions();
    loadCategories();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data); // axios response data

      console.log("categories:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.type && t.type !== filters.type) return false;
      if (
        filters.category &&
        !t.category.toLowerCase().includes(filters.category.toLowerCase())
      )
        return false;
      if (filters.startDate && new Date(t.date) < new Date(filters.startDate))
        return false;
      if (filters.endDate && new Date(t.date) > new Date(filters.endDate))
        return false;
      return true;
    });
  }, [transactions, filters]);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const initialValues = {
    title: "",
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    isRecurring: false,
    recurringInterval: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().min(3).required("Title is required"),
    amount: Yup.number().positive().required("Amount is required"),
    category: Yup.string().required("Category is required"),
    date: Yup.date().required("Date is required"),
  });

  const onSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      setSubmitting(true);

      const formattedData = {
        ...values,
        amount: Number(values.amount),
        recurringInterval: values.isRecurring ? values.recurringInterval : null,
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, formattedData);
        alert("Transaction updated successfully!");
        setEditingTransaction(null);
      } else {
        await createTransaction(formattedData);
        alert("Transaction created successfully!");
      }

      resetForm();
      loadTransactions();
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteTransaction(id);
    loadTransactions();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Transactions Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track, analyze and manage your finances professionally
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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
        <div className="grid gap-8 lg:grid-cols-2 mb-8">
          {/* FORM CARD */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              {editingTransaction ? "Edit Transaction" : "Add Transaction"}
            </h3>

            <Formik
              enableReinitialize
              initialValues={
                editingTransaction
                  ? {
                      ...editingTransaction,
                      date: editingTransaction.date?.slice(0, 10),
                    }
                  : initialValues
              }
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ values, isSubmitting }) => (
                <Form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput name="title" label="Title" full />
                  <FormInput name="description" label="Description" full />
                  <FormInput name="amount" label="Amount" type="number" />

                  <SelectField name="type" label="Type">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </SelectField>

                  <SelectField name="category" label="Category">
                    <option value="">Select Category</option>

                    {categories
                      ?.filter(
                        (cat) =>
                          cat.type?.toLowerCase() ===
                          values.type?.toLowerCase(),
                      )
                      .map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                  </SelectField>

                  <FormInput name="date" label="Date" type="date" />

                  <div className="flex items-center gap-3 sm:col-span-2">
                    <Field
                      type="checkbox"
                      name="isRecurring"
                      className="h-4 w-4 accent-emerald-600"
                    />
                    <label className="text-sm text-gray-600">
                      Recurring Transaction
                    </label>
                  </div>

                  {values.isRecurring && (
                    <SelectField
                      name="recurringInterval"
                      label="Recurring Interval"
                      full
                    >
                      <option value="">Select Interval</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </SelectField>
                  )}

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl
                        bg-gradient-to-r from-emerald-500 to-teal-500
                        text-white font-medium
                        shadow-md hover:shadow-xl
                        transition duration-300"
                    >
                      {isSubmitting
                        ? editingTransaction
                          ? "Updating..."
                          : "Adding..."
                        : editingTransaction
                          ? "Update Transaction"
                          : "Add Transaction"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* CHART CARD */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              Overview
            </h3>
            <ExpenseChart transactions={transactions} />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-700">
              Transactions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide text-xs">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Recurring</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium text-gray-700">{t.title}</td>
                    <td className="p-4">{t.category}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                          ${
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
                      {t.isRecurring ? `Yes (${t.recurringInterval})` : "No"}
                    </td>

                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => setEditingTransaction(t)}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(t._id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expense;

/* ====================== COMPONENTS ====================== */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition duration-300">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${color}`}>₹{value}</h2>
    </div>
  );
}

function FormInput({ name, label, type = "text", full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <Field
        name={name}
        type={type}
        className="w-full mt-2 px-4 py-2.5 rounded-xl
          border border-gray-200
          focus:ring-2 focus:ring-emerald-400
          focus:outline-none transition"
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
        className="w-full mt-2 px-4 py-2.5 rounded-xl
          border border-gray-200
          focus:ring-2 focus:ring-emerald-400
          focus:outline-none transition"
      >
        {children}
      </Field>
    </div>
  );
}
