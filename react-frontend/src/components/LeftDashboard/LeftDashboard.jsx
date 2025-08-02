// src/components/LeftDashboard.jsx (Example structure to prevent errors)

import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { FiBarChart2, FiBox, FiUser } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { CompanySettingsContext } from "../../context/CompanySettingsContext";
import { useAuth } from "../../pages/hooks/useAuth";

const LeftDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { companyLogoUrl, isLoadingSettings } = useContext(CompanySettingsContext);
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure all relevant states from the useAuth hook, including isLoading and isAuthenticated
  const { isAuthenticated, userRole, isLoading } = useAuth();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  // --- 1. Handle Loading State First ---
  // If the authentication state is still being determined, show a loading indicator.
  // This prevents any attempt to access userRole or user before they are ready.
  if (isLoading) {
    return (
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 h-screen flex flex-col items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading navigation...</div>
        {/* You could add a spinner here for a better user experience */}
      </aside>
    );
  }

  // --- 2. Handle Not Authenticated State ---
  // If loading is complete but the user is not authenticated,
  // the sidebar should typically not be displayed.
  if (!isAuthenticated) {
    return null; // Hide the sidebar entirely if not authenticated
  }

  // --- 3. Define Navigation Items (only when loaded and authenticated) ---
  // Now that isLoading is false and isAuthenticated is true,
  // userRole is guaranteed to have its correct value.
  const navItems = [
    { icon: <AiOutlineHome className="text-xl" />, name: "Dashboard", path: "/dashboard" },

    // Summary: Display if userRole is 'Administrator' or 'Technical_Head'.
    ...(userRole === 'Administrator' || userRole === 'Tecnical_Head' ?
      [{ icon: <FiBarChart2 className="text-xl" />, name: "Summary", path: "/dashboard/summary" }] : []
    ),

    // Add Item: Display if userRole is 'Administrator' or 'Technical_Head'.
    ...(userRole === 'Administrator' || userRole === 'Tecnical_Head' ?
      [{ icon: <FiBox className="text-xl" />, name: "Add Item", path: "/dashboard/additem" }] : []
    ),

    // Add User: Display only if userRole is 'Administrator' or 'Technical_Head'.
    ...(userRole === 'Administrator' || userRole === 'Tecnical_Head' ?
      [{ icon: <LuUsers className="text-xl" />, name: "Add User", path: "/dashboard/adduser" }] : []
    ),

    // Add Customer: Display only if userRole is 'Administrator' or 'Technical_Head'.
    ...(userRole === 'Administrator' || userRole === 'Tecnical_Head' ?
      [{ icon: <FiUser className="text-xl" />, name: "Add Customer", path: "/dashboard/addcustomer" }] : []
    ),

    {icon: <AiOutlineSetting className="text-xl" />, name: "Settings", path: "/dashboard/settings" }
  ];

  return (
    <aside
      className={`flex flex-col p-6 shadow-lg transition-all duration-300 ease-in-out border-r ${
        isDarkMode ? "bg-gray-900 text-white border-gray-600" :
        "bg-white text-black " + (isMinimized ? "border-gray-400" : "border-gray-300")
      } ${isMinimized ? "w-35" : "w-60"}`}
    >
      <div className={`flex ${isMinimized ? "justify-center" : "justify-between"} items-center mb-6`}>
        {/* Conditional rendering for the company logo */}
        {companyLogoUrl && !isLoadingSettings ? (
          <img
            src={companyLogoUrl}
            alt="Company Logo"
            className={`transition-all duration-300 rounded-full object-cover border border-gray-400 ${isMinimized ? "w-12 h-12" : "w-20 h-20"}`}
          />
        ) : (
          <FiUser className={`transition-all duration-300 ${isMinimized ? "w-12 h-12" : "w-20 h-20"} text-gray-400 rounded-full`} />
        )}

        <div
          className={`ml-5 cursor-pointer p-2 rounded-full transition-all duration-300 flex items-center justify-center
            ${isMinimized ?
              (isDarkMode ? "hover:bg-gray-600 active:bg-gray-600" : "hover:bg-gray-300 active:bg-gray-300")
              : (isDarkMode ? "hover:bg-gray-600 active:bg-gray-600" : "hover:bg-gray-200 active:bg-gray-300")
            }`}
          onClick={toggleSidebar}
          role="button"
          aria-label="Toggle Sidebar"
        >
          {isMinimized ? (
            <MdOutlineKeyboardArrowLeft
              className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg`}
            />
          ) : (
            <MdOutlineKeyboardArrowRight
              className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg`}
            />
          )}
        </div>
      </div>

      <hr className={`mt-1 my-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />

      <nav className="flex-1">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li
              key={index}
              className={`
                flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-200
                ${location.pathname === item.path ? "bg-blue-500 text-white" : ""}
                ${isDarkMode ?
                  "hover:bg-gray-700 text-white" :
                  "hover:bg-gray-300 text-black"
                }
              `}
              onClick={() => handleNavigation(item.path)}
            >
              {item.icon}
              {!isMinimized && <span className="text-lg font-medium">{item.name}</span>}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LeftDashboard;
