import axios from "axios";

export const downloadCSV = async (from, to) => {

  const response = await axios.get(
    `http://localhost:5000/api/export/csv?from=${from}&to=${to}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response;
};

export const downloadPDF = async (from, to) => {

  const response = await axios.get(
    `http://localhost:5000/api/export/pdf?from=${from}&to=${to}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response;
};
