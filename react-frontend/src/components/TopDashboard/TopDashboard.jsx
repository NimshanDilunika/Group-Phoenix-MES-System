// src/components/TopDashboard.jsx

import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { BsSearch } from "react-icons/bs";
import { FaSun } from 'react-icons/fa';
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { CompanySettingsContext } from '../../context/CompanySettingsContext';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// PropTypes for the component's props, a best practice for a senior engineer
TopDashboard.propTypes = {
  onMobileMenuToggle: PropTypes.func, // Optional prop to integrate with a mobile sidebar toggle
};

const TopDashboard = ({ onMobileMenuToggle }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { companyName: contextCompanyName, isLoadingSettings } = useContext(CompanySettingsContext);
  const navigate = useNavigate();
  
  const notificationCount = 5;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const [userFullName, setUserFullName] = useState('Loading...');
  const [userProfileImageUrl, setUserProfileImageUrl] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userDataError, setUserDataError] = useState(null);

  const isValidProfileImage = (url) => typeof url === 'string' && url.length > 0;

  const toggleProfile = () => {
    setIsProfileOpen(prev => !prev);
  };
  
  const toggleSearch = () => {
    setIsSearchVisible(prev => !prev);
  };

  const handleClickOutside = useCallback((event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  }, []);

  const fetchUserData = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserData();
    };
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, [fetchUserData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchUserData]);

  const commonIconClass = "text-xl sm:text-2xl transition-colors duration-200";
  const iconButtonClass = "p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <>
      <header
        className={`flex items-center justify-between p-3 sm:p-4 shadow-md transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
        role="banner"
      >
        {/* Mobile Menu Toggle Button (Optional, depends on full layout) */}
        {onMobileMenuToggle && (
          <button 
            onClick={onMobileMenuToggle} 
            className={`${iconButtonClass} lg:hidden`}
            aria-label="Open main menu"
          >
            <MdMenu className={`${commonIconClass} text-black dark:text-white`} />
          </button>
        )}

        {/* Company Name / Logo */}
        <div className="flex-shrink-0 mr-4">
          <Link to="/" className="text-xl md:text-2xl font-semibold whitespace-nowrap">
            {isLoadingSettings ? "Loading..." : (contextCompanyName || "Magma Engineering Solutions (Pvt) Ltd")}
          </Link>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex-grow flex items-center justify-end flex-wrap gap-2 sm:gap-4 md:gap-6">
          {/* Responsive Search Input */}
          <div className="relative flex-grow-0 sm:flex-grow">
            <button
              onClick={toggleSearch}
              className={`${iconButtonClass} sm:hidden`}
              aria-label="Toggle search input"
              aria-expanded={isSearchVisible}
            >
              <BsSearch className={`${commonIconClass} ${isDarkMode ? "text-white" : "text-black"}`} />
            </button>

            <div className={`
                absolute top-0 right-0 sm:static
                ${isSearchVisible ? 'w-full flex' : 'hidden'} 
                sm:flex items-center rounded-full border-2 transition-all duration-300
                ${isDarkMode
                  ? "bg-gray-800 border-gray-500 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
                  : "bg-gray-100 border-gray-400 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-300"
                } max-w-xs md:max-w-sm
              `}>
              <BsSearch className={`text-lg ml-3 transition-all ${isDarkMode ? "text-white" : "text-black"}`} />
              <input
                className={`transition-all duration-300 bg-transparent outline-none ml-2 flex-grow h-6 text-sm
                  ${isDarkMode ? "text-white placeholder-gray-400" : "text-black placeholder-gray-500"}`}
                type="text"
                placeholder="Search..."
                aria-label="Search dashboard"
              />
            </div>
          </div>
          
          {/* Icon group */}
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Utility navigation">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className={iconButtonClass}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className={`${commonIconClass} text-white`} />
              ) : (
                <MdDarkMode className={`${commonIconClass} text-black`} />
              )}
            </button>
            
            {/* Notifications */}
            <button className={`${iconButtonClass} relative`} aria-label="Show notifications">
              <BiBell className={`${commonIconClass} ${isDarkMode ? "text-white" : "text-black"}`} />
              {notificationCount > 0 && (
                <span className={`absolute top-0 right-0 h-4 w-4 flex items-center justify-center text-xs rounded-full p-1 leading-none ${
                  isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
                }`} aria-label={`${notificationCount} new notifications`}>
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button 
                onClick={toggleProfile} 
                className={`flex items-center gap-2 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
              >
                {isLoadingUser ? (
                  <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                ) : isValidProfileImage(userProfileImageUrl) ? (
                  <img
                    src={userProfileImageUrl}
                    alt={`${userFullName}'s profile`}
                    className="rounded-full object-cover border border-gray-400 w-8 h-8"
                    onError={() => setUserProfileImageUrl(null)}
                  />
                ) : (
                  <BiUserCircle className={`text-2xl ${isDarkMode ? "text-white" : "text-black"}`} />
                )}
                
                <span className={`hidden md:inline transition-all duration-300 text-sm font-medium ${isDarkMode ? "text-white" : "text-black"}`}>
                  {isLoadingUser ? 'Loading...' : userFullName}
                  {userDataError && (
                    <span className="text-red-500 text-xs ml-1" title={userDataError} role="status">⚠</span>
                  )}
                </span>
              </button>
              
              {isProfileOpen && (
                <div 
                  className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-xl border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'} z-10`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="profile-button"
                >
                  <Link to="/dashboard/profile" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} role="menuitem">
                    Profile
                  </Link>
                  <Link to="/dashboard/ProfileSettings" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} role="menuitem">
                    Settings
                  </Link>
                  <button 
                    onClick={fetchUserData}
                    className={`block w-full text-left px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    role="menuitem"
                  >
                    Refresh Data
                  </button>
                  <hr className={`${isDarkMode ? 'border-gray-700' : 'border-gray-300'} my-2`} />
                  <Link to="/logout" className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} role="menuitem">
                    Log Out
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
    </>
  );
};

export default TopDashboard;