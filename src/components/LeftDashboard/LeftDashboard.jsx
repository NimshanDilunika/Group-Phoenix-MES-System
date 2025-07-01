import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { FiBarChart2, FiBox, FiUser } from "react-icons/fi"; // Import FiUser
import { LuUsers } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ThemeContext } from "../ThemeContext/ThemeContext"; // Import ThemeContext
import { CompanySettingsContext } from "../../context/CompanySettingsContext"; // Import CompanySettingsContext

const LeftDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext); // Access the theme context
  const { companyLogoUrl, isLoadingSettings } = useContext(CompanySettingsContext); // Access the company settings context
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

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

      <nav>
        <ul className="space-y-1">
          {[
            { icon: <AiOutlineHome className="text-xl" />, name: "Dashboard", path: "/dashboard" },
            { icon: <FiBarChart2 className="text-xl" />, name: "Summary", path: "/dashboard/summary" },
            { icon: <FiBox className="text-xl" />, name: "Add Item", path: "/dashboard/additem" },
            { icon: <LuUsers className="text-xl" />, name: "Add User", path: "/dashboard/adduser" },
            { icon: <FiUser className="text-xl" />, name: "Add Customer", path: "/dashboard/addcustomer" },
            { icon: <AiOutlineSetting className="text-xl" />, name: "Settings", path: "/dashboard/settings" }
          ].map((item, index) => (
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
