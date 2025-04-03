import React, { useState } from "react";
import { FaTimesCircle, FaImage, FaEnvelope } from "react-icons/fa";
import { Routes, Route, Link } from "react-router-dom"; 
import JobCard from "../../components/DocumentsLevel/JobCard/JocCard";
import Invoice from "../../components/DocumentsLevel/Invoice/Invoice";
import Quotation from "../../components/DocumentsLevel/Qutation/Quatation";

const JobHome = () => {
  const [serviceStart, setServiceStart] = useState(false);
  const [serviceEnd, setServiceEnd] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("JobCard");

  return (
    <div className="bg-gray-800 space-y-8 p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700 w-full">
            <div>
              <h3 className="text-lg font-semibold text-white">Job No | Customer Name</h3>
              <p className="text-sm text-gray-400">Date</p>
            </div>
            {/* Process Toggles */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-white">Service Start</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={serviceStart} 
                    onChange={() => setServiceStart(!serviceStart)} 
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-white">Service End</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={serviceEnd} 
                    onChange={() => setServiceEnd(!serviceEnd)} 
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
              <Link to="/cancel">
                <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2">
                  <FaTimesCircle className="text-[15px] text-white-400" />
                  Cancel
                </button>
              </Link>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2">
                <FaImage className="text-[15px] text-white-400" />
                Images
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2">
                <FaEnvelope className="text-[15px] text-white-400" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* Document Buttons */}
        <div className="w-full">
          <div className="flex justify-between mb-6 w-full">
          <button 
              onClick={() => setSelectedComponent("JobCard")}
              className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold ${
                selectedComponent === "JobCard" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Job Card
            </button>
            
            <button 
              onClick={() => setSelectedComponent("Quotation")}
              className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold ${
                selectedComponent === "Quotation" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Quotation
            </button>

            <button 
              onClick={() => setSelectedComponent("Invoice")}
              className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold ${
                selectedComponent === "Invoice" ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              Invoice
            </button>
          </div>
        </div>
        <div className="mt-6">
          {selectedComponent === "JobCard" && <JobCard />}
          {selectedComponent === "Quotation" && <Quotation />}
          {selectedComponent === "Invoice" && <Invoice />}
        </div>
      </div>
    </div>
  );
};

export default JobHome;
