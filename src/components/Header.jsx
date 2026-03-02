import React, { useState } from "react";
import { Bell, Search, Menu } from "lucide-react";
import logo from "../assets/budget.png";

const Header = ({ onMenuClick }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b shadow-sm flex items-center justify-between px-4 md:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-3">

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={22} />
        </button>

        <img
          src={logo}
          alt="logo"
          className="w-9 h-9 bg-emerald-500 rounded-lg p-1"
        />

        <div className="hidden sm:block">
          <h5 className="text-lg font-bold text-gray-800">
            Finance Manager
          </h5>
          <span className="text-xs text-gray-500">
            Personal Finance
          </span>
        </div>

      </div>

      {/* CENTER SEARCH */}
      <div className="hidden lg:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-full max-w-md mx-4">
        <Search size={18} className="text-gray-400 mr-2" />

        <input
          type="text"
          placeholder="Search transactions..."
          className="bg-transparent outline-none w-full text-sm"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Mobile search */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Search size={20} />
        </button>

        {/* Notification */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="w-9 h-9 rounded-full cursor-pointer"
        />

      </div>

      {/* Mobile search input */}
      {searchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b p-3 lg:hidden">

          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">

            <Search size={18} className="text-gray-400 mr-2" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none w-full text-sm"
            />

          </div>

        </div>
      )}

    </header>
  );
};

export default Header;