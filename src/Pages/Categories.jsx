import { Plus, Trash2, Edit } from "lucide-react";

function Categories() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>

        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex gap-2">
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>

            <tr className="border-b">
              <td className="p-4">Food</td>
              <td>Expense</td>
              <td className="flex gap-3 p-4">
                <Edit className="cursor-pointer text-blue-500" />
                <Trash2 className="cursor-pointer text-red-500" />
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Categories;