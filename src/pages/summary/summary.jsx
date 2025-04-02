import React, { useState } from "react";
import IncomePieChart from "../../components/SummaryDashboard/IncomePieChart"; // Daily Income
import JobStatusPieChart from "../../components/SummaryDashboard/JobStatusPieChart"; // Job Status
import IncomeBarChart from "../../components/SummaryDashboard/IncomeBarChart"; // Monthly Income
//import {jobs} from '../../pages/home/home';

const Summary = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* ✅ Header Section */}
      <div className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg mb-6">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">📊 Financial & Job Summary</h2>
          <p className="text-gray-500">{currentDate}</p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition">
          Export Report
        </button>
      </div>

      {/* ✅ Tabs Navigation */}
      <div className="flex space-x-4 mb-6">
        {["daily", "jobStatus", "monthly"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "daily" && "💰 Daily Income"}
            {tab === "jobStatus" && "📋 Job Status"}
            {tab === "monthly" && "📅 Monthly Income"}
          </button>
        ))}
      </div>

      {/* ✅ Charts (Toggle Based on Tab) */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        {activeTab === "daily" && (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">💰 Daily Income</h3>
            <IncomePieChart />
          </>
        )}
        {activeTab === "jobStatus" && (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">📋 Job Status Summary</h3>
            <JobStatusPieChart jobs={jobs} />
          </>
        )}
        {activeTab === "monthly" && (
          <>
            <h3 className="text-lg font-medium text-gray-700 mb-4">📅 Monthly Income</h3>
            <IncomeBarChart />
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;
