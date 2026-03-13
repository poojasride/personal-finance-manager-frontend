import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, CheckCircle } from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);

      await Promise.all(
        unread.map((n) =>
          api.put(`/notifications/${n._id}`)
        )
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="p-8 max-w-4xl mx-auto">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Bell className="text-emerald-600" size={18} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Notifications
            </h2>
            <p className="text-sm text-gray-500">
              Stay updated with your finance activity
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            <CheckCircle size={16} />
            Mark all read
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 mb-6">

        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 text-sm rounded-lg border ${
            filter === "all"
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 text-sm rounded-lg border ${
            filter === "unread"
              ? "bg-gray-900 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          Unread ({unreadCount})
        </button>

      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-4">

        {filteredNotifications.length === 0 ? (

          <div className="text-center py-16 border rounded-xl bg-white">
            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              No notifications available
            </p>
          </div>

        ) : (

          filteredNotifications.map((n) => (

            <div
              key={n._id}
              onClick={() => markRead(n._id)}
              className={`flex gap-4 p-4 rounded-xl border bg-white hover:shadow-md transition cursor-pointer
              ${!n.read ? "border-emerald-300 bg-emerald-50" : ""}`}
            >

              {/* ICON */}
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Bell size={16} className="text-emerald-600" />
              </div>

              {/* CONTENT */}
              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <p className="font-semibold text-gray-800 text-sm">
                    {n.title}
                  </p>

                  {!n.read && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}

                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </p>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default Notifications;