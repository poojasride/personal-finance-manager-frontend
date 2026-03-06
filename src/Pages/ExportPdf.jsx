import { useState } from "react";
import { Download, FileText, Calendar } from "lucide-react";
import { downloadPDF } from "../api/exportApi";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function ExportPdf() {

  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    from: Yup.date()
      .required("From date is required"),

    to: Yup.date()
      .required("To date is required")
      .min(
        Yup.ref("from"),
        "To date must be greater than From date"
      ),
  });

  const handlePDFExport = async (values) => {

    try {

      setLoading(true);

      const res = await downloadPDF(values.from, values.to);

      const blob = new Blob([res.data], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "transactions-report.pdf");

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error("PDF export failed:", error);

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Export PDF Report
          </h1>

          <p className="text-gray-500 mt-1">
            Download your financial transaction records in PDF format
          </p>
        </div>

        <Formik
          initialValues={{
            from: "",
            to: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handlePDFExport}
        >

          {({ isSubmitting }) => (

            <Form className="space-y-6">

              {/* Date Filter Card */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-red-500" size={20} />
                  <h2 className="font-semibold text-gray-700">
                    Select Date Range
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* From Date */}
                  <div>

                    <label className="text-sm text-gray-600">
                      From Date
                    </label>

                    <Field
                      type="date"
                      name="from"
                      className="w-full mt-2 px-4 py-2 border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-red-400"
                    />

                    <ErrorMessage
                      name="from"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />

                  </div>

                  {/* To Date */}
                  <div>

                    <label className="text-sm text-gray-600">
                      To Date
                    </label>

                    <Field
                      type="date"
                      name="to"
                      className="w-full mt-2 px-4 py-2 border rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-red-400"
                    />

                    <ErrorMessage
                      name="to"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />

                  </div>

                </div>

              </div>

              {/* Export Card */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">

                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div className="bg-red-100 p-3 rounded-xl">
                    <FileText
                      className="text-red-600"
                      size={26}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">

                    <h2 className="text-lg font-semibold text-gray-800">
                      Export Transactions (PDF)
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                      Download filtered transaction data in PDF format.
                      Ideal for reports and sharing.
                    </p>

                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="mt-4 flex items-center gap-2
                      bg-red-500 text-white px-5 py-2.5 rounded-xl
                      hover:bg-red-600 transition
                      disabled:opacity-50"
                    >

                      <Download size={18} />

                      {loading ? "Exporting..." : "Download PDF"}

                    </button>

                  </div>

                </div>

              </div>

            </Form>

          )}

        </Formik>

      </div>

    </div>

  );

}

export default ExportPdf;