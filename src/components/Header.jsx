import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Bell, Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/budget.png";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:5000/api";
  // const API_URL = "https://personal-finance-manager-backend-n06b.onrender.com/api";

  // Axios instance (memoized)
  const api = useMemo(() => {
    return axios.create({
      baseURL: `${API_URL}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  // Load user profile
  const loadProfile = useCallback(async () => {
    try {
      const res = await api.get("/auth/profile");
      setUser(res.data.user);
    } catch (error) {
      console.error("Profile load error:", error);
    }
  }, [api]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Notification load error:", error);
    }
  }, [api]);

  // Mark notification read
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    loadProfile();
    loadNotifications();
  }, [loadProfile, loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b flex items-center justify-between px-6">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="logo"
            className="w-9 h-9 bg-emerald-500 rounded-lg p-1"
          />

          <h5 className="text-lg font-semibold text-gray-800 hidden sm:block">
            Finance Manager
          </h5>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen((prev) => !prev)}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
              {/* HEADER */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-800">
                  Notifications
                </h4>

                <button
                  onClick={() => setNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✖
                </button>

                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      await Promise.all(
                        notifications
                          .filter((n) => !n.read)
                          .map((n) => api.put(`/notifications/${n._id}`)),
                      );

                      setNotifications((prev) =>
                        prev.map((n) => ({ ...n, read: true })),
                      );
                    }}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* BODY */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-500">
                    You're all caught up 🎉
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => markRead(n._id)}
                      className={`flex gap-3 px-4 py-3 border-b cursor-pointer transition
            hover:bg-gray-50
            ${!n.read ? "bg-blue-50" : ""}`}
                    >
                      {/* ICON */}
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-sm font-semibold">
                        🔔
                      </div>

                      {/* CONTENT */}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {n.title}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {n.message}
                        </p>

                        {/* TIME */}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* UNREAD DOT */}
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* FOOTER */}
              <div className="px-4 py-2 border-t text-center bg-gray-50">
                <button
                  onClick={() => navigate("/notifications")}
                  className="text-xs text-emerald-600 hover:underline"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
          >
            <img
              src={
                user?.profilePicture
                  ? user.profilePicture
                  : `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=10b981&color=fff`
              }
              alt="user"
              className="w-9 h-9 rounded-full object-cover"
            />
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg">
              <div className="flex justify-end px-3 pt-2">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ✖
                </button>
              </div>
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">{user?.username}</p>

                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
