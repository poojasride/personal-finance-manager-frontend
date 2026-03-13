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

  // Axios instance (memoized)
  const api = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:5000/api",
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
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
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
            <div className="absolute right-0 mt-3 w-80 bg-white border rounded-xl shadow-lg max-h-96 overflow-y-auto">

              <div className="p-3 border-b font-semibold">
                Notifications
              </div>

              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => markRead(n._id)}
                    className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                      !n.read ? "bg-gray-50" : ""
                    }`}
                  >
                    <p className="font-medium">{n.title}</p>

                    <p className="text-gray-500 text-xs">
                      {n.message}
                    </p>
                  </div>
                ))
              )}

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
              src="https://i.pravatar.cc/40"
              alt="user"
              className="w-9 h-9 rounded-full"
            />

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-52 bg-white border rounded-xl shadow-lg">

              <div className="px-4 py-3 border-b">
                <p className="font-semibold">{user?.username}</p>

                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => navigate("/profile")}
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