import React, { useState, useContext } from "react";
import { FaTimesCircle, FaImage, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import JobCard from "../../components/DocumentsLevel/JobCard/JocCard";
import Invoice from "../../components/DocumentsLevel/Invoice/Invoice";
import Quotation from "../../components/DocumentsLevel/Qutation/Quatation";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const JobHome = ({ job, onGoBack }) => {
  const [serviceStart, setServiceStart] = useState(false);
  const [serviceEnd, setServiceEnd] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("JobCard");
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} space-y-8 p-6 min-h-screen`}>
      {/* Header Section */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-6 shadow-xl mx-auto`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700 w-full">
            <div
              className={`flex items-center gap-2 ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-gray-800 hover:text-gray-600'} mb-2 cursor-pointer`}
              onClick={onGoBack} // Use the onGoBack prop
            >
              <FaArrowLeft /> Back to Job List
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Job No | Customer Name</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
            </div>
            {/* Process Toggles */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service Start</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={serviceStart}
                    onChange={() => setServiceStart(!serviceStart)}
                  />
                  <div className={`w-14 h-7 ${isDarkMode ? 'bg-gray-700 peer-focus:ring-green-800' : 'bg-gray-300 peer-focus:ring-green-300'} rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500`}></div>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Service End</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={serviceEnd}
                    onChange={() => setServiceEnd(!serviceEnd)}
                  />
                  <div className={`w-14 h-7 ${isDarkMode ? 'bg-gray-700 peer-focus:ring-red-800' : 'bg-gray-300 peer-focus:ring-red-300'} rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500`}></div>
                </label>
              </div>
              <Link to="/cancel">
                <button className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'} py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}>
                  <FaTimesCircle className="text-[15px] text-white-400" />
                  Cancel
                </button>
              </Link>
              <button className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'} py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}>
                <FaImage className="text-[15px] text-white-400" />
                Images
              </button>
              <button className={`${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'} py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}>
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
            className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold
              ${selectedComponent === "JobCard"
                ? "bg-blue-600 text-white border-gray-600" // Selected: Solid background, no border effect
                : isDarkMode
                  ? "bg-transparent text-white border border-gray-700 hover:bg-gray-800 hover:text-white" // Dark mode: Transparent bg, blue border, hover changes bg and text
                  : "bg-transparent text-black border border-gray-300 hover:bg-gray-200 " // Light mode: Transparent bg, blue border, hover changes bg and text
              }`
            }
          >
            Job Card
          </button>

          <button
            onClick={() => setSelectedComponent("Quotation")}
            className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold
              ${selectedComponent === "Quotation"
                ? "bg-blue-600 text-white border-gray-600" // Selected: Solid background, no border effect
                : isDarkMode
                  ? "bg-transparent text-white border border-gray-700 hover:bg-gray-800 hover:text-white" // Dark mode: Transparent bg, blue border, hover changes bg and text
                  : "bg-transparent text-black border border-gray-300 hover:bg-gray-200 " // Light mode: Transparent bg, blue border, hover changes bg and text
              }`
            }
          >
            Quotation
          </button>

          <button
            onClick={() => setSelectedComponent("Invoice")}
            className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold
              ${selectedComponent === "Invoice"
                ? "bg-blue-600 text-white border-gray-600" // Selected: Solid background, no border effect
                : isDarkMode
                  ? "bg-transparent text-white border border-gray-700 hover:bg-gray-800 hover:text-white" // Dark mode: Transparent bg, blue border, hover changes bg and text
                  : "bg-transparent text-black border border-gray-300 hover:bg-gray-200 " // Light mode: Transparent bg, blue border, hover changes bg and text
              }`
            }
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