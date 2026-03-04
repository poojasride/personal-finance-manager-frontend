import React, { useEffect, useState, useMemo } from "react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";
import ExpenseChart from "../components/ExpenseDonutChart";
import { Trash2, Pencil } from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
  });

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
        recurringInterval: values.isRecurring
          ? values.recurringInterval
          : null,
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Transactions Dashboard
          </h1>
          <p className="text-gray-500">
            Track your income and expenses professionally
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <SummaryCard title="Total Income" value={totalIncome} color="text-emerald-600" />
          <SummaryCard title="Total Expense" value={totalExpense} color="text-red-500" />
          <SummaryCard title="Balance" value={balance} color="text-blue-600" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">
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
                <Form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput name="title" label="Title" full />
                  <FormInput name="description" label="Description" full />
                  <FormInput name="amount" label="Amount" type="number" />

                  <div>
                    <label className="text-sm text-gray-600">Type</label>
                    <Field as="select" name="type" className="w-full border p-2 rounded-lg mt-1">
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </Field>
                  </div>

                  <FormInput name="category" label="Category" />
                  <FormInput name="date" label="Date" type="date" />

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Field type="checkbox" name="isRecurring" />
                    <label className="text-sm">Recurring</label>
                  </div>

                  {values.isRecurring && (
                    <div className="sm:col-span-2">
                      <Field as="select" name="recurringInterval" className="w-full border p-2 rounded-lg">
                        <option value="">Select Interval</option>
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
                      className="w-full bg-emerald-600 text-white py-2.5 rounded-lg"
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

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-4">Overview</h3>
            <ExpenseChart transactions={transactions} />
          </div>
        </div>

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
                  <th className="p-4 text-left">Recurring</th>
                  <th className="p-4 text-left">Edit</th>
                  <th className="p-4 text-left">Delete</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t._id} className="border-t">
                    <td className="p-4">{t.title}</td>
                    <td className="p-4">{t.category}</td>
                    <td className="p-4">{t.type}</td>
                    <td className="p-4 font-semibold">₹{t.amount}</td>
                    <td className="p-4">{t.date?.slice(0, 10)}</td>
                    <td className="p-4">
                      {t.isRecurring ? `Yes (${t.recurringInterval})` : "No"}
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => setEditingTransaction(t)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={18} />
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <Trash2
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(t._id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="p-6 text-center text-gray-500">
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

/* ======================
   REUSABLE COMPONENTS
====================== */

function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color}`}>
        ₹{value}
      </h2>
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