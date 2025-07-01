import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User, Mail, Lock, Shield, Check, XCircle, UserPlus, Trash2, Phone,Eye, EyeOff } from "lucide-react"; // Added Phone icon
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

// ConfirmationModal component (remains the same)
const ConfirmationModal = ({ show, title, message, onConfirm, onCancel, isDarkMode }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-blue-200/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className={`px-4 py-2 rounded-md border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} transition-colors`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

import UserProfileIcon from "../../components/UserProfileIcon/UserProfileIcon";

// New UserCard Component
const UserCard = ({ user, isDarkMode, initiateRoleChange, initiateDeleteUser }) => {
    const cardBg = isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200';
    const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const iconColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className={`${cardBg} rounded-lg shadow-md p-6 flex flex-col space-y-4`}>
            <div className="flex items-center space-x-4">
                <UserProfileIcon user={user} isDarkMode={isDarkMode} size={12} />
                <div>
                    <h3 className={`text-lg font-semibold ${textColor}`}>{user.fullname || user.username}</h3>
                    <p className={`text-sm ${subTextColor}`}>@{user.username}</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Mail size={16} className={iconColor} />
                    <p className={`text-sm ${subTextColor}`}>{user.email}</p>
                </div>
                {user.phoneno && (
                    <div className="flex items-center space-x-2">
                        <Phone size={16} className={iconColor} />
                        <p className={`text-sm ${subTextColor}`}>{user.phoneno}</p>
                    </div>
                )}
                {user.idnumber && (
                    <div className="flex items-center space-x-2">
                        <Shield size={16} className={iconColor} />
                        <p className={`text-sm ${subTextColor}`}>ID: {user.idnumber}</p>
                    </div>
                )}
            </div>

            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center space-x-2"> {/* This div for Role and its dropdown */}
                  <label className={`text-sm font-medium ${subTextColor}`}>Role:</label>
                  <select
                      value={user.role}
                      onChange={(e) => initiateRoleChange(user, e.target.value)}
                      className={`py-1 px-2 rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  >
                      <option value="Administrator" className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>Administrator</option>
                      <option value="Manager" className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>Manager</option>
                      <option value="Staff" className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>Staff</option>
                  </select>
              </div>

              {/* This button is now separate and will be pushed to the right by justify-between */}
              <button
                  onClick={() => initiateDeleteUser(user)}
                  className="text-red-600 hover:text-red-800 flex items-center space-x-1 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                  title="Delete User"
              >
                  <Trash2 size={18} />
                  <span className="text-sm">Remove</span>
              </button>
          </div>
        </div>
    );
};

const AddUser = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        idnumber: "",
        phoneno: "",
        role: "Administrator"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // State for Modals (for delete/update confirmations)
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(null); // 'delete' or 'updateRole'
    const [selectedUser, setSelectedUser] = useState(null); // User object for the action
    const [newRoleForUpdate, setNewRoleForUpdate] = useState(''); // New role if action is 'updateRole'

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUserId !== null) {
            fetchUsers();
        }
    }, [currentUserId]);

    // This useEffect is for auto-clearing success/error messages for ADD USER FORM
    useEffect(() => {
        if (successMessage || errorMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
                setErrorMessage("");
            }, 5000); // Messages disappear after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [successMessage, errorMessage]);

    const fetchCurrentUser = async () => {
        if (!authToken) {
            setErrorMessage("Authentication token not found. Please log in.");
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setCurrentUserId(response.data.id);
        } catch (error) {
            setErrorMessage("Failed to fetch current user info.");
        }
    };

    const fetchUsers = async () => {
        if (!authToken) {
            setErrorMessage("Authentication token not found. Please log in.");
            return;
        }
        setLoadingUsers(true);
        try {
            const response = await axios.get("http://localhost:8000/api/users", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const usersData = Array.isArray(response.data) ? response.data : response.data.users;
            const filteredUsers = usersData.filter(user => user.id !== currentUserId);
            setUsers(filteredUsers);
        } catch (error) {
            setErrorMessage("Failed to fetch users. " + (error.response?.data?.message || error.message));
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");
        setErrorMessage("");

        if (!authToken) {
            setErrorMessage("Authentication token not found. Please log in.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/users",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === 'success') {
                setSuccessMessage(response.data.message || `User ${formData.fullname || formData.email} has been added successfully!`);
                setFormData({
                    fullname: "",
                    username: "",
                    email: "",
                    password: "",
                    idnumber: "",
                    phoneno: "",
                    role: "Administrator"
                });
                fetchUsers();
            } else {
                setErrorMessage(response.data.message || "An unexpected response was received.");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage("Unauthorized: Please log in again.");
                } else if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    let errorMsg = "Validation failed. Please correct the following errors:\n";
                    for (const key in errors) {
                        if (errors.hasOwnProperty(key)) {
                            errorMsg += `- ${key}: ${errors[key].join(', ')}\n`;
                        }
                    }
                    setErrorMessage(errorMsg);
                } else {
                    setErrorMessage(error.response.data.message || `Server Error: ${error.response.status} ${error.response.statusText}`);
                }
            } else if (error.request) {
                setErrorMessage("Network Error: No response from server. Please check if the backend is running and accessible.");
            } else {
                setErrorMessage(`Client Error: ${error.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const initiateRoleChange = (user, newRole) => {
        setSelectedUser(user);
        setNewRoleForUpdate(newRole);
        setModalAction('updateRole');
        setShowConfirmModal(true);
    };

    const initiateDeleteUser = (user) => {
        setSelectedUser(user);
        setModalAction('delete');
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        setShowConfirmModal(false);
        setSuccessMessage("");
        setErrorMessage("");

        if (!authToken) {
            setErrorMessage("Authentication token not found. Please log in.");
            setSelectedUser(null);
            setNewRoleForUpdate('');
            setModalAction(null);
            return;
        }

        if (modalAction === 'updateRole' && selectedUser) {
            try {
                const response = await axios({
                    method: 'put',
                    url: `http://localhost:8000/api/users/${selectedUser.id}/role`,
                    data: { role: newRoleForUpdate },
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.data.status === 'success') {
                    setSuccessMessage(response.data.message);
                    fetchUsers();
                } else {
                    setErrorMessage(response.data.message || "Failed to update role.");
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.message || "Error updating role.");
                } else if (error.request) {
                    setErrorMessage("No response from server while updating role.");
                } else {
                    setErrorMessage(`Error updating role: ${error.message}`);
                }
            }
        } else if (modalAction === 'delete' && selectedUser) {
            try {
                const response = await axios({
                    method: 'delete',
                    url: `http://localhost:8000/api/users/${selectedUser.id}`,
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
                if (response.data.status === 'success') {
                    setSuccessMessage(response.data.message);
                    fetchUsers();
                } else {
                    setErrorMessage(response.data.message || "Failed to delete user.");
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.message || "Error deleting user.");
                } else if (error.request) {
                    setErrorMessage("No response from server while deleting user.");
                } else {
                    setErrorMessage(`Error deleting user: ${error.message}`);
                }
            }
        }
        setSelectedUser(null);
        setNewRoleForUpdate('');
        setModalAction(null);
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setSelectedUser(null);
        setNewRoleForUpdate('');
        setModalAction(null);
        fetchUsers();
    };

    const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const inputTextColor = isDarkMode ? 'text-white' : 'text-gray-800';
    const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';

    return (
        <div className={`p-6 space-y-8 min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
                <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New User</h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new system user</p>
                </div>
            </div>

            {successMessage && (
                <div className="bg-green-600 text-white p-4 rounded-lg flex items-center space-x-2">
                    <Check size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-600 text-white p-4 rounded-lg flex items-start space-x-2">
                    <XCircle size={20} className="mt-1" />
                    <span className="whitespace-pre-line">{errorMessage}</span>
                </div>
            )}

            <ConfirmationModal
                show={showConfirmModal}
                title={modalAction === 'delete' ? 'Confirm Deletion' : 'Confirm Role Change'}
                message={
                    modalAction === 'delete'
                        ? `Are you sure you want to delete user ${selectedUser?.fullname || selectedUser?.username || 'this user'}? This action cannot be undone.`
                        : `Are you sure you want to change ${selectedUser?.fullname || selectedUser?.username || 'this user'}'s role to ${newRoleForUpdate}?`
                }
                onConfirm={handleConfirmAction}
                onCancel={handleCancelAction}
                isDarkMode={isDarkMode}
            />

            {/* Add User Form */}
            <div
            className={`${isDarkMode? "bg-gray-900 border border-gray-800": "bg-white border border-gray-200"} rounded-xl p-6 shadow-lg mb-6 flex-grow overflow-auto`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <User size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Username */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Username</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <UserPlus size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter username"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Mail size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Password</label>
                            <div className={`relative flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Lock size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full pr-10`} /* Added pr-10 for icon spacing */
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    // Position the button absolutely on the right within the input container
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
                                    title={showPassword ? "Hide password" : "Show password"} // Add a descriptive title for accessibility
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} /> // Render EyeOff icon when password is visible (click to hide)
                                    ) : (
                                        <Eye size={20} />    // Render Eye icon when password is hidden (click to show)
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ID Card Number */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID Card Number</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Shield size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    name="idnumber"
                                    value={formData.idnumber}
                                    onChange={handleChange}
                                    placeholder="Enter ID card number"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                    // removed required attribute
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Phone size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    name="phoneno"
                                    value={formData.phoneno}
                                    onChange={(e) => {
                                        // Allow only digits and limit length to 10
                                        const value = e.target.value;
                                        if (/^\d{0,10}$/.test(value)) {
                                            handleChange(e);
                                        }
                                    }}
                                    placeholder="Enter phone number"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                    // removed required attribute
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Shield size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                   className={`py-1 px-2 rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:ring-blue-500 focus:border-blue-500 text-sm w-full`}
                                   // removed required attribute
                                >
                                    <option value="Administrator" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Administrator</option>
                                    <option value="Manager" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Manager</option>
                                    <option value="Staff" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Staff</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-colors ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Adding User...' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>

            ---

            {/* Users List - Displaying as Cards */}
            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg mt-`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Users List</h2>
                {loadingUsers ? (
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading users...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> {/* Responsive grid for cards */}
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isDarkMode={isDarkMode}
                                    initiateRoleChange={initiateRoleChange}
                                    initiateDeleteUser={initiateDeleteUser}
                                />
                            ))
                        ) : (
                            <p className={`col-span-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                No users found.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddUser;