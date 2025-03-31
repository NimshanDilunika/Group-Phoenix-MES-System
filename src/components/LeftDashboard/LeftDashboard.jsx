import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation from react-router-dom
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { FiBarChart2, FiBox } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import Logo from "../../image/a.png";

const LeftDashboard = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate(); // Use navigate hook from react-router-dom
  const location = useLocation(); // Get the current path

  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  const handleNavigation = (path) => {
    navigate(path); // Use navigate() to change the route
  };

  return (
    <aside
      className={`flex flex-col bg-gray-900 text-white p-6 shadow-lg transition-all duration-300 ease-in-out border-r border-gray-600 ${
        isMinimized ? "w-35" : "w-60"
      }`}
    >
      <div className={`flex ${isMinimized ? "justify-center" : "justify-between"} items-center mb-6`}>
        <img src={Logo} alt="Logo" className="w-12 h-12 object-cover rounded-full" />

        <div
          className={`ml-5 cursor-pointer p-2 rounded-full transition-all duration-300 flex items-center justify-center 
          ${isMinimized ? "hover:bg-gray-600 active:bg-gray-600" : "hover:bg-gray-600 active:bg-gray-600 "}`}
          onClick={toggleSidebar}
          role="button"
          aria-label="Toggle Sidebar"
        >
          {isMinimized ? (
            <MdOutlineKeyboardArrowLeft className="text-white text-lg" />
          ) : (
            <MdOutlineKeyboardArrowRight className="text-white text-lg" />
          )}
        </div>
      </div>

      <hr className="border-gray-600 my-4" />

      <nav>
        <ul className="space-y-1">
          {[
            { icon: <AiOutlineHome className="text-xl" />, name: "Dashboard", path: "/" },
            { icon: <FiBarChart2 className="text-xl" />, name: "Summary", path: "/summary" },
            { icon: <FiBox className="text-xl" />, name: "Add Item", path: "/additem" },
            { icon: <LuUsers className="text-xl" />, name: "Add User", path: "/adduser" },
            { icon: <AiOutlineSetting className="text-xl" />, name: "Settings", path: "/settings" }
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200 ${
                location.pathname === item.path ? "bg-blue-500 text-white" : "" // Highlight active item
              }`}
              onClick={() => handleNavigation(item.path)} // Use handleNavigation to change routes
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
