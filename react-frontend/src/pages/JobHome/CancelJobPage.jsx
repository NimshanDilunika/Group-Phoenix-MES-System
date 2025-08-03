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
        <div className={` transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}>
            <div className="flex flex-col items-center justify-center p-6 flex-grow">
                <div className={`rounded-lg shadow-lg p-8 w-full max-w-xl relative z-10 transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-900 border border-gray-300"
                }`}>
                    <p className="text-sm text-gray-500 mb-2 text-center">Job ID: {jobId}</p>
                    <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Cancel Job</h2>

                    {jobDetails && (
                        <div className="mb-6 space-y-2">
                            <p><strong>Job Name:</strong> {jobDetails.name}</p>
                            <p><strong>Job Number:</strong> {jobDetails.number}</p>
                            <p><strong>Date:</strong> {jobDetails.date}</p>
                        </div>
                    )}

                    <label className="block mb-2 font-semibold">Reason:</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`w-full p-3 rounded mb-4 border transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                        }`}
                        placeholder="Enter reason for cancellation"
                    />

                    <label className="block mb-2 font-semibold">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full p-3 rounded mb-6 border transition-colors duration-300 ${
                            isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-600"
                        }`}
                        placeholder="Enter detailed description"
                        rows={4}
                    />

                    <button
                        onClick={handleInitialCancel}
                        className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 font-semibold transition-colors duration-300"
                    >
                        Cancel Job
                    </button>
                    <br/>
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