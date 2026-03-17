import { useEffect, useState } from "react";
import { User, Lock, Bell, Moon, Save } from "lucide-react";
import { getProfile, updateProfile, changePassword } from "../api/userApi";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    currency: "INR",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  // =============================
  // Load profile
  // =============================
  useEffect(() => {
    loadProfile();
    loadPreferences();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();

      const data = res.data.user;

      setUser({
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        currency: data.currency || "INR",
      });
    } catch (error) {
      showAlert("error", "Failed to load profile");
    }
  };

  // =============================
  // Preferences Logic
  // =============================

  const loadPreferences = () => {
    const saved = localStorage.getItem("preferences");

    if (saved) {
      const parsed = JSON.parse(saved);
      setPreferences(parsed);

      if (parsed.darkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  };

  const savePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem("preferences", JSON.stringify(newPrefs));

    // dark mode logic
    if (newPrefs.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    showAlert("success", "Preferences updated");
  };

  // =============================
  // Alert system
  // =============================

  const showAlert = (type, message) => {
    setAlert({ type, message });

    setTimeout(() => {
      setAlert({ type: "", message: "" });
    }, 3000);
  };

  // =============================
  // Profile Update
  // =============================

  const handleProfileUpdate = async () => {
    if (!user.username || !user.email)
      return showAlert("error", "Username and Email required");

    try {
      setLoadingProfile(true);

      await updateProfile({
        username: user.username,
        phone: user.phone,
        currency: user.currency,
      });

      showAlert("success", "Profile updated successfully");
    } catch (err) {
      showAlert("error", "Profile update failed");
    } finally {
      setLoadingProfile(false);
    }
  };
  // =============================
  // Password Change
  // =============================

  const handlePasswordChange = async () => {
    if (!password.current || !password.newPassword) {
      return showAlert("error", "Please fill all fields");
    }

    if (password.newPassword.length < 6) {
      return showAlert("error", "Password must be at least 6 characters");
    }

    try {
      setLoadingPassword(true);
      await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      showAlert("success", "Password changed successfully");
    } catch (error) {
      showAlert("error", "Password change failed");
    } finally {
      setLoadingPassword(false);
    }
  };

  useEffect(()=>{

const saved = localStorage.getItem("preferences")

if(saved){

const parsed = JSON.parse(saved)

setPreferences(parsed)

if(parsed.darkMode){
document.documentElement.classList.add("dark")
}

}

},[])

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 text-sm">
          Manage your account and preferences
        </p>
      </div>

      {/* Alert */}
      {alert.message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg border
          ${
            alert.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {alert.message}
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white border rounded-xl p-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg mb-2
            ${
              activeTab === "profile"
                ? "bg-emerald-50 text-emerald-600"
                : "hover:bg-gray-100"
            }`}
          >
            <User size={16} />
            Profile
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg mb-2
            ${
              activeTab === "security"
                ? "bg-emerald-50 text-emerald-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Lock size={16} />
            Security
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg
            ${
              activeTab === "preferences"
                ? "bg-emerald-50 text-emerald-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Bell size={16} />
            Preferences
          </button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-6">
                Profile Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="border rounded-lg px-3 py-2"
                />

                <select
                  value={user.currency}
                  onChange={(e) =>
                    setUser({ ...user, currency: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="INR">INR ₹</option>
                  <option value="USD">USD $</option>
                  <option value="EUR">EUR €</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleProfileUpdate}
                  disabled={loadingProfile}
                  className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg"
                >
                  <Save size={16} />
                  {loadingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-6">Change Password</h2>

              <input
                type="password"
                placeholder="Current Password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({ ...password, currentPassword: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="New Password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handlePasswordChange}
                  disabled={loadingPassword}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg"
                >
                  {loadingPassword ? "Updating..." : "Change Password"}
                </button>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div className="bg-white border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-6">Preferences</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span>Email Notifications</span>

                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() =>
                      savePreferences({
                        ...preferences,
                        emailNotifications: !preferences.emailNotifications,
                      })
                    }
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Moon size={16} />
                    Dark Mode
                  </span>

                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={() =>
                      savePreferences({
                        ...preferences,
                        darkMode: !preferences.darkMode,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
