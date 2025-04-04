import React, { useState, useContext } from "react";
import { User, Mail, Lock, Shield, Check, Sun, Moon, CreditCard, Phone, UserPlus } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const AddUser = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    idCardNumber: "",
    phoneNumber: "",
    role: "Administrator"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccessMessage(`User ${formData.fullName || formData.email} has been added successfully!`);
      setIsSubmitting(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setFormData({
          fullName: "",
          username: "",
          email: "",
          password: "",
          idCardNumber: "",
          phoneNumber: "",
          role: "Administrator"
        });
      }, 3000);
    }, 1000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Define background and text colors for input fields
  const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const inputTextColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <div className={`p-6 space-y-8 min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gray-100'}`}>
      {/* Header Section with Theme Toggle */}
      <div className={`${isDarkMode ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New User</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new system user</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-600 text-white p-4 rounded-lg flex items-center space-x-2">
          <Check size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Section */}
      <div className={`${isDarkMode ? 'bg-black border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Full Name</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <User size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
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
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <Lock size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* ID Card Number */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID Card Number</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <CreditCard size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleChange}
                  placeholder="Enter ID card number"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone Number</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <Phone size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
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
                  className={`bg-transparent border-none ${inputTextColor} focus:outline-none w-full appearance-none`}
                >
                  <option value="Administrator" className={isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}>Administrator</option>
                  <option value="Manager" className={isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}>Manager</option>
                  <option value="Staff" className={isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}>Staff</option>
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
    </div>
  );
};

export default AddUser;