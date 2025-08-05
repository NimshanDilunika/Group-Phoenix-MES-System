import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

const CancelJobPage = ({ jobs }) => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { isDarkMode } = useContext(ThemeContext);

    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInitialCancel = () => {
        setConfirmVisible(true);
    };

    const handleConfirmYes = async () => {
        setLoading(true);
        setError(null);
        setConfirmVisible(false);

        try {
            await axios.post(`http://localhost:8000/api/job-cancel/${jobId}`, {
                reason,
                description,
            });
            setLoading(false);
            navigate("/dashboard");
        } catch (err) {
            setLoading(false);
            setError("Failed to cancel job. Please try again.");
            console.error(err);
        }
    };

    const handleConfirmNo = () => {
        setConfirmVisible(false);
    };

    return (
        <div className={`transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}>
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 flex-grow">
                <div className={`rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg md:max-w-xl relative z-10 transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-300"
                }`}>
                    <p className={`text-xs sm:text-sm text-gray-500 mb-2 text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Job ID: {jobId}</p>
                    <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center ${isDarkMode ? "text-red-400" : "text-red-600"}`}>Cancel Job</h2>

                    {jobDetails && (
                        <div className="mb-4 sm:mb-6 space-y-2">
                            <p className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}><strong>Job Name:</strong> {jobDetails.name}</p>
                            <p className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}><strong>Job Number:</strong> {jobDetails.number}</p>
                            <p className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}><strong>Date:</strong> {jobDetails.date}</p>
                        </div>
                    )}

                    <label className={`block mb-2 font-semibold text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Reason:</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`w-full p-2 sm:p-3 rounded-lg mb-4 border transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                        }`}
                        placeholder="Enter reason for cancellation"
                    />

                    <label className={`block mb-2 font-semibold text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full p-2 sm:p-3 rounded-lg mb-6 border transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                        }`}
                        placeholder="Enter detailed description"
                        rows={4}
                    />

                    <button
                        onClick={handleInitialCancel}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-colors duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="text-sm sm:text-base">Cancel Job</span>
                    </button>
                </div>

                <ConfirmationModal
                    show={confirmVisible}
                    title="Confirm Job Cancellation"
                    message={`Are you sure you want to cancel Job Number: ${jobDetails?.number || 'N/A'}? This action cannot be undone.`}
                    onConfirm={handleConfirmYes}
                    onCancel={handleConfirmNo}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
};

export default CancelJobPage;