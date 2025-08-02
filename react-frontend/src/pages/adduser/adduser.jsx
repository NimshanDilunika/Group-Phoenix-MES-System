import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { User, Mail, Lock, Shield, Phone, Eye, EyeOff, UserPlus, Trash2 } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import Notification from "../../components/Notification/Notification";
import { useAuth } from "../../pages/hooks/useAuth";
import UserProfileIcon from "../../components/UserProfileIcon/UserProfileIcon";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";

// UserCard component to display user information
const UserCard = ({ user, isDarkMode, initiateRoleChange, initiateDeleteUser, userRole }) => {
    const cardBg = isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200';
    const textColor = isDarkMode ? 'text-gray-200' : 'text-gray-900';
    const subTextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const iconColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';

    // Helper function to determine if the role select should be disabled
    const isRoleSelectDisabled = () => {
        if (userRole === 'Administrator') {
            return false; // Administrator can edit any role
        }
        if (userRole === 'Tecnical_Head') {
            // Technical Head can only edit roles of Managers and Technicians
            return user.role === 'Administrator' || user.role === 'Tecnical_Head';
        }
        return true; // All other roles cannot edit
    };

    // Helper function to determine if the delete button should be disabled
    const isDeleteDisabled = () => {
        if (userRole === 'Administrator') {
            return false; // Administrator can delete any user
        }
        if (userRole === 'Tecnical_Head') {
            // Technical Head can delete Managers and Technicians, but not Administrators or other Technical Heads
            return user.role === 'Administrator' || user.role === 'Tecnical_Head';
        }
        return true; // All other roles cannot delete
    };

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
                <div className="flex items-center space-x-2">
                    <label className={`text-sm font-medium ${subTextColor}`}>Role:</label>
                    <select
                        value={user.role}
                        onChange={(e) => initiateRoleChange(user, e.target.value)}
                        className={`py-1 px-2 rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:ring-blue-500 focus:border-blue-500 text-sm`}
                        disabled={isRoleSelectDisabled()}
                    >
                        {userRole === 'Administrator' && (
                            <>
                                <option value="Administrator" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Administrator</option>
                                <option value="Tecnical_Head" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Technical Head</option>
                            </>
                        )}
                        {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                            <>
                                <option value="Manager" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Service center Manager</option>
                                <option value="Technician" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Technician</option>
                            </>
                        )}
                        {userRole !== 'Administrator' && userRole !== 'Tecnical_Head' && (
                            <option value={user.role}>{user.role}</option>
                        )}
                    </select>
                </div>

                <button
                    onClick={() => initiateDeleteUser(user)}
                    className={`text-red-600 hover:text-red-800 flex items-center space-x-1 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${isDeleteDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Delete User"
                    disabled={isDeleteDisabled()}
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
    const { userRole } = useAuth();

    const [formData, setFormData] = useState({
        fullname: "",
        username: "",
        email: "",
        password: "",
        idnumber: "",
        phoneno: "",
        role: "Technician"
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRoleForUpdate, setNewRoleForUpdate] = useState('');

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

    const fetchCurrentUser = async () => {
        if (!authToken) {
            setNotification({ message: "Authentication token not found. Please log in.", type: "error" });
            return;
        }
        try {
            const response = await axios.get("http://localhost:8000/api/user", {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setCurrentUserId(response.data.id);
        } catch (error) {
            setNotification({ message: "Failed to fetch current user info.", type: "error" });
        }
    };

    const fetchUsers = async () => {
        if (!authToken) {
            setNotification({ message: "Authentication token not found. Please log in.", type: "error" });
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
            setNotification({ message: "Failed to fetch users. " + (error.response?.data?.message || error.message), type: "error" });
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

    // Refactored handlePhoneChange to explicitly validate and restrict input
    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        // Allows only digits and limits length to 10
        if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification({ message: '', type: '' });

        if (!authToken) {
            setNotification({ message: "Authentication token not found. Please log in.", type: "error" });
            setIsSubmitting(false);
            return;
        }
        if (!formData.fullname.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim() || !formData.role.trim()) {
            setNotification({ message: "All fields are required.", type: "error" });
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
                setNotification({ message: response.data.message || `User ${formData.fullname || formData.email} has been added successfully!`, type: "success" });
                setFormData({
                    fullname: "",
                    username: "",
                    email: "",
                    password: "",
                    idnumber: "",
                    phoneno: "",
                    role: "Technician"
                });
                fetchUsers();
            } else {
                setNotification({ message: response.data.message || "An unexpected response was received.", type: "error" });
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data.message || error.response.statusText;
                setNotification({ message: `Error: ${errorMessage}`, type: "error" });
            } else if (error.request) {
                setNotification({ message: "Network Error: No response from server. Please check if the backend is running and accessible.", type: "error" });
            } else {
                setNotification({ message: `Client Error: ${error.message}`, type: "error" });
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
        setNotification({ message: '', type: '' });

        if (!authToken) {
            setNotification({ message: "Authentication token not found. Please log in.", type: "error" });
            handleCancelAction();
            return;
        }

        if (modalAction === 'updateRole' && selectedUser) {
            try {
                const response = await axios.put(
                    `http://localhost:8000/api/users/${selectedUser.id}/role`,
                    { role: newRoleForUpdate },
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setNotification({ message: response.data.message || "Role updated successfully!", type: "success" });
                fetchUsers();
            } catch (error) {
                const errorMessage = error.response?.data?.message || `Error updating role: ${error.message}`;
                setNotification({ message: errorMessage, type: "error" });
            }
        } else if (modalAction === 'delete' && selectedUser) {
            try {
                const response = await axios.delete(
                    `http://localhost:8000/api/users/${selectedUser.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`
                        }
                    }
                );
                setNotification({ message: response.data.message || "User deleted successfully!", type: "success" });
                fetchUsers();
            } catch (error) {
                const errorMessage = error.response?.data?.message || `Error deleting user: ${error.message}`;
                setNotification({ message: errorMessage, type: "error" });
            }
        }

        handleCancelAction();
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
        setSelectedUser(null);
        setNewRoleForUpdate('');
        setModalAction(null);
    };

    const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
    const inputTextColor = isDarkMode ? 'text-white' : 'text-gray-800';
    const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';

    return (
        <div className={`p-6 space-y-8 min-h-screen ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />

            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
                <div>
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New User</h1>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new system user</p>
                </div>
            </div>

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

            <div className={`${isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"} rounded-xl p-6 shadow-lg mb-6 flex-grow overflow-auto`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full pr-10`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

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
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Phone size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <input
                                    type="text"
                                    name="phoneno"
                                    value={formData.phoneno}
                                    onChange={handlePhoneChange}
                                    placeholder="Enter phone number"
                                    className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</label>
                            <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                                <Shield size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`py-1 px-2 rounded-md border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-900'} focus:ring-blue-500 focus:border-blue-500 text-sm w-full`}
                                    required
                                >
                                    {userRole === 'Administrator' && <option value="Administrator" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Administrator</option>}
                                    {userRole === 'Administrator' && <option value="Tecnical_Head" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Technical Head</option>}
                                    {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && <option value="Manager" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Service center Manager</option>}
                                    {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && <option value="Technician" className={isDarkMode ? 'bg-gray-600' : 'bg-white'}>Technician</option>}
                                    {userRole !== 'Administrator' && userRole !== 'Tecnical_Head' && (
                                        <option value={formData.role}>{formData.role}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

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

            <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />

            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Users List</h2>
                {loadingUsers ? (
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading users...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {users.length > 0 ? (
                            users.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    isDarkMode={isDarkMode}
                                    initiateRoleChange={initiateRoleChange}
                                    initiateDeleteUser={initiateDeleteUser}
                                    userRole={userRole}
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