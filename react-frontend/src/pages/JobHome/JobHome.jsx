import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimesCircle, FaImage, FaEnvelope, FaArrowLeft, FaMoneyBillWave } from "react-icons/fa";
import { Link } from "react-router-dom";
import JobCard from "../../components/DocumentsLevel/JobCard/JocCard";
import Invoice from "../../components/DocumentsLevel/Invoice/Invoice";
import Quotation from "../../components/DocumentsLevel/Qutation/Quatation";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const JobHome = ({ onGoBack, job }) => {
  const [jobData, setJobData] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("JobCard");
  const [jobCardId, setJobCardId] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);

  const jobType = job?.service || "Repair"; // use passed jobType or default

  // Auto-create JobHome on mount (without customer_name)
  const isCreated = React.useRef(false); // useRef to persist flag

  useEffect(() => {
    const createJob = async () => {
      if (isCreated.current) return;
      isCreated.current = true;
      try {
        const res = await axios.post("http://localhost:8000/api/job-homes", {
          job_type: jobType, // use dynamic jobType
        });
        setJobData(res.data);
        if (res.data.job_card && res.data.job_card.id) {
          if (res.data.job_card && res.data.job_card.id) {
            console.log("JobHome.jsx: Received job_card id:", res.data.job_card.id);
            setJobCardId(res.data.job_card.id);
          } else {
            console.log("JobHome.jsx: No job_card id received in response");
          }
        }
      } catch (err) {
        console.error("Job creation failed", err);
      }
    };

    createJob();
  }, [jobType]);

  // Toggle handler for service/customer/special approve
  const handleToggle = async (field) => {
    if (!jobData?.job_home?.id) return;
    const current = jobData.job_home[field];

    if (window.confirm(`Are you sure to toggle ${field.replace("_", " ")}?`)) {
      try {
        const res = await axios.put(`http://localhost:8000/api/job-homes/${jobData.job_home.id}`, {
          [field]: !current,
        });
        setJobData({ ...jobData, job_home: res.data });
      } catch (err) {
        console.error(`Failed to update ${field}`, err);
      }
    }
  };

  const renderToggle = (label, field) => (
    <div className="flex justify-between items-center px-4">
      <p className={`${isDarkMode ? "text-white" : "text-gray-800"}`}>{label}</p>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={jobData?.job_home?.[field] || false}
          onChange={() => handleToggle(field)}
        />
        <div
          className={`w-10 h-5 ${
            isDarkMode ? "bg-gray-700 peer-focus:ring-green-800" : "bg-gray-300 peer-focus:ring-green-300"
          } rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white 
                after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                peer-checked:bg-green-500`}
        ></div>
      </label>
    </div>
  );

  return (
    <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} space-y-8 p-6 min-h-screen`}>
      <div className={`${isDarkMode ? "bg-gray-900" : "bg-gray-100"} rounded-xl p-6 shadow-xl mx-auto`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-700 w-full">
            <div
              className={`flex items-center gap-2 ${
                isDarkMode ? "text-white hover:text-gray-300" : "text-gray-800 hover:text-gray-600"
              } mb-2 cursor-pointer`}
              onClick={onGoBack}
            >
              <FaArrowLeft /> BACK
            </div>
            <div>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {jobData ? `${jobData.job_home.job_no} | ${jobData.job_home.job_type}` : "Loading..."}
              </h2>
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {jobData ? jobData.job_card?.customer_name ?? "Customer Name..." : "Customer Name..."}
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex flex-col space-y-4">
                {renderToggle("Service Start", "service_start")}
                {renderToggle("Service End", "service_end")}
              </div>

              <div className="flex flex-col space-y-4">
                {renderToggle("Customer OK", "customer_ok")}
                {renderToggle("Special Approve", "special_approve")}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className={`${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                  } w-35 py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}
                >
                  <FaImage className="text-[15px]" />
                  Images
                </button>
                <button
                  className={`${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                  } w-35 py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}
                >
                  <FaEnvelope className="text-[15px]" />
                  Message
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  className={`${
                    isDarkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                  } w-35 py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}
                >
                  <FaMoneyBillWave className="text-[15px]" />
                  Payment
                </button>
                <Link to="/cancel">
                  <button
                    className={`${
                      isDarkMode
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                    } w-35 py-2 px-6 rounded-lg shadow-md transition flex items-center gap-2`}
                  >
                    <FaTimesCircle className="text-[15px]" />
                    Cancel
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Document Tabs */}
        <div className="w-full">
          <div className="flex justify-between mb-6 w-full">
            {["JobCard", "Quotation", "Invoice"].map((comp) => (
              <button
                key={comp}
                onClick={() => setSelectedComponent(comp)}
                className={`w-1/4 py-3 px-8 rounded-lg shadow-md transition text-lg font-semibold ${
                  selectedComponent === comp
                    ? "bg-blue-600 text-white border-gray-600"
                    : isDarkMode
                    ? "bg-transparent text-white border border-gray-700 hover:bg-gray-800 hover:text-white"
                    : "bg-transparent text-black border border-gray-300 hover:bg-gray-200"
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {selectedComponent === "JobCard" && jobData?.job_home?.id && <JobCard jobHomeId={jobData.job_home.id} jobCardId={jobCardId} />}
          {selectedComponent === "Quotation" && <Quotation />}
          {selectedComponent === "Invoice" && <Invoice />}
        </div>
      </div>
    </div>
  );
};

export default JobHome;
