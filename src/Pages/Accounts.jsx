import { Plus } from "lucide-react";

function Accounts() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Accounts</h1>

        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg flex gap-2">
          <Plus size={18}/> Add Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">HDFC Bank</h2>
          <p className="text-gray-500">Savings</p>
          <p className="text-xl font-bold mt-2">₹25,000</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">Cash Wallet</h2>
          <p className="text-gray-500">Cash</p>
          <p className="text-xl font-bold mt-2">₹5,000</p>
        </div>

      </div>

    </div>
  );
}

export default Accounts;