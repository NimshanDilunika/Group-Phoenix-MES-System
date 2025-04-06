import React from "react";
import { Routes, Route } from "react-router-dom"; // Importing Routes and Route
import LeftDashboard from "../LeftDashboard/LeftDashboard";
import TopDashboard from "../TopDashboard/TopDashboard";
import Home from "../../pages/home/home";
import AddItem from "../../pages/additem/additem";
import Adduser from "../../pages/adduser/adduser";
import Summary from "../../pages/summary/summary";
import Settings from "../../pages/settings/settings";
<<<<<<< HEAD
import ProfileSettings from "../../pages/Profile/ProfileSettings";
=======
import RegisterPage from "../../pages/register/register";
>>>>>>> 5b97b54debe7eea1a254683eb2bf0737f53e5fcd

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <LeftDashboard />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation */}
        <TopDashboard />

        {/* Content Section */}
        <div className="flex-1 overflow-auto">
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/additem" element={<AddItem />} />
            <Route path="/adduser" element={<Adduser />} />
            <Route path="/settings" element={<Settings />} />
<<<<<<< HEAD
            <Route path="/ProfileSettings" element={<ProfileSettings />} />
=======
            <Route path="/register" element={<RegisterPage />} />
>>>>>>> 5b97b54debe7eea1a254683eb2bf0737f53e5fcd
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
