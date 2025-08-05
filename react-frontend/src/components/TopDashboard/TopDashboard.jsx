// src/components/TopDashboard.jsx
// Refactored for a more robust and flexible responsive design
import React, { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { FaSun } from 'react-icons/fa';
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { CompanySettingsContext } from '../../context/CompanySettingsContext';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const TopDashboard = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { companyName: contextCompanyName, isLoadingSettings } = useContext(CompanySettingsContext);
    const navigate = useNavigate();
    
    const notificationCount = 5;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const [userFullName, setUserFullName] = useState('Loading...');
    const [userProfileImageUrl, setUserProfileImageUrl] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [userDataError, setUserDataError] = useState(null);

    const isValidProfileImage = (url) => !!url;

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const handleClickOutside = (event) => {
        if (profileRef.current && !profileRef.current.contains(event.target)) {
            setIsProfileOpen(false);
        }
    };

    const fetchUserData = async () => {
        setIsLoadingUser(true);
        setUserDataError(null);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                navigate('/login');
                return;
            }
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}/profile`, { headers });
            const userData = response.data;
            const fullName = userData.username || 'User';
            const profileImageUrl = userData.profile_image_url || null;
            setUserFullName(fullName);
            setUserProfileImageUrl(profileImageUrl);
            const existingUserData = localStorage.getItem('user');
            let existingUser = {};
            if (existingUserData) {
                try {
                    existingUser = JSON.parse(existingUserData);
                } catch (e) {
                    console.warn('Failed to parse existing user data');
                }
            }
            const userDataForStorage = {
                ...existingUser,
                id: userData.id,
                name: fullName,
                username: userData.username,
                email: userData.email,
                profile_image_url: profileImageUrl,
            };
            localStorage.setItem('user', JSON.stringify(userDataForStorage));
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserDataError('Failed to load user data');
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            const storedUserData = localStorage.getItem('user');
            if (storedUserData) {
                try {
                    const user = JSON.parse(storedUserData);
                    setUserFullName(user.name || user.username || 'User');
                    setUserProfileImageUrl(user.profile_image_url || null);
                } catch (parseError) {
                    console.error('Error parsing cached user data:', parseError);
                    setUserFullName('Guest');
                    setUserProfileImageUrl(null);
                }
            } else {
                setUserFullName('Guest');
                setUserProfileImageUrl(null);
            }
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleProfileUpdate = () => {
            fetchUserData();
        };
        window.addEventListener('userProfileUpdated', handleProfileUpdate);
        return () => {
            window.removeEventListener('userProfileUpdated', handleProfileUpdate);
        };
    }, []);

    console.log("Rendering TopDashboard with userFullName:", userFullName, "and profileImageUrl:", userProfileImageUrl);
    useEffect(() => {
        const interval = setInterval(() => {
            fetchUserData();
        }, 5 * 60 * 1000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header
                className={`flex flex-col sm:flex-row items-center justify-between
                    p-3 sm:p-4 lg:p-6 xl:p-8
                    min-h-[48px] lg:min-h-[72px]
                    shadow-md transition-all duration-300 ${
                        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
                    }`}
            >
                {/* Company Name / Logo */}
                <div className="flex-shrink-0 text-center sm:text-left w-full sm:w-auto">
                    <Link to="#" className="text-xl md:text-2xl font-semibold">
                        {isLoadingSettings ? "Loading..." : (contextCompanyName || "Magma Engineering Solutions (Pvt) Ltd")}
                    </Link>
                </div>

                {/* Right-aligned container for icons and profile */}
                <div className="flex-grow flex flex-wrap items-center justify-end mt-3 sm:mt-0 gap-4 sm:gap-6">
                    {/* Icon group for theme, notifications, and profile */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Theme Toggle Button */}
                        <button 
                            onClick={toggleTheme}
                            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <FaSun className="text-xl text-white" />
                            ) : (
                                <MdDarkMode className="text-xl text-black" />
                            )}
                        </button>
                        
                        {/* Notifications */}
                        <div className="relative cursor-pointer group">
                            <BiBell className={`text-xl sm:text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
                            {notificationCount > 0 && (
                                <sup
                                    className={`absolute -top-1 -right-1 text-xs rounded-full px-1.5 py-0.5 ${
                                        isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
                                    }`}
                                >
                                    {notificationCount}
                                </sup>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button 
                                onClick={toggleProfile} 
                                className="flex items-center gap-2 focus:outline-none"
                                aria-expanded={isProfileOpen}
                                aria-controls="profile-menu"
                            >
                                {isLoadingUser ? (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                                ) : isValidProfileImage(userProfileImageUrl) ? (
                                    <img
                                        src={userProfileImageUrl}
                                        alt="Profile"
                                        className="rounded-full object-cover border border-gray-400 w-8 h-8"
                                        onError={() => setUserProfileImageUrl(null)}
                                    />
                                ) : (
                                    <BiUserCircle className={`text-xl sm:text-2xl ${isDarkMode ? "text-white" : "text-black"}`} />
                                )}
                                
                                <span className={`hidden md:inline transition-all duration-300 text-sm font-medium ${isDarkMode ? "text-white" : "text-black"}`}>
                                    {isLoadingUser ? 'Loading...' : userFullName}
                                    {userDataError && (
                                        <span className="text-red-500 text-xs ml-1" title={userDataError}>⚠</span>
                                    )}
                                </span>
                            </button>
                            
                            {isProfileOpen && (
                                <div 
                                    id="profile-menu"
                                    className={`absolute top-full right-0 mt-2 w-40 sm:w-48 rounded-md shadow-xl border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'} z-10`}
                                >
                                    <Link to="#" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        Profile
                                    </Link>
                                    <Link to="/dashboard/ProfileSettings" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        Settings
                                    </Link>
                                    <button 
                                        onClick={fetchUserData}
                                        className={`block w-full text-left px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                                    >
                                        Refresh Data
                                    </button>
                                    <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} my-2`} />
                                    <Link to="/logout" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        Log Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
        </>
    );
};

export default TopDashboard;