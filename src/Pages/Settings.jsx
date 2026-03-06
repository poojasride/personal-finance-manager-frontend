import { useEffect, useState } from "react";
import { User, Lock, Bell, Moon, Save } from "lucide-react";

import { getProfile, updateProfile, changePassword } from "../api/userApi";

function Settings() {

  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      console.error("Profile load error", error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(user);
      setMessage("Profile updated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setLoading(true);
      await changePassword(password);
      setPassword({ current: "", newPassword: "" });
      setMessage("Password updated successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="text-gray-500">
          Manage your account and preferences
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg">
          {message}
        </div>
      )}

      {/* Profile Card */}

      <div className="bg-white rounded-2xl shadow-md border p-6">

        <div className="flex items-center gap-3 mb-6">
          <User className="text-emerald-500" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">
              Name
            </label>

            <input
              type="text"
              value={user.name}
              onChange={(e) =>
                setUser({ ...user, name: e.target.value })
              }
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Email
            </label>

            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

        </div>

        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="flex items-center gap-2 mt-5 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 disabled:opacity-50"
        >
          <Save size={16} />
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </div>

      {/* Security Card */}

      <div className="bg-white rounded-2xl shadow-md border p-6">

        <div className="flex items-center gap-3 mb-6">
          <Lock className="text-emerald-500" />
          <h2 className="text-lg font-semibold">
            Security
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">
              Current Password
            </label>

            <input
              type="password"
              value={password.current}
              onChange={(e) =>
                setPassword({
                  ...password,
                  current: e.target.value,
                })
              }
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>

            <input
              type="password"
              value={password.newPassword}
              onChange={(e) =>
                setPassword({
                  ...password,
                  newPassword: e.target.value,
                })
              }
              className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

        </div>

        <button
          onClick={handlePasswordChange}
          disabled={loading}
          className="mt-5 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black disabled:opacity-50"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>

      </div>

      {/* Preferences Card */}

      <div className="bg-white rounded-2xl shadow-md border p-6">

        <div className="flex items-center gap-3 mb-6">
          <Bell className="text-emerald-500" />
          <h2 className="text-lg font-semibold">
            Preferences
          </h2>
        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between">
            <span>Email Notifications</span>

            <input
              type="checkbox"
              checked={preferences.emailNotifications}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  emailNotifications:
                    !preferences.emailNotifications,
                })
              }
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Moon size={16} />
              Dark Mode
            </span>

            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  darkMode: !preferences.darkMode,
                })
              }
              className="w-5 h-5"
            />
          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;