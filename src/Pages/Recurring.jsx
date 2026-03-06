import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Repeat, X } from "lucide-react";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../api/transactionApi";

function Recurring() {
  const [recurring, setRecurring] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    type: "expense",
    category: "",
    date: "",
    recurringInterval: "monthly",
  });

  useEffect(() => {
    loadRecurring();
  }, []);

  const loadRecurring = async () => {
    try {
      const res = await getTransactions();

      const recurringData = res.data.filter((t) => t.isRecurring === true);

      setRecurring(recurringData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- FORM HANDLING ----------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      type: "expense",
      category: "",
      date: "",
      recurringInterval: "monthly",
    });
    setEditId(null);
  };

  // ---------------- CREATE / UPDATE ----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      isRecurring: true,
    };

    try {
      if (editId) {
        await updateTransaction(editId, payload);
      } else {
        await createTransaction(payload);
      }

      setOpenModal(false);
      resetForm();
      loadRecurring();
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- EDIT ----------------

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      title: item.title,
      description: item.description,
      amount: item.amount,
      type: item.type,
      category: item.category,
      date: item.date?.substring(0, 10),
      recurringInterval: item.recurringInterval,
    });

    setOpenModal(true);
  };

  // ---------------- DELETE ----------------

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recurring transaction?")) return;

    try {
      await deleteTransaction(id);
      loadRecurring();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Repeat className="text-emerald-500" size={24} />
          Recurring Transactions
        </h1>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} />
          Add Recurring
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Frequency</th>
              <th className="p-3 text-left">Next Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : recurring.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  No recurring transactions
                </td>
              </tr>
            ) : (
              recurring.map((item) => (

                <tr key={item._id} className="border-t hover:bg-gray-50">

                  <td className="p-3">{item.title}</td>

                  <td className="p-3">{item.category}</td>

                  <td className="p-3 text-red-500 font-semibold">
                    ₹{item.amount}
                  </td>

                  <td className="p-3 capitalize">
                    {item.recurringInterval}
                  </td>

                  <td className="p-3">
                    {item.nextRecurringDate
                      ? new Date(item.nextRecurringDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3 flex gap-3">

                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-500"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {openModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <div className="flex justify-between">

              <h2 className="font-bold text-lg">
                {editId ? "Edit Recurring" : "Add Recurring"}
              </h2>

              <button onClick={() => setOpenModal(false)}>
                <X size={18} />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />

              <select
                name="recurringInterval"
                value={formData.recurringInterval}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <button
                type="submit"
                className="bg-emerald-500 text-white w-full py-2 rounded"
              >
                {editId ? "Update" : "Create"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Recurring;