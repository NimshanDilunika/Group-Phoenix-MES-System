import React, { useState, useContext } from "react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext"; // Import Theme Context
import IncomePieChart from "../../components/SummaryDashboard/IncomePieChart"; // Daily Income
import JobStatusPieChart from "../../components/SummaryDashboard/JobStatusPieChart"; // Job Status
import IncomeBarChart from "../../components/SummaryDashboard/IncomeBarChart"; // Monthly Income
import exportElementToPDF from "../../components/Export Button/ExportPDF";

const Summary = () => {

  const jobs = [
    { id: 1, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "In Process", service: "Generator Services" },
    { id: 31, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 32, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Ended", service: "Generator Services" },
    { id: 33, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Completed", service: "Generator Services" },
    { id: 2, title: "Solar Panel Setup", company: "XYZ Corp", date: "10 March 2024", status: "Completed", service: "Solar Systems" },
    { id: 3, title: "AC Maintenance", company: "HomeCare", date: "15 March 2024", status: "Todo", service: "Air Conditioning" },
    { id: 4, title: "Generator Repair", company: "ABC Company", date: "20 March 2024", status: "Pending", service: "Generator Services" },
    { id: 5, title: "Solar Installation", company: "SolarTech", date: "25 March 2024", status: "Cancelled", service: "Solar Systems" },
    { id: 6, title: "AC Installation", company: "HomeCare", date: "30 March 2024", status: "In Process", service: "Air Conditioning", description: "Initial job registration" },
    { id: 7, title: "HVAC System Setup", company: "ThermoTech", date: "01 April 2024", status: "In Process", service: "HVAC" },
    { id: 8, title: "Solar Battery Backup", company: "Renew Power", date: "12 April 2024", status: "Pending", service: "Solar Systems" },
    { id: 9, title: "Pool Heater Installation", company: "Aqua Solutions", date: "18 April 2024", status: "Completed", service: "Pool Services" },
    { id: 10, title: "Wind Turbine Setup", company: "EcoPower", date: "23 April 2024", status: "In Process", service: "Wind Energy" },
    { id: 11, title: "Roof Insulation", company: "HomeCare", date: "28 April 2024", status: "Todo", service: "Home Improvement" },
    { id: 12, title: "Generator Maintenance", company: "ABC Company", date: "05 May 2024", status: "Cancelled", service: "Generator Services" },
    { id: 13, title: "Solar Panel Replacement", company: "SolarTech", date: "11 May 2024", status: "Pending", service: "Solar Systems" },
    { id: 14, title: "Air Duct Cleaning", company: "CleanAir", date: "20 May 2024", status: "Completed", service: "Air Conditioning" },
    { id: 15, title: "Electrical Panel Upgrade", company: "ABC Company", date: "25 May 2024", status: "In Process", service: "Electrical Services" },
    { id: 16, title: "Solar Energy Storage Installation", company: "Renew Power", date: "02 June 2024", status: "In Process", service: "Solar Systems" },
    { id: 17, title: "Water Heater Replacement", company: "Plumbing Pros", date: "07 June 2024", status: "Pending", service: "Plumbing Services" },
    { id: 18, title: "New AC Unit Installation", company: "HomeCare", date: "14 June 2024", status: "Completed", service: "Air Conditioning" },
    { id: 19, title: "Wind Turbine Maintenance", company: "EcoPower", date: "19 June 2024", status: "Cancelled", service: "Wind Energy" },
    { id: 20, title: "Solar Water Heater Installation", company: "SolarTech", date: "22 June 2024", status: "In Process", service: "Solar Systems" },
    { id: 21, title: "Smart Thermostat Installation", company: "Smart Home", date: "25 June 2024", status: "Todo", service: "Home Automation" },
    { id: 22, title: "Home Solar Panel Setup", company: "Green Energy", date: "01 July 2024", status: "In Process", service: "Solar Systems" },
    { id: 23, title: "Water Filtration System Setup", company: "Pure Water", date: "08 July 2024", status: "Pending", service: "Plumbing Services" },
    { id: 24, title: "Lighting Control System", company: "Smart Home", date: "15 July 2024", status: "Completed", service: "Home Automation" },
    { id: 25, title: "Fireplace Installation", company: "HomeCare", date: "22 July 2024", status: "Pending", service: "Home Improvement" },
    { id: 26, title: "Electric Vehicle Charger Installation", company: "EV Solutions", date: "29 July 2024", status: "In Process", service: "Electric Services" },
    { id: 27, title: "Solar Panel Testing", company: "SolarTech", date: "03 August 2024", status: "Completed", service: "Solar Systems" },
    { id: 28, title: "Electric Water Heater Setup", company: "Plumbing Pros", date: "10 August 2024", status: "In Process", service: "Plumbing Services" },
    { id: 29, title: "Home Battery Backup", company: "Renew Power", date: "17 August 2024", status: "Pending", service: "Home Energy" },
    { id: 30, title: "Solar Water Pump Installation", company: "SolarTech", date: "24 August 2024", status: "Completed", service: "Solar Systems" }
  ];

  const { isDarkMode } = useContext(ThemeContext); // Access dark mode state
  const [activeTab, setActiveTab] = useState("jobStatus");
  const currentDate = new Date().toLocaleDateString();

  

  return (
    <div className={`p-8 min-h-screen ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      {/* ✅ Header Section */}
      <div className={`flex justify-between items-center shadow-md p-6 rounded-lg mb-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>📊 Financial & Job Summary</h1>
          <p>{currentDate}</p>
        </div>
        <button className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'} px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md`} onClick={() => exportElementToPDF('report-content', 'summary-report.pdf')}>
          Export Report
        </button>
      </div>

      
      
      {/* ✅ Tabs Navigation */}
      <div className="flex space-x-4 mb-6">
        {["daily", "jobStatus", "monthly"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : isDarkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200"
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
      <div className={`shadow-lg rounded-lg p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
        {activeTab === "daily" && (
          <div id="report-content">
            <h3 className="text-lg font-medium mb-4">💰 Daily Income</h3>
            <IncomePieChart />
          </div>
        )}
        {activeTab === "jobStatus" && (
          <div id="report-content">
            <h3 className="text-lg font-medium mb-4">📋 Job Status</h3>
            <JobStatusPieChart jobs={jobs}/>
          </div>
        )}
        {activeTab === "monthly" && (
          <div id="report-content">
            <h3 className="text-lg font-medium mb-4">📅 Monthly Income</h3>
            <IncomeBarChart />
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
