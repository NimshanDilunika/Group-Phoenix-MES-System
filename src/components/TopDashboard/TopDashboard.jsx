import React, { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { BsSearch } from "react-icons/bs";
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { Link } from 'react-router-dom';

const TopDashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const notificationCount = 5;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header
        className={`flex justify-between items-center p-4 shadow-md transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <Link to="/" >
          <div className="text-2xl font-semibold cursor-pointer">
            Magma Engineering Solutions (Pvt) Ltd
          </div>
        </Link>

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
              onClick={toggleTheme}
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

          <div className="relative cursor-pointer group" onClick={toggleProfile} ref={profileRef}>
            <div className="flex items-center gap-2">
              <BiUserCircle className={`text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
              <span className={`transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`}>Super Admin</span>
            </div>
            {isProfileOpen && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-xl border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'} z-10`}>
                <div className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  Profile
                </div>
                <Link to="/dashboard/ProfileSettings" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  Settings
                </Link>
                <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} my-2`} />
                <Link to="/logout" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  Log Out
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
    </>
  );
};

export default TopDashboard;