import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token dynamically before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



// ---------------- NOTIFICATION API ----------------

// Get all notifications
export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};


// Mark single notification as read
export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}`);
  return res.data;
};


// Mark all notifications as read
export const markAllNotificationsRead = async (ids) => {

  const requests = ids.map((id) =>
    api.put(`/notifications/${id}`)
  );

  await Promise.all(requests);

  return true;
};