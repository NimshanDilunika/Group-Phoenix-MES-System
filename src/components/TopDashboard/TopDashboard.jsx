import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext"; 
import { BsSearch } from "react-icons/bs";
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";

const TopDashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext); 

  const notificationCount = 5;

  return (
    <>
    <header
      className={`flex justify-between items-center p-4 shadow-md transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="text-2xl font-semibold">Magma Engineering Solutions (Pvt) Ltd</div>
      
      <div className="flex items-center gap-6">
        <div
          className={`flex items-center p-2 rounded-full border-2 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-500 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
              : "bg-gray-100 border-gray-400 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-300"
          }`}
        >
          <BsSearch className={`transition-all ${isDarkMode ? "text-white" : "text-black"}`} />
          <input
            className={`transition-all duration-300 bg-transparent outline-none ml-2 w-40 sm:w-50 h-4 ${
              isDarkMode ? "text-white placeholder-gray-400" : "text-black placeholder-black"
            }`}
            type="text"
            placeholder="Search..."
          />
        </div>
        <div>
          <MdDarkMode
            className={`text-2xl transition-all duration-300 cursor-pointer ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            onClick={toggleTheme} // ✅ Click to toggle theme
          />
        </div>
        <div className="relative cursor-pointer group">
          <BiBell className={`text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
          {notificationCount > 0 && (
            <sup
              className={`absolute top-3 left-3 text-xs rounded-full px-2 py-1 ${
                isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
              }`}
            >
              {notificationCount}
            </sup>
          )}
        </div>

        <div className="flex items-center gap-2 cursor-pointer group">
          <BiUserCircle className={`text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
          <span className={`transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`}>Super Admin</span>
        </div>
      </div>
    </header>
    <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
    </>
  );
};

export default TopDashboard;
