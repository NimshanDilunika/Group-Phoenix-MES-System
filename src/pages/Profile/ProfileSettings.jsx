import React, { useContext, useState, useRef } from 'react';
import { ThemeContext } from '../../components/ThemeContext/ThemeContext';
import { Check } from 'react-feather'; // Assuming you have react-feather installed
import { FiUser } from "react-icons/fi";

const ProfileSettings = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  const handleUsernameChange = (event) => setUsername(event.target.value);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call to save profile data
    setTimeout(() => {
      // In a real application, you would send username and profileImage to your backend
      console.log('Saving profile:', { username, profileImage });
      setSaveSuccessMessage("Profile saved successfully!");
      setIsSaving(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccessMessage("");
      }, 3000);
    }, 1000);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => fileInputRef.current.click();
  const handleRemoveImage = () => setProfileImage(null);

  return (
    <div className={`min-h-screen p-6 transition-all ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-6 shadow-xl mx-auto`}>
      <h2 className="text-3xl font-semibold mb-6">Profile Settings</h2>
      </div>

      {/* Success Message */}
      {saveSuccessMessage && (
        <div className="bg-green-600 text-white p-4 rounded-lg flex items-center space-x-2 mb-4">
          <Check size={20} />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Profile Image Section */}
      <div className={`shadow-md rounded-lg p-6 mt-6 flex items-center space-x-6 transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-gray-100 border-gray-300'}`}>
        <div>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-gray-500" />
          ) : (
            <FiUser className="w-24 h-24 rounded-full text-gray-400" />
          )}
        </div>
        <div>
          <button onClick={handleUploadButtonClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition-all">
            Change Image
          </button>
          {profileImage && (
            <button onClick={handleRemoveImage} className="ml-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-all">
              Remove
            </button>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
          <p className="text-sm dark:text-gray-400 mt-1">PNG or JPG (Max 2MB)</p>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className={`shadow-md rounded-lg p-6 mt-6 transition-all ${isDarkMode ? 'bg-gray-800 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
        <h3 className="text-xl font-semibold mb-4">Account</h3>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm dark:text-gray-400 font-bold mb-2 ">
            Username
          </label>
          <input
            type="text"
            id="username"
            className={`w-full py-2 px-3 rounded-md border focus:ring-2 focus:outline-none transition-all ${
              isDarkMode ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-400'
            }`}
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        
        {/* Removed the "Change Username" button as the "Save" button will handle this */}
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <button
            onClick={handleSaveProfile}
            className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-colors mt-6 ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
            disabled={isSaving}
        >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
        </button>
        </div>
    </div>
  );
};

export default ProfileSettings;