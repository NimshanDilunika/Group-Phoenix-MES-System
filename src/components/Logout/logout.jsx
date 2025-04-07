import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
  const navigate = useNavigate();
  const delay = 1200; // Slightly shorter, professional feel

  useEffect(() => {
    localStorage.removeItem('authToken');

    const timer = setTimeout(() => {
      navigate('/login');
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, delay]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-10 max-w-md w-full">
        <div className="mb-6">
          <svg className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1m6 4h.01M9 16h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Logging Out</h1>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-5">
          Please wait while we securely log you out.
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
          Redirecting in <span className="font-semibold">{delay / 1000}</span> seconds...
        </p>
      </div>
    </div>
  );
}

export default LogoutPage;