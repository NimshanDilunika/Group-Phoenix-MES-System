import React, { useState, useContext } from "react";
import { Check, Sun, Moon, Clock, WifiOff, Tag } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const AddItem = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    itemName: "",
    duration: "",
    serviceTimeout: "",
    icon: "", // You might want to handle icon selection differently
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call for adding an item
    setTimeout(() => {
      setSuccessMessage(`Item "${formData.itemName || 'New Item'}" has been added successfully!`);
      setIsSubmitting(false);

      // Clear message and form after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
        setFormData({
          itemName: "",
          duration: "",
          serviceTimeout: "",
          icon: "",
        });
      }, 3000);
    }, 1000);
  };

  // Define background and text colors based on the theme
  const inputBgColor = isDarkMode ? 'bg-gray-800' : 'bg-gray-200';
  const inputTextColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} space-y-8 p-6 min-h-screen`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
        <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New Item</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Configure a new item</p>
        </div>
      </div>
      

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-600 text-white p-4 rounded-lg flex items-center space-x-2">
          <Check size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Item Name</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <Tag size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                  required
                />
              </div>
            </div>

            {/* Duration */}
            {/* <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Duration</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <Clock size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 30 minutes, 1 hour"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                />
              </div>
            </div> */}

            {/* Service Timeout */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Service Timeout</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                <WifiOff size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  name="serviceTimeout"
                  value={formData.serviceTimeout}
                  onChange={handleChange}
                  placeholder="e.g., 5 minutes, 10 seconds"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                />
              </div>
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Icon</label>
              <div className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}>
                {/* You might want to replace this with a more sophisticated icon picker */}
                <span>{formData.icon ? <formData.icon size={20} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} /> : <Tag size={20} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />}</span>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Enter Lucide Icon name (e.g., Clock)"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                  // Consider using a select dropdown or a dedicated icon picker here
                />
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-700'}`}>Enter the name of a <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lucide icon</a>.</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-colors ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Item...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;