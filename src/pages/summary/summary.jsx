import React, { useState } from "react";
import IncomePieChart from "../../components/IncomePieChart";
import IncomeBarChart from "../../components/IncomeBarChart";

const Summery = () => {
  const [activeTab, setActiveTab] = useState("daily");

  return (
    <div className="flex flex-col items-center gap-6 p-10 bg-gray-100 min-h-screen">
      {/* Tabs Navigation */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Daily Income
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly Income
        </button>
      </div>

      {/* Render the selected chart */}
      {activeTab === "daily" ? <IncomePieChart /> : <IncomeBarChart />}
    </div>
  );
};

export default Summery;
