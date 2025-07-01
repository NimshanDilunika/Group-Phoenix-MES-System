import React, { useState, useEffect, useContext } from "react";
import { Check, Tag, Trash2, Edit, Save, X, WifiOff } from "lucide-react";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons
import { ThemeContext } from "../../components/ThemeContext/ThemeContext"; // Re-added ThemeContext import
import axios from "axios"; // Import Axios

// Confirmation Modal Component (defined here for self-contained example)
// You might move this to its own file (e.g., components/ConfirmationModal.jsx)
// if you have a proper file structure and import it.
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


const AddItem = () => {
  // Re-enabled ThemeContext usage
  const { isDarkMode } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    itemName: "",
    serviceTimeout: "",
    icon: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    itemName: "",
    serviceTimeout: "",
    icon: "",
  });

  // State for the custom confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState(null);
  const [itemToDeleteName, setItemToDeleteName] = useState("");


  // Effect to fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Effect for auto-clearing success/error messages
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 5000); // Messages disappear after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Function to fetch all items from the API
  const fetchItems = async () => {
    try {
      // Changed to 'authToken' for consistency with AddUser.jsx
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("User is not authenticated. Please log in.");
        return;
      }
      const response = await axios.get("http://127.0.0.1:8000/api/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      setErrorMessage("Failed to fetch items. " + (error.response?.data?.message || error.message));
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Handler for form input changes (for adding a new item)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for form input changes (for editing an existing item)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for submitting the "Add Item" form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(""); // Clear previous messages
    setErrorMessage("");

    try {
      // Changed to 'authToken' for consistency with AddUser.jsx
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("User is not authenticated. Please log in.");
        setIsSubmitting(false);
        return;
      }
      const response = await axios.post(
        "http://127.0.0.1:8000/api/items",
        {
          // Ensure these field names match your backend's expectations
          // Using formData.itemName and formData.serviceTimeout directly
          itemName: formData.itemName,
          serviceTimeout: formData.serviceTimeout,
          icon: formData.icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' // Explicitly set content type
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage(
          `Item "${formData.itemName || "New Item"}" has been added successfully!`
        );
        // Clear form fields after successful submission
        setFormData({
          itemName: "",
          serviceTimeout: "",
          icon: "",
        });
        fetchItems(); // Refresh the list of items
      }
    } catch (error) {
      console.error("Error adding item:", error);
      if (error.response) {
        if (error.response.status === 422) {
          // Handle validation errors from the backend
          const errors = error.response.data.errors;
          let errorMsg = "Validation failed. Please correct the following errors:\n";
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              errorMsg += `- ${key}: ${errors[key].join(', ')}\n`;
            }
          }
          setErrorMessage(errorMsg);
        } else {
          // Handle other server-side errors
          setErrorMessage(
            error.response.data.message ||
              `Server Error: ${error.response.status} ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrorMessage("Network Error: No response from server. Please check if the backend is running and accessible.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrorMessage(`Client Error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to show the custom confirmation modal
  const handleDeleteClick = (id, name) => {
    setItemToDeleteId(id);
    setItemToDeleteName(name);
    setShowDeleteModal(true);
  };

  // Function called when "Confirm" is clicked on the modal
  const confirmDelete = async () => {
    setShowDeleteModal(false); // Close the modal
    if (!itemToDeleteId) return; // Should not happen if modal is properly used

    try {
      setErrorMessage(""); // Clear any existing error messages

      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("User is not authenticated. Please log in.");
        return;
      }

      console.log('Making DELETE request to:', `http://127.0.0.1:8000/api/items/${itemToDeleteId}`);

      const response = await axios.delete(`http://127.0.0.1:8000/api/items/${itemToDeleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Delete response:', response);

      if (response.status === 200 || response.status === 204) {
        setSuccessMessage(`Item "${itemToDeleteName}" deleted successfully.`);
        // Update local state immediately for better UX
        setItems(prevItems => prevItems.filter(item => item.id !== itemToDeleteId));
        // Then refresh from server to ensure consistency, with a slight delay
        setTimeout(() => fetchItems(), 500);
      } else {
        console.warn('Unexpected response status:', response.status);
        setErrorMessage(`Unexpected response: ${response.status}`);
      }

    } catch (error) {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);
      console.error("Error message:", error.message);

      let errorMsg = "Failed to delete item. ";

      if (error.response) {
        console.error("Server error status:", error.response.status);
        console.error("Server error data:", error.response.data);

        switch (error.response.status) {
          case 401:
            errorMsg += "Unauthorized. Please log in again.";
            break;
          case 403:
            errorMsg += "Forbidden. You don't have permission to delete this item.";
            break;
          case 404:
            errorMsg += "Item not found. It may have already been deleted. Refreshing list...";
            fetchItems(); // Refresh to sync with server state
            break;
          case 500:
            errorMsg += "Server error. Please try again later.";
            break;
          default:
            errorMsg += error.response.data?.message ||
                        `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMsg += "Network error. Please check your connection and ensure the server is running.";
      } else {
        errorMsg += `Request error: ${error.message}`;
      }

      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setItemToDeleteId(null);
      setItemToDeleteName("");
    }
  };

  // Function called when "Cancel" is clicked on the modal
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDeleteId(null);
    setItemToDeleteName("");
    console.log('Delete cancelled by user via modal');
  };

  // Initiates the editing mode for a specific item
  const startEditing = (item) => {
    setEditingItemId(item.id);
    setEditFormData({
      itemName: item.name, // 'name' from API response
      serviceTimeout: item.service_timeout || "", // 'service_timeout' from API response
      icon: item.icon || "",
    });
  };

  // Cancels the editing mode and resets edit form data
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditFormData({
      itemName: "",
      serviceTimeout: "",
      icon: "",
    });
    fetchItems(); // Re-fetch items to discard any unsaved local changes
  };

  // Saves the edited item data to the API
  const saveEdit = async (id) => {
    try {
      // Changed to 'authToken' for consistency with AddUser.jsx
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorMessage("User is not authenticated. Please log in.");
        return;
      }
      const response = await axios.put(
        `http://127.0.0.1:8000/api/items/${id}`,
        {
          // Ensure these field names match your backend's expectations
          // Using editFormData.itemName and editFormData.serviceTimeout directly
          itemName: editFormData.itemName,
          serviceTimeout: editFormData.serviceTimeout,
          icon: editFormData.icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      if (response.status === 200) {
        setSuccessMessage("Item updated successfully.");
        setEditingItemId(null); // Exit editing mode
        fetchItems(); // Refresh the list of items
      }
    } catch (error) {
      console.error("Error updating item:", error);
      setErrorMessage("Failed to update item. " + (error.response?.data?.message || error.message));
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Define background and text colors based on the theme for consistent styling
  const inputBgColor = isDarkMode ? "bg-gray-800" : "bg-gray-200";
  const inputTextColor = isDarkMode ? "text-white" : "text-gray-800";
  const placeholderColor = isDarkMode
    ? "placeholder-gray-400"
    : "placeholder-gray-500";

  // Helper function to dynamically render Lucide icons
  const renderLucideIcon = (iconName, size = 20, className = "") => {
    const IconComponent = LucideIcons[iconName];
    // If the icon component exists, render it. Otherwise, render a fallback Tag icon.
    if (IconComponent) {
      return <IconComponent size={size} className={className} />;
    }
    return <Tag size={size} className={`${className} text-red-500`} />; // Add red color to fallback for visibility
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      } space-y-8 p-6 min-h-screen flex flex-col`}
    >
      {/* Page Header */}
      <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-lg flex justify-between items-center`}>
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add Item</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Create a new Item</p>
        </div>
      </div>

      {/* Success and Error Messages Display */}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded-lg shadow-md flex items-center justify-between">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage("")} className="ml-4">
            <X size={20} />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-md flex items-start justify-between">
          <span className="whitespace-pre-line">{errorMessage}</span> {/* Use whitespace-pre-line for multi-line errors */}
          <button onClick={() => setErrorMessage("")} className="ml-4">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Add Item Form Section */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-white border border-gray-200"
        } rounded-xl p-6 shadow-lg`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Item Name Input */}
            <div className="space-y-2">
              <label
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Item Name
              </label>
              <div
                className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}
              >
                <Tag
                  size={20}
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
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

            {/* Service Timeout Input */}
            <div className="space-y-2">
              <label
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Service Timeout
              </label>
              <div
                className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}
              >
                <WifiOff
                  size={20}
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  name="serviceTimeout"
                  value={formData.serviceTimeout}
                  onChange={handleChange}
                  placeholder="e.g., Enter month"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                />
              </div>
            </div>

            {/* Icon Input with Live Preview */}
            <div className="space-y-2">
              <label
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Icon
              </label>
              <div
                className={`flex items-center space-x-2 ${inputBgColor} p-3 rounded-lg`}
              >
                <span>
                  {/* Render dynamic icon based on formData.icon, with a fallback */}
                  {renderLucideIcon(
                    formData.icon,
                    20,
                    isDarkMode ? "text-blue-400" : "text-blue-500"
                  )}
                </span>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="Enter Lucide Icon name (e.g., Clock)"
                  className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                />
              </div>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-700"
                }`}
              >
                Enter the name of a{" "}
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Lucide icon
                </a>
                .
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium transition-colors ${
                isSubmitting ? "opacity-75 cursor-wait" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Item..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>

      {/* Items List Section (Card-based display) */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-white border border-gray-200"
        } rounded-xl p-6 shadow-lg mb-6 flex-grow overflow-auto mt-4`}
      >
        <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Items List</h2>
        {items.length === 0 ? (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`${
                  isDarkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-gray-50 border border-gray-200"
                } rounded-lg p-4 shadow-sm flex flex-col`}
              >
                {editingItemId === item.id ? (
                  // Edit mode for a specific item card
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`edit-itemName-${item.id}`} className="text-sm font-medium w-24">Name:</label>
                      <input
                        id={`edit-itemName-${item.id}`}
                        type="text"
                        name="itemName"
                        value={editFormData.itemName}
                        onChange={handleEditChange}
                        className={`border p-2 rounded-md flex-grow ${inputTextColor} ${inputBgColor}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`edit-serviceTimeout-${item.id}`} className="text-sm font-medium w-24">Timeout:</label>
                      <input
                        id={`edit-serviceTimeout-${item.id}`}
                        type="text"
                        name="serviceTimeout"
                        value={editFormData.serviceTimeout}
                        onChange={handleEditChange}
                        className={`border p-2 rounded-md flex-grow ${inputTextColor} ${inputBgColor}`}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`edit-icon-${item.id}`} className="text-sm font-medium w-24">Icon:</label>
                      <div className={`flex items-center space-x-2 border p-2 rounded-md flex-grow ${inputBgColor}`}>
                         {/* Live preview for icon during editing */}
                         {renderLucideIcon(
                            editFormData.icon,
                            20,
                            isDarkMode ? "text-blue-400" : "text-blue-500"
                          )}
                        <input
                          id={`edit-icon-${item.id}`}
                          type="text"
                          name="icon"
                          value={editFormData.icon}
                          onChange={handleEditChange}
                          placeholder="Lucide Icon"
                          className={`bg-transparent border-none ${inputTextColor} ${placeholderColor} focus:outline-none w-full`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                        title="Save"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        title="Cancel"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display mode for a specific item card
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {renderLucideIcon(
                          item.icon,
                          24,
                          isDarkMode ? "text-blue-400" : "text-blue-600"
                        )}
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(item)}
                          className={`p-2 rounded-full ${isDarkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-200'} transition-colors`}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id, item.name)} // Changed to show modal
                          className={`p-2 rounded-full ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-200'} transition-colors`}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="font-medium">Timeout:</span> {item.service_timeout || "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Confirmation Modal Render */}
      <ConfirmationModal
        show={showDeleteModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${itemToDeleteName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default AddItem;
