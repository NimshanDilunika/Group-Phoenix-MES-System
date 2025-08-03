import React, { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../../components/ThemeContext/ThemeContext';
import { Check } from 'react-feather';
import { FiUser } from "react-icons/fi";
import axios from 'axios';
import { CompanySettingsContext } from '../../context/CompanySettingsContext';
import Notification from '../../components/Notification/Notification'; // Import the Notification component
import { useAuth } from '../hooks/useAuth';

// Base URL for your Laravel API
// IMPORTANT: Adjust this to your actual Laravel backend URL
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Ensure this matches your Laravel API URL

const Settings = () => {
    const { isDarkMode } = useContext(ThemeContext);
    const { setCompanyLogoUrl } = useContext(CompanySettingsContext); // Context to update global logo
    const [companyName, setCompanyName] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankBranch, setBankBranch] = useState('');
    const [headOfTechnicalName, setHeadOfTechnicalName] = useState('');
    const [headOfTechnicalContact, setHeadOfTechnicalContact] = useState('');
    const [profileImage, setProfileImage] = useState(null); // Stores URL (from fetch) or data URL (for preview)
    const [selectedFile, setSelectedFile] = useState(null); // Stores the actual File object for upload
    const [isImageRemoved, setIsImageRemoved] = useState(false); // Flag to signal logo removal
    const fileInputRef = useRef(null); // Ref for the hidden file input
    const [isSaving, setIsSaving] = useState(false); // Loading state for save button
    const [saveSuccessMessage, setSaveSuccessMessage] = useState(""); // Success notification
    const [errorMessage, setErrorMessage] = useState(""); // Error notification
    const { userRole, isLoading } = useAuth();

    // Check if user is Administrator
    const isAdmin = userRole === 'Administrator' || userRole === 'administrator' || userRole === 'admin';
    
    // --- Data Fetching on Component Mount ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch current company settings
                const response = await axios.get(`${API_BASE_URL}/company-settings`);
                const { company_name, logo_url, account_name, account_number, bank_name, bank_branch, head_of_technical_name, head_of_technical_contact } = response.data;
                
                // Set initial state values
                setCompanyName(company_name || ''); // Ensure companyName is a string
                setProfileImage(logo_url); // Set the URL for display
                setCompanyLogoUrl(logo_url); // Update global context for header/nav
                setAccountName(account_name || '');
                setAccountNumber(account_number || '');
                setBankName(bank_name || '');
                setBankBranch(bank_branch || '');
                setHeadOfTechnicalName(head_of_technical_name || '');
                setHeadOfTechnicalContact(head_of_technical_contact || '');
            } catch (error) {
                console.error("Error fetching company settings:", error);
                setErrorMessage("Failed to load company settings.");
            }
        };
        fetchSettings();
    }, [setCompanyLogoUrl]); // Depend on setCompanyLogoUrl to prevent re-fetching on every render if it's unstable

    const handleCompanyNameChange = (event) => {
        if (isAdmin) setCompanyName(event.target.value);
    };
    const handleAccountNameChange = (event) => {
        if (isAdmin) setAccountName(event.target.value);
    };
    const handleAccountNumberChange = (event) => {
        if (isAdmin) setAccountNumber(event.target.value);
    };
    const handleBankNameChange = (event) => {
        if (isAdmin) setBankName(event.target.value);
    };
    const handleBankBranchChange = (event) => {
        if (isAdmin) setBankBranch(event.target.value);
    };
    const handleHeadOfTechnicalNameChange = (event) => {
        if (isAdmin) setHeadOfTechnicalName(event.target.value);
    };
    const handleHeadOfTechnicalContactChange = (event) => {
        if (isAdmin) setHeadOfTechnicalContact(event.target.value);
    };

    const handleSaveProfile = async () => {
        if (!isAdmin) {
            setErrorMessage("You don't have permission to save changes.");
            return;
        }

        setIsSaving(true);
        setSaveSuccessMessage(""); // Clear previous messages
        setErrorMessage("");

        const formData = new FormData();
        formData.append('company_name', companyName);
        formData.append('account_name', accountName);
        formData.append('account_number', accountNumber);
        formData.append('bank_name', bankName);
        formData.append('bank_branch', bankBranch);
        formData.append('head_of_technical_name', headOfTechnicalName);
        formData.append('head_of_technical_contact', headOfTechnicalContact);

        // Logic for handling logo:
        // 1. If a new file is selected, append it.
        // 2. If no new file, but the user clicked 'Remove', send 'remove_logo = 1'.
        // 3. Otherwise, do nothing (keep existing logo).
        if (selectedFile) {
            formData.append('logo', selectedFile); // Append the actual File object
            formData.append('remove_logo', 0); // Explicitly state no removal if new file
        } else if (isImageRemoved) {
            formData.append('remove_logo', 1); // Signal backend to remove the logo
        } else {
            formData.append('remove_logo', 0);
        }

        try {
            // Send the FormData object with correct content type header
            const response = await axios.post(`${API_BASE_URL}/company-settings`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Essential for file uploads
                },
            });

            console.log('Save response:', response.data);
            setSaveSuccessMessage(response.data.message);

            // Update local state and global context with the new data from the backend response
            setCompanyName(response.data.settings.company_name);
            setProfileImage(response.data.settings.logo_url);
            setCompanyLogoUrl(response.data.settings.logo_url);
            setAccountName(response.data.settings.account_name);
            setBankName(response.data.settings.bank_name);
            setBankBranch(response.data.settings.bank_branch);
            setHeadOfTechnicalName(response.data.settings.head_of_technical_name);
            setHeadOfTechnicalContact(response.data.settings.head_of_technical_contact);

            // Reset states after successful save
            setSelectedFile(null);
            setIsImageRemoved(false);

        } catch (error) {
            console.error('Error saving profile:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error status:', error.response.status);

                // Handle validation errors or other API error messages
                if (error.response.data && error.response.data.errors) {
                    const validationErrors = error.response.data.errors;
                    let errorMessages = [];
                    for (const key in validationErrors) {
                        if (validationErrors.hasOwnProperty(key)) {
                            errorMessages = errorMessages.concat(validationErrors[key]);
                        }
                    }
                    setErrorMessage(errorMessages.join('; '));
                } else if (error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message);
                } else {
                    setErrorMessage("An unexpected error occurred while saving (check console).");
                }
            } else {
                setErrorMessage("Network error or no response from server. Check your backend server is running.");
            }
        } finally {
            setIsSaving(false); // Always reset saving state
        }
    };

    // Handler for file input change
    const handleImageChange = (event) => {
        if (!isAdmin) return;
        
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file); // Store the actual file for FormData
            const reader = new FileReader(); // FileReader to create a preview URL
            reader.onloadend = () => {
                setProfileImage(reader.result); // Set profileImage to data URL for immediate display
                setIsImageRemoved(false); // If a new image is selected, it's not considered removed
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // Trigger hidden file input click
    const handleUploadButtonClick = () => {
        if (isAdmin) fileInputRef.current.click();
    };

    // Handler for removing the image
    const handleRemoveImage = () => {
        if (!isAdmin) return;
        setProfileImage(null); // Clear displayed image
        setSelectedFile(null); // No file to send
        setIsImageRemoved(true); // Signal backend to remove existing image
    };

    // Show loading state while checking auth
    if (isLoading) {
        return (
            <div className={`min-h-screen p-6 flex items-center justify-center transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen p-4 md:p-6 transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center`}>
                <div className="mb-4 md:mb-0">
                    <h1 className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Company Settings</h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base`}>
                        {isAdmin ? 'Change Your Company Details' : 'View Company Details (Read Only)'}
                    </p>
                </div>
                {!isAdmin && (
                    <div className={`px-3 py-1 md:px-4 md:py-2 rounded-lg ${isDarkMode ? 'bg-yellow-900 text-yellow-200 border border-yellow-600' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}>
                        <span className="text-xs md:text-sm font-medium">View Only Mode</span>
                    </div>
                )}
            </div>
            
            {/* Notification Components */}
            {saveSuccessMessage && <Notification message={saveSuccessMessage} type="success" onClose={() => setSaveSuccessMessage("")} />}
            {errorMessage && <Notification message={errorMessage} type="error" onClose={() => setErrorMessage("")} />}

            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-4 md:p-6 shadow-lg flex flex-col md:flex-row justify-between items-start gap-6 mt-4 md:mt-8`}>
                {/* Responsive content wrapper: flex-col on mobile, flex-row on desktop */}
                <div className="flex-1 w-full flex flex-col lg:flex-row items-center lg:items-start gap-6">

                    {/* Company Image & Name Section */}
                    <div className="flex flex-col items-center space-y-6 lg:w-1/3">
                        <div className={`shadow-md rounded-lg p-6 w-full flex flex-col items-center space-y-6 transition-all ${isDarkMode ? 'bg-gray-900 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                            <div className="w-36 h-36">
                                {/* Display profile image or placeholder icon */}
                                {profileImage ? (
                                    // If profileImage is a File object (from new selection), create object URL for display
                                    // Otherwise, it's a string URL from backend or data URL from new selection
                                    <img src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage}
                                        alt="Company Icon"
                                        className="w-full h-full rounded-full object-cover border border-gray-500" />
                                ) : (
                                    <FiUser className="w-full h-full rounded-full text-gray-400" />
                                )}
                            </div>
                            {isAdmin && (
                                <div>
                                    <button 
                                        onClick={handleUploadButtonClick} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all"
                                    >
                                        Change Icon
                                    </button>
                                    {profileImage && ( // Show remove button only if an image is displayed
                                        <button 
                                            onClick={handleRemoveImage} 
                                            className="ml-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    {/* Hidden file input */}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
                                    <p className="text-sm dark:text-gray-400 mt-1 text-center">PNG or JPG (Max 2MB)</p>
                                </div>
                            )}
                        </div>

                        {/* Company Name Section */}
                        <div className={`shadow-md rounded-lg p-6 w-full transition-all ${isDarkMode ? 'bg-gray-900 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                            <div>
                                <label htmlFor="companyName" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    id="companyName"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Change Company Name" : "Company Name (Read Only)"}
                                    value={companyName}
                                    onChange={handleCompanyNameChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                        </div>
                    </div>
                
                    <div className="flex-1 w-full space-y-6">
                        {/* Bank Details Section */}
                        <div className={`shadow-md rounded-lg p-6 transition-all ${isDarkMode ? 'bg-gray-900 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                            <div className="mb-4">
                                <label htmlFor="accountName" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    id="accountName"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Account Name" : "Account Name (Read Only)"}
                                    value={accountName}
                                    onChange={handleAccountNameChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="accountNumber" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    id="accountNumber"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Account Number" : "Account Number (Read Only)"}
                                    value={accountNumber}
                                    onChange={handleAccountNumberChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bankName" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Bank Name
                                </label>
                                <input
                                    type="text"
                                    id="bankName"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Bank Name" : "Bank Name (Read Only)"}
                                    value={bankName}
                                    onChange={handleBankNameChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="bankBranch" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Bank Branch
                                </label>
                                <input
                                    type="text"
                                    id="bankBranch"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Bank Branch" : "Bank Branch (Read Only)"}
                                    value={bankBranch}
                                    onChange={handleBankBranchChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                        </div>

                        {/* Head of Technical Section */}
                        <div className={`shadow-md rounded-lg p-6 transition-all ${isDarkMode ? 'bg-gray-900 border border-gray-600' : 'bg-white border border-gray-300'}`}>
                            <div className="mb-4">
                                <label htmlFor="headOfTechnicalName" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Head of Technical Name
                                </label>
                                <input
                                    type="text"
                                    id="headOfTechnicalName"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Head of Technical Name" : "Head of Technical Name (Read Only)"}
                                    value={headOfTechnicalName}
                                    onChange={handleHeadOfTechnicalNameChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="headOfTechnicalContact" className="block text-sm dark:text-gray-400 font-bold mb-2">
                                    Head of Technical Contact
                                </label>
                                <input
                                    type="text"
                                    id="headOfTechnicalContact"
                                    className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
                                        isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
                                    } ${!isAdmin ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder={isAdmin ? "Enter Head of Technical Contact" : "Head of Technical Contact (Read Only)"}
                                    value={headOfTechnicalContact}
                                    onChange={handleHeadOfTechnicalContactChange}
                                    readOnly={!isAdmin}
                                    disabled={!isAdmin}
                                />
                            </div>
                        </div>

                        {/* Save Button - Only show for Admins */}
                        {isAdmin && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-colors mt-6 ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving Changes...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;