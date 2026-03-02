import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Logout() {

  const navigate = useNavigate();

  const handleLogout = () => {

    // remove token
    localStorage.removeItem("token");

    // remove user info if stored
    localStorage.removeItem("user");

    // redirect to login
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center border">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <LogOut size={40} className="text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Confirm Logout
        </h2>

        <p className="text-gray-500 mb-6">
          Are you sure you want to logout?
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">

          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Logout;