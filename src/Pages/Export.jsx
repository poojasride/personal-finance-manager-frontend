import { useState } from "react";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

function Export() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Export Data</h1>
        <p className="text-gray-500">Download your financial records</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-3 gap-4">

        <div>
          <label className="text-sm text-gray-600">From Date</label>
          <input
            type="date"
            className="w-full mt-1 border rounded-lg px-3 py-2"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">To Date</label>
          <input
            type="date"
            className="w-full mt-1 border rounded-lg px-3 py-2"
            value={dateRange.to}
            onChange={(e) =>
              setDateRange({ ...dateRange, to: e.target.value })
            }
          />
        </div>

      </div>

      {/* Export Options */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* CSV Export */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">

          <FileSpreadsheet className="text-emerald-500 mb-3" size={32} />

          <h2 className="text-lg font-semibold">Export as CSV</h2>

          <p className="text-gray-500 text-sm mb-4">
            Download data in spreadsheet format
          </p>

          <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
            <Download size={18} />
            Export CSV
          </button>

        </div>

        {/* PDF Export */}
        <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">

          <FileText className="text-red-500 mb-3" size={32} />

          <h2 className="text-lg font-semibold">Export as PDF</h2>

          <p className="text-gray-500 text-sm mb-4">
            Download printable PDF report
          </p>

          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            <Download size={18} />
            Export PDF
          </button>

        </div>

      </div>

    </div>
  );
}

export default Export;