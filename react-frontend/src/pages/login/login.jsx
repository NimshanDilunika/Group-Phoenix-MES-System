// LoginPage.jsx (Assuming this is in your pages/login folder)
import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF, FaGithub, FaMoon, FaSun } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from "../../components/ThemeContext/ThemeContext"; // Adjust the path if needed
import axios from 'axios'; // Import axios

const LoginPage = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Define your Laravel API base URL
  const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Or whatever your Laravel backend URL is

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => { // Make function async
    e.preventDefault();
    setError('');
    setSuccess(false); // Reset success state

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Make a POST request to your Laravel login endpoint
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password,
      });

      // If login is successful
      if (response.status === 200) {
        setSuccess(true);
        setError(''); // Clear any previous errors

        const { access_token, user } = response.data;

        // --- FIXED: Store the token using the key 'authToken' ---
        localStorage.setItem('authToken', access_token);
        console.log('user:', user); // Debugging line to check token
        localStorage.setItem('user', JSON.stringify(user));
        // Optionally store user data
        //localStorage.setItem('user_data', JSON.stringify(user));

        console.log('Login successful:', response.data);

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 422) { // Laravel validation error (e.g., incorrect credentials)
          if (err.response.data.errors && err.response.data.errors.email) {
            setError(err.response.data.errors.email[0]); // Display Laravel's specific error message
          } else {
            setError('Invalid email or password. Please try again.');
          }
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('An unexpected error occurred during login.');
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your network connection or API URL.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error: ' + err.message);
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        isDarkMode ? 'dark' : ''
      }`}
    >
      <div
        className={`max-w-md w-full bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden ${
          isDarkMode ? 'dark:bg-gray-800 dark:bg-opacity-90' : ''
        }`}
      >
        {/* Card Header */}
        <div className="px-8 pt-8 pb-6 relative">
          <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Sign in to your account
          </p>
          {/* Dark Mode Toggle */}
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-2"
            onClick={toggleTheme}
          >
            {isDarkMode ? <FaMoon className="h-5 w-5" /> : <FaSun className="h-5 w-5" />}
          </button>
        </div>
        {/* Card Body */}
        <div className="px-8 pb-8">
          {success ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
              Login successful! Redirecting...
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
              {error}
            </div>
          ) : null}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500' : ''
                  }`}
                  placeholder="example@domain.com"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-200">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-500 hover:text-blue-600">
                  Forgot password?
                </a>
              </div>
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:-translate-y-1"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
