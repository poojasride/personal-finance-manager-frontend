import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import axios from "axios";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
  });

  const API = "https://personal-finance-manager-backend-n06b.onrender.com/api/categories";

  /* ================================
      LOAD CATEGORIES
  ================================= */

  const loadCategories = async () => {
    try {
      const res = await axios.get(API);
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================================
      INPUT CHANGE
  ================================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================================
      ADD / UPDATE CATEGORY
  ================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, formData);
      } else {
        await axios.post(API, formData);
      }

      setFormData({ name: "", type: "Expense" });
      setEditingId(null);
      setShowModal(false);

      loadCategories();
    } catch (error) {
      console.log(error);
    }
  };

  /* ================================
      EDIT CATEGORY
  ================================= */

  const handleEdit = (cat) => {
    setFormData({
      name: cat.name,
      type: cat.type,
    });

    setEditingId(cat._id);
    setShowModal(true);
  };

  /* ================================
      DELETE CATEGORY
  ================================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      loadCategories();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setFormData({ name: "", type: "Expense" });
          }}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex gap-2"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">

          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-center">Type</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>

            {categories.map((cat) => (
              <tr key={cat._id} className="border-b hover:bg-gray-50">

                <td className="p-4">{cat.name}</td>

                <td className="text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      cat.type === "Income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {cat.type}
                  </span>
                </td>

                <td className="flex justify-center gap-3 p-4">

                  <Edit
                    size={18}
                    className="cursor-pointer text-blue-500"
                    onClick={() => handleEdit(cat)}
                  />

                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleDelete(cat._id)}
                  />

                </td>

              </tr>
            ))}

          </tbody>

        </table>

        {categories.length === 0 && (
            <div className="p-8 text-center text-gray-500">No categories found</div>
          )}
      </div>

      {/* ==========================
          MODAL
      ========================== */}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96 space-y-4">

            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Category" : "Add Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                name="name"
                placeholder="Category Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
                >
                  {editingId ? "Update" : "Add"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Categories;