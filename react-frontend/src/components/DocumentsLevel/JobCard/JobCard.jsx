import { useState, useContext, useEffect, useRef } from "react";
import { FaCalendarAlt, FaTrash, FaEdit, FaDownload, FaPrint, FaCheck,FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Added FaChevronDown, FaChevronUp
import { ThemeContext } from "../../ThemeContext/ThemeContext";
//import jsPDF from "jsPDF";
import axios from "axios"; // Ensure axios is imported for data fetching
import Notification from '../../Notification/Notification';
import { useAuth } from '../../../pages/hooks/useAuth';
import { Calendar } from "../../Calender/Calendar";
import dayjs from "dayjs";

const JobCard = ({ jobHomeId, jobCardId: initialJobCardId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [jobCardId, setJobCardId] = useState(initialJobCardId || null);
  const [isEditing, setIsEditing] = useState(false); // Start in view mode
  // Initialize with the current date, formatted for consistency.
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  
  // New state to control the calendar's visibility.
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const { userRole, isLoading } = useAuth();
  
  // Add an effect to handle initial `jobCardId` from props, if needed.
  useEffect(() => {
      if (initialJobCardId) {
          setJobCardId(initialJobCardId);
      }
  }, [initialJobCardId]);

  // Handler for when a day is clicked in the calendar.
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsCalendarOpen(false); // Automatically close the calendar after selection.
  };
  // Check if user has permission to edit job cards
  const canEditJobCards = userRole === 'Administrator' || userRole === 'Tecnical_Head' || userRole === 'Manager';
  // For technicians, they can create new job cards but not edit existing ones
  const canCreateJobCards = userRole === 'Administrator' || userRole === 'Tecnical_Head' || userRole === 'Manager';
  
  // Set initial editing state based on user role and whether this is a new job card
  useEffect(() => {
    if (!isLoading) {
      // If this is a new job card and user can create job cards, enable editing
      if (!initialJobCardId && canCreateJobCards) {
        setIsEditing(true);
      }
      // If this is an existing job card and user can edit job cards, allow editing after fetch
      else if (initialJobCardId && canEditJobCards) {
        // Will be set to false after fetching data, user can click edit button
      }
    }
  }, [isLoading, initialJobCardId, canCreateJobCards, canEditJobCards]);

  const [fields, setFields] = useState({
    customer_name: "", fam_no: "", contact_person: "", area: "",
    contact_number: "", branch_sc: "", generator_make: "", kva: "",
    engine_make: "", last_service: "", alternator_make: "",
    gen_model: "", controller_module: "", avr: "", ats_info: "",
    job_description: "",
    engine_se_no: "",
    alternator_se_no: ""
  });

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [areas, setAreas] = useState([]);
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
    oil_filter: false, oil_filter_desc: "",
    fuel_filter: false, fuel_filter_desc: "",
    air_filter: false, air_filter_desc: "",
    battery_charge: false, battery_charge_desc: "",
    oil: false, oil_desc: "",
    battery: "", other: "",
  });

  const [items, setItems] = useState([{ materialsNo: "", materials: "", quantity: "" }]);

  // --- State for Section Expansion ---
  const [expandedSections, setExpandedSections] = useState({
    customerInfo: false, // Changed from jobCardInfo to customerInfo
    jobCardInfo: false, // Add separate state for job card info
    serviceChecklist: false,
    serviceReport: false,
    itemsReplaced: false,
  });

  // Toggle function for sections
  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // --- Notification State (FIXED: Removed duplicates) ---
  const [notification, setNotification] = useState({ message: "", type: "" }); // type: 'success' or 'error'

  // Function to show notification (FIXED: Removed duplicates)
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000); // Hide after 5 seconds
  };

  // --- Handlers ---
  const handleFieldChange = (e) => {
    if (!isEditing) return; // Prevent changes if not in editing mode
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });

    if (name === "customer_name") {
      const selectedCustomer = customers.find(cust => cust.customer_name === value);
      setSelectedCustomerId(selectedCustomer ? selectedCustomer.id : null); // Use customer.id as per backend
    }
  };

  const handleFilterChange = (e) => {
    if (!isEditing) return; // Prevent changes if not in editing mode
    const { name, type, checked, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleItemChange = (i, field, value) => {
    if (!isEditing) return;
    const newItems = [...items];
    newItems[i][field] = value;

    // Add new empty row if the last row is being filled
    const lastItem = newItems[newItems.length - 1];
    if (isEditing && i === newItems.length - 1 && (lastItem.materialsNo !== "" || lastItem.materials !== "" || lastItem.quantity !== "")) {
      newItems.push({ materialsNo: "", materials: "", quantity: "" });
    }
    setItems(newItems);
  };

  const handleDeleteRow = (i) => {
    if (!isEditing) return;
    if (items.length > 1) setItems(items.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!isEditing) return;
    
    // Additional check for user permissions
    if (!canCreateJobCards && !canEditJobCards) {
      showNotification("You don't have permission to submit job cards.", "error");
      return;
    }

    // Filter out empty items before sending
    const filteredItems = items.filter(item =>
      item.materialsNo !== "" || item.materials !== "" || item.quantity !== ""
    );

    const payload = {
      job_home_id: jobHomeId,
      selected_date: selectedDate,
      ...fields,
      customer_id: selectedCustomerId,
      oil_filter_state: filters.oil_filter || false,
      oil_filter_value: filters.oil_filter ? (filters.oil_filter_desc || "") : "",
      air_filter_state: filters.air_filter || false,
      air_filter_value: filters.air_filter ? (filters.air_filter_desc || "") : "",
      oil_state: filters.oil || false,
      oil_value: filters.oil ? (filters.oil_desc || "") : "",
      fuel_filter_state: filters.fuel_filter || false,
      fuel_filter_value: filters.fuel_filter ? (filters.fuel_filter_desc || "") : "",
      battery_charge_state: filters.battery_charge || false,
      battery_charge_value: filters.battery_charge ? (filters.battery_charge_desc || "") : "",
      battery_value: filters.battery || "",
      other_value: filters.other || "",
      items: filteredItems,
    };

    console.log("Submitting payload:", payload);

    const url = jobCardId
      ? `http://localhost:8000/api/jobcards/${jobCardId}`
      : "http://localhost:8000/api/jobcards";

    const method = jobCardId ? "PUT" : "POST";

    try {
      const res = await axios({
        method: method,
        url: url,
        data: payload,
        withCredentials: true,
      });
      const data = res.data;
      console.log("Result:", data);
      showNotification(jobCardId ? "Updated successfully." : "Submitted successfully.", "success");

      if (!jobCardId && data.id) {
        setJobCardId(data.id);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Submission failed:", err);
      if (err.response && err.response.status === 409) {
        // Conflict error - job card already exists
        const existingId = err.response.data.id;
        showNotification("Job card already exists. Switching to update mode.", "error");
        setJobCardId(existingId);
        setIsEditing(false);
      } else if (err.response && err.response.data && err.response.data.message) {
        showNotification(`Submission failed: ${err.response.data.message}`, "error");
      } else {
        showNotification("Submission failed.", "error");
      }
    }
  };

  const handleEdit = () => {
    if (canEditJobCards) {
      setIsEditing(true);
    } else {
      showNotification("You don't have permission to edit job cards.", "error");
    }
  };

  // --- Data Fetching Effects ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/customers", {
          withCredentials: true,
        });
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch Job Card data if jobCardId is available
  useEffect(() => {
    const fetchJobCardData = async () => {
      if (jobCardId) {
        try {
          const response = await axios.get(`http://localhost:8000/api/jobcards/${jobCardId}`, {
            withCredentials: true,
          });
          const data = response.data;
          setFields({
            customer_name: data.customer_name || "",
            fam_no: data.fam_no || "",
            contact_person: data.contact_person || "",
            area: data.area || "",
            contact_number: data.contact_number || "",
            branch_sc: data.branch_sc || "",
            generator_make: data.generator_make || "",
            kva: data.kva || "",
            engine_make: data.engine_make || "",
            last_service: data.last_service || "",
            alternator_make: data.alternator_make || "",
            gen_model: data.gen_model || "",
            controller_module: data.controller_module || "",
            avr: data.avr || "",
            ats_info: data.ats_info || "",
            job_description: data.job_description || "",
            engine_se_no: data.engine_se_no || "",
            alternator_se_no: data.alternator_se_no || ""
          });

          // Set selectedDate from fetched data, or default if not present
          setSelectedDate(data.selected_date ? data.selected_date.split('T')[0] : "");

          // Set customer_id
          const foundCustomer = customers.find(c => c.customer_name === data.customer_name);
          if (foundCustomer) {
            setSelectedCustomerId(foundCustomer.id);
          }

          // Populate filters
          const fetchedFilters = {
            oil_filter: data.oil_filter_state || false,
            oil_filter_desc: data.oil_filter_value || "",
            fuel_filter: data.fuel_filter_state || false,
            fuel_filter_desc: data.fuel_filter_value || "",
            air_filter: data.air_filter_state || false,
            air_filter_desc: data.air_filter_value || "",
            battery_charge: data.battery_charge_state || false,
            battery_charge_desc: data.battery_charge_value || "",
            oil: data.oil_state || false,
            oil_desc: data.oil_value || "",
            battery: data.battery_value || "",
            other: data.other_value || "",
          };
          setFilters(fetchedFilters);

          // Populate items, ensure at least one empty row for editing if none exist
          if (data.items && data.items.length > 0) {
            setItems([...data.items, { materialsNo: "", materials: "", quantity: "" }]);
          } else {
            setItems([{ materialsNo: "", materials: "", quantity: "" }]);
          }

          // After fetching, default to not editing unless user has permission
          setIsEditing(false);
        } catch (error) {
          console.error("Error fetching job card data:", error);
          showNotification("Failed to fetch job card data.", "error");
        }
      } else {
        // If creating a new job card, set current date as default
        setSelectedDate(new Date().toISOString().split('T')[0]);
      }
    };
    fetchJobCardData();
  }, [jobCardId, customers]); // Re-fetch if jobCardId or customers change

  // Update areas and branches based on selected customer and area
  useEffect(() => {
    const selectedCustomer = customers.find(cust => cust.customer_name === fields.customer_name);
    if (selectedCustomer) {
      setAreas(selectedCustomer.areas || []);
      const selectedArea = (selectedCustomer.areas || []).find(area => area.areaName === fields.area);
      setBranches(selectedArea?.branches || []);
    } else {
      setAreas([]);
      setBranches([]);
    }
  }, [fields.customer_name, fields.area, customers]);

  // --- PDF Generation Logic ---
  const createPDFDocument = () => {
    const doc = new jsPDF({
      unit: "pt",
      format: "a4"
    });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = margin;

    doc.setFontSize(18);
    doc.text("Magma Engineering Solutions - JOB CARD", pageWidth / 2, y, { align: "center" });
    y += 30;

    doc.setFontSize(12);
    const lineHeight = 18;

    const addField = (label, value) => {
      doc.text(`${label}:`, margin, y);
      doc.text(String(value || ""), margin + 120, y);
      y += lineHeight;
    };

    addField("Job Card No", jobCardId || "New");
    addField("Date", selectedDate);
    addField("Customer Name", fields.customer_name);
    addField("FAM No", fields.fam_no);
    addField("Contact Person", fields.contact_person);
    addField("Area", fields.area);
    addField("Contact Number", fields.contact_number);
    addField("Branch/SC", fields.branch_sc);
    addField("Generator Make", fields.generator_make);
    addField("KVA", fields.kva);
    addField("Engine Make", fields.engine_make);
    addField("Engine Serial No", fields.engine_se_no);
    addField("Last Service", fields.last_service);
    addField("Alternator Make", fields.alternator_make);
    addField("Alternator Serial No", fields.alternator_se_no);
    addField("Gen Model", fields.gen_model);
    addField("Controller Module", fields.controller_module);
    addField("AVR", fields.avr);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Service Checklist:", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;

    // Dynamically add filter fields with descriptions
    Object.keys(filters).forEach(key => {
      // Only process actual filter status, not just descriptions
      if (typeof filters[key] === 'boolean') {
        const descKey = `${key}_desc`;
        const label = key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
        if (filters[key]) { // If checkbox is true
          addField(label, filters[descKey] || "Done"); // Show description or "Done"
        } else if (!filters[key] && filters[descKey]) {
          // If checkbox is false but description is present (e.g., "Not applicable")
          addField(label, filters[descKey]);
        }
      }
    });
    // Add battery and other fields
    if (filters.battery) addField("Battery", filters.battery);
    if (filters.other) addField("Other Remarks", filters.other);

    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("ATS Information:", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;
    doc.text(String(fields.ats_info || ""), margin, y, { maxWidth: pageWidth - 2 * margin });
    y += doc.splitTextToSize(fields.ats_info || "", pageWidth - 2 * margin).length * lineHeight + 5;

    doc.setFont(undefined, "bold");
    doc.text("Job Description:", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;
    const splitDescription = doc.splitTextToSize(fields.job_description || "", pageWidth - 2 * margin);
    doc.text(splitDescription, margin, y);
    y += splitDescription.length * lineHeight + 10;

    doc.setFont(undefined, "bold");
    doc.text("Items/Materials Replaced:", margin, y);
    y += lineHeight;

    const colX = [margin, margin + 60, margin + 200, margin + 450];
    doc.setFont(undefined, "bold"); // Make table headers bold
    doc.text("No", colX[0] + 5, y); // Added a "No" column
    doc.text("Materials No", colX[1], y);
    doc.text("Materials", colX[2], y);
    doc.text("Quantity", colX[3], y);
    y += lineHeight;
    doc.setFont(undefined, "normal");

    items.filter(item => item.materials !== "" || item.materialsNo !== "" || item.quantity !== "").forEach((item, idx) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
        // Re-add table headers on new page
        doc.setFont(undefined, "bold");
        doc.text("No", colX[0] + 5, y);
        doc.text("Materials No", colX[1], y);
        doc.text("Materials", colX[2], y);
        doc.text("Quantity", colX[3], y);
        y += lineHeight;
        doc.setFont(undefined, "normal");
      }
      doc.text(String(idx + 1), colX[0] + 5, y); // Item number
      doc.text(item.materialsNo || "", colX[1], y);
      doc.text(item.materials || "", colX[2], y);
      doc.text(String(item.quantity || ""), colX[3], y);
      y += lineHeight;
    });

    return doc;
  };

  const genaratePDF = () => {
    return createPDFDocument();
  };

  const savePDF = () => {
    const doc = createPDFDocument();
    doc.save(`jobcard_${jobCardId || 'new'}.pdf`);
  };

  const handleDownload = () => {
    savePDF();
  };

  const handlePrint = () => {
    const doc = genaratePDF();
    const string = doc.output('bloburl');
    const x = window.open(string);
    if (x) {
      x.focus();
      // x.print(); // Commented out to prevent immediate print dialog
    } else {
      alert('Please allow popups for this website');
    }
  };

  // --- Component Render ---
  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mt-4 sm:mt-6 md:mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-50 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
      {/* Modern Notification Toast */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border text-white transform transition-all duration-500 ease-out animate-slide-in ${
            notification.type === "success" 
              ? "bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400/20" 
              : "bg-gradient-to-r from-red-500 to-rose-600 border-red-400/20"
          }`}
          role="alert"
          style={{
            boxShadow: notification.type === "success" 
              ? "0 25px 50px -12px rgba(34, 197, 94, 0.4), 0 0 0 1px rgba(34, 197, 94, 0.1)" 
              : "0 25px 50px -12px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.1)"
          }}
        >
          <div className="flex items-center space-x-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              notification.type === "success" ? "bg-white/20" : "bg-white/20"
            }`}>
              {notification.type === "success" ? (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm leading-tight">{notification.message}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-white/60 rounded-full animate-progress" 
              style={{
                animation: 'progress 5s linear forwards'
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-progress {
          animation: progress 5s linear forwards;
        }
      `}</style>

      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} `}>
          Job Card
        </h2>
         
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {
            userRole !== 'Technician' && jobCardId && !isEditing && (
              <button
                onClick={handleEdit}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
              >
                <FaEdit className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
                <span className="text-sm sm:text-base">Edit</span>
              </button>
            )
          }  
          
          {jobCardId && (
            <>
              <button
                onClick={handleDownload}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              >
                <FaDownload className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
                <span className="text-sm sm:text-base">Download</span>
              </button>
              <button
                onClick={handlePrint}
                className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
              >
                <FaPrint className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
                <span className="text-sm sm:text-base">Print</span>
              </button>
            </>
          )}
        </div>
      </div>

      <section
      className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl relative ${
        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}
    >
      <div
        className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6"
        onClick={() => toggleSection('customerInfo')}
      >
        <h3
          className={`text-xl sm:text-2xl font-semibold ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          } flex items-center`}
        >
<<<<<<< HEAD
          <FaInfoCircle className="mr-2 text-blue-400" /> Customer Information
        </h3>
        {expandedSections.customerInfo ? (
          <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </div>
=======
          <h3
            className={`text-xl sm:text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } flex items-center`}
            >
            <FaInfoCircle className="mr-2 text-blue-400" /> Customer Information
          </h3>
          {expandedSections.customerInfo ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.customerInfo ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ maxHeight: expandedSections.customerInfo ? '1000px' : '0' }} // A large enough value
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Date Picker */}
            <div className="col-span-full mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className={`font-semibold text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date:</label>
              <div className="relative flex items-center w-full sm:w-auto flex-grow">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => isEditing && setSelectedDate(e.target.value)}
                  readOnly={!isEditing}
                  className={`w-full px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                />
              </div>
              <div className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                Job Card No: {jobCardId || "N/A"}
              </div>
            </div>
>>>>>>> Maleesha

      {isEditing && isCalendarOpen && (
        <div className="absolute z-50 top-24 left-0 w-full flex justify-center px-4 sm:px-6 md:px-8">
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            onClose={() => setIsCalendarOpen(false)}
          />
        </div>
      )}

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expandedSections.customerInfo ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ maxHeight: expandedSections.customerInfo ? '1000px' : '0' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="col-span-full mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label className={`font-semibold text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date:
            </label>
            <div className="relative flex items-center w-full sm:w-auto flex-grow">
              <div
                onClick={() => isEditing && setIsCalendarOpen(!isCalendarOpen)}
                className={`w-full px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border-2 cursor-pointer
                  ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
                  focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 transition-all duration-200
                  ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}
                  flex items-center justify-between`} // Added flexbox classes here
              >
                {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : 'Select a date'}
                <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            </div>
            <div
              className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold ${
                isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
              }`}
            >
              Job Card No: {jobCardId || 'N/A'}
            </div>
          </div>

          <div>
            <label
              htmlFor="customer_name"
              className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Customer Name:
            </label>
            <select
              id="customer_name"
              name="customer_name"
              value={fields.customer_name}
              onChange={handleFieldChange}
              disabled={!isEditing}
              className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.customer_name}>
                  {customer.customer_name}
                </option>
              ))}
            </select>
          </div>

          {[
            {
              name: 'area',
              label: 'Area',
              type: 'select',
              options: areas.map((a) => ({ value: a.areaName, label: a.areaName })),
            },
            {
              name: 'branch_sc',
              label: 'Branch/SC',
              type: 'select',
              options: branches.map((b) => ({ value: b.branchName, label: b.branchName })),
            },
            { name: 'contact_number', label: 'Contact Number' },
            { name: 'contact_person', label: 'Contact Person' },
          ].map((field) => (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
              >
                {field.label}:
              </label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={fields[field.name]}
                  onChange={handleFieldChange}
                  disabled={!isEditing}
                  className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${
                    isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <option value="">{`Select ${field.label}`}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={fields[field.name]}
                  onChange={handleFieldChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${
                    isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
                  } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Job Card Details Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div
          className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6"
          onClick={() => toggleSection('jobCardInfo')}
        >
          <h3
            className={`text-xl sm:text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } flex items-center`}
            >
            <FaInfoCircle className="mr-2 text-blue-400" /> Job Card Information
          </h3>
          {expandedSections.jobCardInfo ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.jobCardInfo ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ maxHeight: expandedSections.jobCardInfo ? '1000px' : '0' }} // A large enough value
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Job Card Fields */}
            {[
            { name: "fam_no", label: "FAM No" },
            { name: "generator_make", label: "Generator Make" },
            { name: "kva", label: "KVA" },
            { name: "engine_make", label: "Engine Make" },
            { name: "engine_se_no", label: "Engine Serial No" },
            { name: "last_service", label: "Last Service" },
            { name: "alternator_make", label: "Alternator Make" },
            { name: "alternator_se_no", label: "Alternator Serial No" },
            { name: "gen_model", label: "Gen Model" },
            { name: "controller_module", label: "Controller Module" },
            { name: "avr", label: "AVR" },
            ].map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name} className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}:</label>
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={fields[field.name]}
                  onChange={handleFieldChange}
                  readOnly={!isEditing}
                  className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Battery Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div
          className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6"
          onClick={() => toggleSection('serviceChecklist')}
        >
          <h3
            className={`text-xl sm:text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } flex items-center`}
            >
            <FaInfoCircle className="mr-2 text-blue-400" /> Service Checklist
          </h3>
          {expandedSections.serviceChecklist ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.serviceChecklist ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ maxHeight: expandedSections.serviceChecklist ? '1000px' : '0' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {["oil_filter", "fuel_filter", "air_filter", "battery_charge", "oil"].map((name) => (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4" key={name}>
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                  <input
                    type="checkbox"
                    id={name}
                    name={name}
                    checked={filters[name] || false}
                    onChange={handleFilterChange}
                    disabled={!isEditing}
                    className={`h-5 w-5 sm:h-6 sm:w-6 rounded text-blue-600 focus:ring-blue-500 transition-all duration-200 ${isDarkMode ? 'bg-gray-600 border-gray-500' : 'bg-gray-200 border-gray-300'}`}
                  />
                  <label htmlFor={name} className={`font-medium capitalize flex-grow ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {name.replace(/_/g, " ")}:
                  </label>
                </div>
                <input
                  type="text"
                  name={`${name}_desc`}
                  value={filters[`${name}_desc`] || ""}
                  onChange={handleFilterChange}
                  readOnly={!isEditing}
                  placeholder="Description (if any)"
                  className={`w-full sm:w-1/2 border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                />
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 col-span-full">
              <label htmlFor="battery" className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Battery Details:</label>
              <input
                type="text"
                id="battery"
                name="battery"
                value={filters.battery || ""}
                onChange={handleFilterChange}
                readOnly={!isEditing}
                className={`w-full sm:flex-grow border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 col-span-full">
              <label htmlFor="other" className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Other Remarks:</label>
              <input
                type="text"
                id="other"
                name="other"
                value={filters.other || ""}
                onChange={handleFilterChange}
                readOnly={!isEditing}
                className={`w-full sm:flex-grow border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ATS Info and Job Description */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div
          className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6"
          onClick={() => toggleSection('serviceReport')}
        >
          <h3
            className={`text-xl sm:text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } flex items-center`}
            >
            <FaInfoCircle className="mr-2 text-blue-400" /> Service Report
          </h3>
          {expandedSections.serviceReport ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.serviceReport ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ maxHeight: expandedSections.serviceReport ? '1000px' : '0' }}
        >
          <div className="mb-4 sm:mb-6">
            <label htmlFor="ats_info" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ATS Information:</label>
            <input
              type="text"
              id="ats_info"
              name="ats_info"
              value={fields.ats_info}
              onChange={handleFieldChange}
              readOnly={!isEditing}
              className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label htmlFor="job_description" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Description:</label>
            <textarea
              id="job_description"
              name="job_description"
              value={fields.job_description}
              onChange={handleFieldChange}
              readOnly={!isEditing}
              rows="4"
              className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
        </div>
      </section>

      {/* Items Table */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div
          className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6"
          onClick={() => toggleSection('itemsReplaced')}
        >
          <h3
            className={`text-xl sm:text-2xl font-semibold ${
              isDarkMode ? "text-gray-200" : "text-gray-700"
            } flex items-center`}
            >
            <FaInfoCircle className="mr-2 text-blue-400" /> Items/Materials Replaced
          </h3>
          {expandedSections.itemsReplaced ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${expandedSections.itemsReplaced ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
          style={{ maxHeight: expandedSections.itemsReplaced ? '1000px' : '0' }}
        >
          <div className="overflow-x-auto">
            <table className={`w-full text-left rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-blue-100 text-blue-800'}`}>
                <tr>
                  <th className="p-2 sm:p-4 border-b-2 border-r-2 rounded-tl-lg text-xs sm:text-sm md:text-base">Action</th>
                  <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Materials No</th>
                  <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Materials</th>
                  <th className="p-2 sm:p-4 border-b-2 rounded-tr-lg text-xs sm:text-sm md:text-base">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50')}`}>
                    <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                      {isEditing && items.length > 1 && (
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Delete Row"
                        >
                          <FaTrash className="text-base sm:text-lg" />
                        </button>
                      )}
                    </td>
                    <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <input
                        type="text"
                        value={item.materialsNo}
                        onChange={(e) => handleItemChange(index, "materialsNo", e.target.value)}
                        readOnly={!isEditing}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                      />
                    </td>
                    <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <input
                        type="text"
                        value={item.materials}
                        readOnly={!isEditing}
                        onChange={(e) => handleItemChange(index, "materials", e.target.value)}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                      />
                    </td>
                    <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <input
                        type="number"
                        value={item.quantity}
                        readOnly={!isEditing}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Submit Button */}
      <div className="flex justify-end mt-6 sm:mt-8">
        {isEditing && (
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <FaCheck className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
            <span className="text-sm sm:text-base">{jobCardId ? "Update Job Card" : "Create Job Card"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;