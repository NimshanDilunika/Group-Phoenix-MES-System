// src/components/LeftDashboard.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { FiBarChart2, FiBox, FiUser } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdOutlineMenu } from "react-icons/md";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { CompanySettingsContext } from "../../context/CompanySettingsContext";
import { useAuth } from "../../pages/hooks/useAuth";

const LeftDashboard = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { companyLogoUrl, isLoadingSettings } = useContext(CompanySettingsContext);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, userRole, isLoading } = useAuth();

  // This effect will listen for screen size changes
  // and set the initial state of the sidebar for mobile.
  useEffect(() => {
    const handleResize = () => {
      // If screen is large, close the mobile menu
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    // Close the mobile menu after navigation
    if (window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  if (isLoading) {
    return (
      <aside className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading navigation...</div>
      </aside>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { icon: <AiOutlineHome className="text-xl" />, name: "Dashboard", path: "/dashboard" },
    ...(userRole === 'Administrator' || userRole === 'Technical_Head' ?
      [{ icon: <FiBarChart2 className="text-xl" />, name: "Summary", path: "/dashboard/summary" }] : []
    ),
    ...(userRole === 'Administrator' || userRole === 'Technical_Head' ?
      [{ icon: <FiBox className="text-xl" />, name: "Add Item", path: "/dashboard/additem" }] : []
    ),
    ...(userRole === 'Administrator' || userRole === 'Technical_Head' ?
      [{ icon: <LuUsers className="text-xl" />, name: "Add User", path: "/dashboard/adduser" }] : []
    ),
    ...(userRole === 'Administrator' || userRole === 'Technical_Head' ?
      [{ icon: <FiUser className="text-xl" />, name: "Add Customer", path: "/dashboard/addcustomer" }] : []
    ),
    {icon: <AiOutlineSetting className="text-xl" />, name: "Settings", path: "/dashboard/settings" }
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="fixed top-13 left-4 z-40 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className={`p-2 rounded-full shadow-md transition-colors duration-300 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          aria-label="Open sidebar"
        >
          <MdOutlineMenu className="text-2xl" />
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col p-6 shadow-lg transition-all duration-300 ease-in-out border-r
          ${isDarkMode ? "bg-gray-900 text-white border-gray-600" : "bg-white text-black border-gray-300"}
          ${isMinimized ? "w-20" : "w-60"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-60 lg:relative lg:flex ${isMinimized ? "lg:w-20" : "lg:w-60"}`}
      >
        <div className={`flex ${isMinimized ? "justify-center" : "justify-between"} items-center mb-6`}>
          {/* Company Logo and Text */}
          {companyLogoUrl && !isLoadingSettings ? (
            <img
              src={companyLogoUrl}
              alt="Company Logo"
              className={`transition-all duration-300 rounded-full object-cover border border-gray-400 ${isMinimized ? "w-10 h-10" : "w-16 h-16"}`}
            />
          ) : (
            <FiUser className={`transition-all duration-300 ${isMinimized ? "w-10 h-10" : "w-16 h-16"} text-gray-400 rounded-full`} />
          )}

          {/* Toggle Button for Desktop */}
          <div
            className={`cursor-pointer p-2 rounded-full transition-all duration-300 flex items-center justify-center
              ${isDarkMode ? "hover:bg-gray-700 active:bg-gray-600" : "hover:bg-gray-200 active:bg-gray-300"}
              ${isMinimized ? "ml-0" : "ml-4"}
              hidden lg:flex`}
            onClick={toggleSidebar}
            role="button"
            aria-label="Toggle Sidebar"
          >
            {isMinimized ? (
              <MdOutlineKeyboardArrowRight className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg`} />
            ) : (
              <MdOutlineKeyboardArrowLeft className={`${isDarkMode ? 'text-white' : 'text-black'} text-lg`} />
            )}
          </div>
        </div>

        <hr className={`my-4 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`flex items-center gap-4 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200
                  ${location.pathname === item.path ? "bg-blue-500 text-white" : ""}
                  ${isDarkMode ? "hover:bg-gray-700 text-white" : "hover:bg-gray-300 text-black"}
                `}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                {!isMinimized && <span className="text-base font-medium">{item.name}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default LeftDashboard;