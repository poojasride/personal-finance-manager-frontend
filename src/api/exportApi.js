import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const downloadCSV = async (from, to) => {

  const response = await axios.get(
    `${API_URL}/export/csv?from=${from}&to=${to}`,
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
    `${API_URL}/export/pdf?from=${from}&to=${to}`,
    {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response;
};
