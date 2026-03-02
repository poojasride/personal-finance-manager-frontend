import { Plus } from "lucide-react";

function Recurring() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Recurring Transactions</h1>

        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex gap-2">
          <Plus size={18}/> Add Recurring
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-4">

        <table className="w-full">

          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Frequency</th>
              <th>Next Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Netflix</td>
              <td>₹499</td>
              <td>Monthly</td>
              <td>10 Mar 2026</td>
            </tr>
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Recurring;