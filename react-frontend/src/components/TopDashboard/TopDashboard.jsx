import React, { useContext, useState, useRef, useEffect } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { BsSearch } from "react-icons/bs";
import { FaSun } from 'react-icons/fa';
import { BiBell, BiUserCircle } from "react-icons/bi";
import { MdDarkMode } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { CompanySettingsContext } from '../../context/CompanySettingsContext';
import axios from 'axios'; // Add axios import

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const TopDashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { companyName: contextCompanyName, isLoadingSettings } = useContext(CompanySettingsContext);
  const navigate = useNavigate();
  
  const notificationCount = 5;
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // State to store the user's data from API
  const [userFullName, setUserFullName] = useState('Loading...');
  const [userProfileImageUrl, setUserProfileImageUrl] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userDataError, setUserDataError] = useState(null);

  // Helper function to check if profile image URL is valid and not a placeholder
  const isValidProfileImage = (url) => {
    if (!url) return false;
    return true;
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setIsProfileOpen(false);
    }
  };

  // Function to fetch user data from API
  const fetchUserData = async () => {
    setIsLoadingUser(true);
    setUserDataError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.warn('No auth token found, redirecting to login');
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API_BASE_URL}/profile`, { headers });
      
      console.log('User data fetched from API:', response.data);
      
      // Extract user data from response
      const userData = response.data;
      const fullName = userData.username || 'User';
      const profileImageUrl = userData.profile_image_url || null;
      
      setUserFullName(fullName);
      setUserProfileImageUrl(profileImageUrl);
      
      // Optional: Update localStorage as a backup/cache
      const userDataForStorage = {
        id: userData.id,
        name: fullName,
        username: userData.username,
        email: userData.email,
        profile_image_url: profileImageUrl,
        // Add other fields as needed
      };
      localStorage.setItem('user', JSON.stringify(userDataForStorage));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserDataError('Failed to load user data');
      
      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access, redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      
      // Fallback to localStorage if API fails
      const storedUserData = localStorage.getItem('user');
      if (storedUserData) {
        try {
          const user = JSON.parse(storedUserData);
          setUserFullName(user.name || user.username || 'User');
          setUserProfileImageUrl(user.profile_image_url || null);
          console.log('Using cached user data from localStorage');
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

  // Effect to fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  // Effect to handle click outside profile dropdown
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      console.log('Profile updated, refreshing user data:', event.detail);
      fetchUserData(); // Refetch from API
    };

    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  // Optional: Periodically refresh user data (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Periodic user data refresh');
      fetchUserData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header
        className={`flex justify-between items-center p-4 shadow-md transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <Link to="/" >
          <div className="text-2xl font-semibold cursor-pointer">
            {isLoadingSettings ? "Loading..." : (contextCompanyName || "Magma Engineering Solutions (Pvt) Ltd")}
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center p-2 rounded-full border-2 transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-800 border-gray-500 hover:border-blue-500 focus-within:ring-2 focus-within:ring-blue-300"
                : "bg-gray-100 border-gray-400 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-300"
            }`}
          >
            <BsSearch className={`transition-all ${isDarkMode ? "text-white" : "text-black"}`} />
            <input
              className={`transition-all duration-300 bg-transparent outline-none ml-2 w-40 sm:w-50 h-4 ${
                isDarkMode ? "text-white placeholder-gray-400" : "text-black placeholder-black"
              }`}
              type="text"
              placeholder="Search..."
            />
          </div>
          
          <div>
            {isDarkMode ? (
              <FaSun
                className={`text-2xl transition-all duration-300 cursor-pointer text-white`}
                onClick={toggleTheme}
              />
            ) : (
              <MdDarkMode
                className={`text-2xl transition-all duration-300 cursor-pointer text-black`}
                onClick={toggleTheme}
              />
            )}
          </div>
          
          <div className="relative cursor-pointer group">
            <BiBell className={`text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
            {notificationCount > 0 && (
              <sup
                className={`absolute top-3 left-3 text-xs rounded-full px-2 py-1 ${
                  isDarkMode ? "bg-red-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {notificationCount}
              </sup>
            )}
          </div>

          <div className="relative cursor-pointer group" onClick={toggleProfile} ref={profileRef}>
            <div className="flex items-center gap-2">
              {isLoadingUser ? (
                // Loading state
                <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
              ) : isValidProfileImage(userProfileImageUrl) ? (
                <img
                  src={userProfileImageUrl}
                  alt="Profile"
                  className={`transition-all duration-300 rounded-full object-cover border border-gray-400 w-8 h-8`}
                  onError={(e) => {
                    console.error('Profile image failed to load:', userProfileImageUrl);
                    setUserProfileImageUrl(null); // Remove broken image URL
                  }}
                />
              ) : (
                <BiUserCircle className={`text-2xl transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`} />
              )}
              
              <span className={`transition-all duration-300 ${isDarkMode ? "text-white" : "text-black"}`}>
                {isLoadingUser ? 'Loading...' : userFullName}
                {userDataError && (
                  <span className="text-red-500 text-xs ml-1" title={userDataError}>⚠</span>
                )}
              </span>
            </div>
            
            {isProfileOpen && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-md shadow-xl border ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'} z-10`}>
                <div className={`block px-4 py-2 text-sm hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  Profile
                </div>
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
      </header>
      <hr className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`} />
    </>
  );
};

export default TopDashboard;