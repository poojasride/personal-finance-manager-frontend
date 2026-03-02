import { useState } from "react";
import { User, Lock, Bell, Moon } from "lucide-react";

function Settings() {

  const [user, setUser] = useState({
    name: "Pooja",
    email: "pooja@email.com",
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <div className="flex items-center gap-3 mb-4">
          <User className="text-emerald-500" />
          <h2 className="font-semibold text-lg">Profile</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            className="border p-2 rounded-lg"
            placeholder="Name"
            value={user.name}
            onChange={(e) =>
              setUser({ ...user, name: e.target.value })
            }
          />

          <input
            className="border p-2 rounded-lg"
            placeholder="Email"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />

        </div>

        <button className="mt-4 bg-emerald-500 text-white px-4 py-2 rounded-lg">
          Save Changes
        </button>

      </div>

      {/* Security */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <div className="flex items-center gap-3 mb-4">
          <Lock className="text-emerald-500" />
          <h2 className="font-semibold text-lg">Security</h2>
        </div>

        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">
          Change Password
        </button>

      </div>

      {/* Preferences */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-emerald-500" />
          <h2 className="font-semibold text-lg">Preferences</h2>
        </div>

        <div className="flex items-center justify-between">

          <span>Email Notifications</span>

          <input type="checkbox" className="w-5 h-5" />

        </div>

        <div className="flex items-center justify-between mt-3">

          <span>Dark Mode</span>

          <input type="checkbox" className="w-5 h-5" />

        </div>

      </div>

    </div>
  );
}

export default Settings;