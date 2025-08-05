import React, { useState, useEffect, useContext, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import {
  FaTimes, FaImage, FaEnvelope, FaArrowLeft,
  FaMoneyBillWave, FaSpinner, FaExclamationTriangle,
  FaTools, FaFileInvoiceDollar, FaQuoteRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
// Assuming these components are already responsive or will be made responsive
import JobCard from "../../components/DocumentsLevel/JobCard/JobCard";
import Invoice from "../../components/DocumentsLevel/Invoice/Invoice";
import Quotation from "../../components/DocumentsLevel/Qutation/Quatation";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import { UserPlus, CircleX } from "lucide-react";
import { useAuth } from "../../pages/hooks/useAuth";

import CancelJobPage from "./CancelJobPage";
import ImageUpload from "./ImageUpload";
import PaymentPage from "./Payment";

const MessagePage = ({ onClose }) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <div className={`min-h-[50vh] flex items-center justify-center p-4 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <div className={`p-6 rounded-lg w-full`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Message Center</h2>
        <p className="text-center mb-6">
          This is a placeholder for the Message functionality. You can integrate your messaging component here.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="py-2 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Close Messages
          </button>
        </div>
      </div>
    </div>
  );
};

const JobHome = ({ onGoBack, job }) => {
  const [jobData, setJobData] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState("JobCard");
  const [jobCardId, setJobCardId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useContext(ThemeContext);
  const isCreated = useRef(false);
  const jobType = job?.service || "Repair";

  const [showCancelJob, setShowCancelJob] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  // Destructure all relevant states from the useAuth hook, including isLoading and isAuthenticated
  const { isAuthenticated, userRole } = useAuth();

  const [confirmToggle, setConfirmToggle] = useState({
    show: false,
    field: null,
    currentValue: null,
  });

  useEffect(() => {
    const createOrFetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let res;
        if (job?.job_home_id) {
          res = await axios.get(`http://localhost:8000/api/job-homes/${job.job_home_id}`, { withCredentials: true });
        } else if (!isCreated.current) {
          isCreated.current = true;
          res = await axios.post("http://localhost:8000/api/job-homes", { job_type: jobType }, { withCredentials: true });
        } else {
          setIsLoading(false);
          return;
        }

        setJobData(res.data);
        if (res.data.job_card?.id) {
          setJobCardId(res.data.job_card.id);
        } else {
          setJobCardId(null);
        }
      } catch (err) {
        console.error("Job creation/fetch failed", err);
        setError("Failed to load or create job. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    createOrFetchJob();
  }, [jobType, job?.job_home_id]);

  const handleToggle = useCallback((field) => {
    if (!jobData?.job_home?.id) return;
    setConfirmToggle({ show: true, field, currentValue: jobData.job_home[field] });
  }, [jobData]);

  const confirmToggleChange = async () => {
    const { field, currentValue } = confirmToggle;
    const newToggleValue = !currentValue;
    setConfirmToggle({ show: false, field: null, currentValue: null });

    setJobData(prev => ({
      ...prev,
      job_home: {
        ...prev.job_home,
        [field]: newToggleValue,
      },
    }));

    try {
      const res = await axios.put(
        `http://localhost:8000/api/job-homes/${jobData.job_home.id}`,
        { [field]: newToggleValue },
        { withCredentials: true }
      );
      if (res.data?.id) {
        setJobData(prev => ({ ...prev, job_home: res.data }));
      }
    } catch (err) {
      console.error(`Failed to update ${field}`, err);
      setJobData(prev => ({
        ...prev,
        job_home: {
          ...prev.job_home,
          [field]: currentValue,
        },
      }));
    }
  };

  const renderToggle = (label, field) => (
    <div className="flex justify-between items-center px-4 py-2">
      <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} text-sm font-medium`}>{label}</p>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={jobData?.job_home?.[field] || false}
          onChange={() => handleToggle(field)}
        />
        <div className={`w-11 h-6 rounded-full peer-checked:bg-green-500 transition-colors ease-in-out duration-200
          ${isDarkMode ? "bg-gray-700 peer-focus:ring-green-800" : "bg-gray-300 peer-focus:ring-green-300"}
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:ease-in-out after:duration-200
          peer-checked:after:translate-x-full peer-checked:after:border-white`}
        ></div>
      </label>
    </div>
  );

  const buttonBaseClasses = `py-2 px-5 rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2`;
  const neutralButtonClasses = `${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-200 focus:ring-gray-500 focus:ring-offset-gray-900" : "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-300 focus:ring-offset-gray-100"}`;
  const destructiveButtonClasses = `${isDarkMode ? "bg-red-700 hover:bg-red-800 text-white focus:ring-red-500 focus:ring-offset-gray-900" : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 focus:ring-offset-gray-100"}`;
  const tabButtonClasses = (isActive) => `w-full py-3 px-4 sm:px-8 rounded-lg transition-all duration-300 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 text-center
    ${isActive ? "bg-blue-600 text-white shadow-lg" : isDarkMode ? "bg-transparent text-gray-300 border border-gray-700 hover:bg-gray-700 hover:text-white" : "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100"}`;

  const currentJobStatus = useMemo(() => {
    if (!jobData?.job_home) return "Pending";
    const { service_start, service_end, customer_ok, special_approve } = jobData.job_home;
    if (customer_ok && special_approve) return "Completed";
    if (customer_ok) return "Customer Approved";
    if (service_end) return "Ended";
    if (service_start) return "In Process";
    return "Pending";
  }, [jobData]);

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <FaSpinner className="animate-spin text-5xl text-blue-500 mb-4" />
        <p className="text-xl font-semibold">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900 text-red-400" : "bg-red-100 text-red-800"}`}>
        <FaExclamationTriangle className="text-5xl mb-4" />
        <p className="text-xl font-semibold">{error}</p>
        <button onClick={onGoBack} className={`bg-blue-600 hover:bg-blue-700 text-white ${buttonBaseClasses} mt-6`}>
          <FaArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  // Professional Modal Design
  if (showCancelJob || showImageUpload || showPayment || showMessages) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm ${
          isDarkMode ? "bg-black/80" : "bg-white/80"
        }`}
      >
        <div
          className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          {/* HEADER BAR */}
          <div
            className={`flex justify-between items-center px-4 sm:px-6 py-4 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2 className="text-lg sm:text-xl font-semibold">
              {showCancelJob && "Cancel Job"}
              {showImageUpload && "Upload Images"}
              {showPayment && "Payment Details"}
              {showMessages && "Messages"}
            </h2>
            <button
              onClick={() => {
                setShowCancelJob(false);
                setShowImageUpload(false);
                setShowPayment(false);
                setShowMessages(false);
              }}
              className="text-gray-400 hover:text-red-500 transition"
            >
              <FaTimes size={20} sm:size={22} />
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh]">
            {showCancelJob && <CancelJobPage jobs={[jobData?.job_home]} jobId={jobData?.job_home?.id} />}
            {showImageUpload && (
              // FIX: Pass the jobHomeId prop here
              <ImageUpload jobHomeId={jobData?.job_home?.id} />
            )}
            {showPayment && <PaymentPage />}
            {showMessages && <MessagePage onClose={() => setShowMessages(false)} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-6 px-4 sm:px-6 lg:px-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 md:pb-6 border-b border-gray-200 dark:border-gray-700">
          <button className={`${neutralButtonClasses} ${buttonBaseClasses} mb-4 md:mb-0 mr-0 md:mr-4`} onClick={onGoBack}>
            <FaArrowLeft className="text-base" /> Back to Jobs
          </button>
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right flex-grow w-full md:w-auto">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${isDarkMode ? "text-blue-400" : "text-blue-700"} mb-1`}>
              Job: {jobData?.job_home?.job_no ?? "N/A"}
            </h2>
            <p className={`text-lg sm:text-xl lg:text-2xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"} mb-1`}>
              Customer: {jobData?.job_card?.customer_name ?? "Customer Name Not Set"}
            </p>
            <p className={`text-sm sm:text-base lg:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Type: {jobData?.job_home?.job_type ?? "N/A"} | Date: {new Date(jobData?.job_home?.created_at).toLocaleDateString("en-LK")}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <ProgressBar currentStatus={currentJobStatus} isDarkMode={isDarkMode} />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 lg:gap-8 mt-6">
          {/* LEFT SIDE - Main Content Area */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <button onClick={() => setSelectedComponent("JobCard")} className={tabButtonClasses(selectedComponent === "JobCard")}>
                <FaTools className="text-lg sm:text-xl" /> Job Card
              </button>
              <button onClick={() => setSelectedComponent("Quotation")} className={tabButtonClasses(selectedComponent === "Quotation")}>
                <FaQuoteRight className="text-lg sm:text-xl" /> Quotation
              </button>
              {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <button onClick={() => setSelectedComponent("Invoice")} className={tabButtonClasses(selectedComponent === "Invoice")}>
                  <FaFileInvoiceDollar className="text-lg sm:text-xl" /> Invoice
                </button>
              )}
            </div>
            <div>
              {selectedComponent === "JobCard" && jobData?.job_home?.id && (
                <JobCard jobHomeId={jobData.job_home.id} jobCardId={jobCardId} />
              )}
              {selectedComponent === "Quotation" && <Quotation />}
              {selectedComponent === "Invoice" && <Invoice />}
            </div>
          </div>

          {/* RIGHT SIDE - Toggles and Actions */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {/* TOGGLES */}
            <div className={`p-4 rounded-xl border shadow-inner ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Job Status Toggles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-3">
                {renderToggle("Service Start", "service_start")}
                {renderToggle("Service End", "service_end")}
                {(userRole === 'Administrator' || userRole === 'Tecnical_Head' || userRole === 'Manager') && (
                  renderToggle("Customer OK", "customer_ok")
                )}
                {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                  renderToggle("Special Approve", "special_approve")
                )}
              </div>
            </div>

            {/* PAYMENT */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
              <div className={`mt-6 p-4 rounded-xl border shadow-inner ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Payment</h3>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowPayment(true)}
                    className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg ${buttonBaseClasses} w-full`}
                  >
                    <FaMoneyBillWave className="text-lg" /> Payment
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className={`mt-6 p-4 rounded-xl border shadow-inner ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
              <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Actions</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => setShowImageUpload(true)} className={`${neutralButtonClasses} ${buttonBaseClasses} w-full`}>
                  <FaImage className="text-lg" /> Images
                </button>
                {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                  <button onClick={() => setShowMessages(true)} className={`${neutralButtonClasses} ${buttonBaseClasses} w-full`}>
                    <FaEnvelope className="text-lg" /> Message
                  </button>
                )}
              </div>

              {/* ASSIGN TECHNICIAN */}
              {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <div className="mt-4">
                  <Link to="#" className="no-underline">
                    <button className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg ${buttonBaseClasses} w-full`}>
                      <UserPlus className="text-lg mr-2" /> Assign Technician
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* CANCEL JOB */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
              <div className={`mt-6 p-4 rounded-xl border shadow-inner ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Cancel Job</h3>
                <div className="mt-2">
                  <button onClick={() => setShowCancelJob(true)} className={`${destructiveButtonClasses} ${buttonBaseClasses} w-full`}>
                    <CircleX className="text-lg mr-2" /> Cancel Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        show={confirmToggle.show}
        title="Confirm Action"
        message={`Are you sure you want to ${confirmToggle.currentValue ? "disable" : "enable"} ${confirmToggle.field?.replace(/_/g, " ")}?`}
        onConfirm={confirmToggleChange}
        onCancel={() => setConfirmToggle({ show: false, field: null, currentValue: null })}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default JobHome;
