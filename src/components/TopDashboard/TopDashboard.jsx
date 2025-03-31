import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";

const TopDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notificationCount = 5; // Example notification count

  // Check for saved theme preference on load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    const newTheme = !isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", newTheme); // Save theme preference
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <>
      <header className="flex justify-between items-center bg-gray-900 text-white p-4 shadow-md">
        <div className="text-2xl font-semibold">Magma Engineering Solutions (Pvt) Ltd</div>
        <div className="flex items-center gap-6">
          {/* Search Box */}
          <div className="flex items-center bg-gray-800 p-2 rounded-full border-2 border-gray-500 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300 transition-all">
            <BsSearch className="text-white" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white outline-none ml-2 placeholder-gray-400 w-40 sm:w-50 h-4"
            />
          </div>

          <div className="flex items-center gap-2 cursor-pointer group">
            {/* Dark Mode Icon */}
            <MdDarkMode
              onClick={toggleTheme}
              className="text-white text-2xl group-hover:text-blue-400 transition-colors"
            />
          </div>

          {/* Notification Icon */}
          <div className="relative cursor-pointer group">
            <BiBell className="text-white text-2xl group-hover:text-blue-400 transition-colors" />
            {notificationCount > 0 && (
              <sup className="absolute top-3 left-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {notificationCount}
              </sup>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <BiUserCircle className="text-white text-2xl group-hover:text-blue-400 transition-colors" />
            <span className="group-hover:text-blue-400 transition-colors">Super Admin</span>
          </div>

        </div>
      </header>
      <hr className="border-gray-600" /> {/* Horizontal line */}
    </>
  );
};

export default TopDashboard;
