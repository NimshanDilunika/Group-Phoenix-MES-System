import React from "react";

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

export default ConfirmationModal;