import { useState, useContext, useEffect } from "react"; // Import useEffect for data fetching
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { FaEdit, FaDownload, FaPrint, FaCheck, FaSun, FaMoon } from 'react-icons/fa'; // Import sun/moon icons
import { ThemeContext } from "../../ThemeContext/ThemeContext";
import jsPDF from "jsPDF";

const JobCard = ({ jobHomeId, jobCardId: initialJobCardId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [jobCardId, setJobCardId] = useState(initialJobCardId || null);
  const [isEditing, setIsEditing] = useState(!initialJobCardId);
  const [selectedDate, setSelectedDate] = useState("2025-06-10");
  
  const [fields, setFields] = useState({
    customer_name: "", fam_no: "", contact_person: "", area: "",
    contact_number: "", branch_sc: "", generator_make: "", kva: "",
    engine_make: "", last_service: "", alternator_make: "",
    gen_model: "", controller_module: "", avr: "", ats_info: "",
    job_description: ""
  });

  // New state to hold customers list
  const [customers, setCustomers] = useState([]);

  // New state to hold selected customer ID
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  // New state to hold areas of selected customer
  const [areas, setAreas] = useState([]);

  // New state to hold branches of selected customer and area
  const [branches, setBranches] = useState([]);

  const [filters, setFilters] = useState({
    oil_filter: false, fuel_filter: false, air_filter: false,
    battery_charge: false, oil: false, battery: "", other: "",
  });

  const [items, setItems] = useState([{ materialsNo: "", materials: "", quantity: "" }]);
 
 
 

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });

    if (name === "customer_name") {
      const selectedCustomer = customers.find(cust => cust.customer_name === value);
      setSelectedCustomerId(selectedCustomer ? selectedCustomer.customer_id : null);
    }
  };

  const handleFilterChange = (e) => {
  const { name, type, checked, value } = e.target;
  setFilters((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/customers", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
        } else {
          console.error("Failed to fetch customers");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  // Update areas when customer_name changes
  useEffect(() => {
    const selectedCustomer = customers.find(cust => cust.customer_name === fields.customer_name);
    if (selectedCustomer && selectedCustomer.areas) {
      setAreas(selectedCustomer.areas);
      // Optionally set the first area as selected
      if (selectedCustomer.areas.length > 0) {
        setFields(prev => ({ ...prev, area: selectedCustomer.areas[0].areaName }));
      } else {
        setFields(prev => ({ ...prev, area: "" }));
      }
    } else {
      setAreas([]);
      setFields(prev => ({ ...prev, area: "" }));
    }
  }, [fields.customer_name, customers]);

  // Update branches when customer_name or area changes
  useEffect(() => {
    const selectedCustomer = customers.find(cust => cust.customer_name === fields.customer_name);
    if (selectedCustomer && selectedCustomer.areas) {
      const selectedArea = selectedCustomer.areas.find(area => area.areaName === fields.area);
      if (selectedArea && selectedArea.branches) {
        setBranches(selectedArea.branches);
        if (selectedArea.branches.length > 0) {
          setFields(prev => ({ ...prev, branch_sc: selectedArea.branches[0].branchName }));
        } else {
          setFields(prev => ({ ...prev, branch_sc: "" }));
        }
      } else {
        setBranches([]);
        setFields(prev => ({ ...prev, branch_sc: "" }));
      }
    } else {
      setBranches([]);
      setFields(prev => ({ ...prev, branch_sc: "" }));
    }
  }, [fields.customer_name, fields.area, customers]);


  const handleItemChange = (i, field, value) => {
    if (!isEditing) return; 
    const arr = [...items];
    arr[i][field] = value;
    if (isEditing && i === items.length - 1 && Object.values(arr[i]).some(val => val !== "")) {
      arr.push({ materialsNo: "", materials: "", quantity: "" });
    }
    setItems(arr);
  };

    const handleDeleteRow = (i) => {
    if (!isEditing) return; // Prevent deletion if not editing
    if (items.length > 1) setItems(items.filter((_, idx) => idx !== i));
  };
const handleSubmit = async () => {
    if (!isEditing) return; // Only submit if in editing mode

    const payload = {
      job_home_id: jobHomeId, // Ensure jobHomeId is included in the payload
      selected_date: selectedDate,
      ...fields,
      customer_id: selectedCustomerId,
      filters: {
        oil_filter: filters.oil_filter,
        fuel_filter: filters.fuel_filter,
        air_filter: filters.air_filter,
        battery: filters.battery,
        battery_charge: filters.battery_charge,
        oil: filters.oil,
        other: filters.other,
      },
      items: items.filter(item => item.materials !== ""), // Filter out empty item rows
    };



 const url = jobCardId
      ? `http://localhost:8000/api/jobcards/${jobCardId}`
      : "http://localhost:8000/api/jobcards";

    const method = jobCardId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Important for sending cookies/session with request
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Result:", data);
      alert(jobCardId ? "Updated successfully." : "Submitted successfully.");

      // If it was a new job card creation, set the jobCardId from the response
      if (!jobCardId && data.id) {
        setJobCardId(data.id);
      }
      setIsEditing(false); // Exit editing mode after successful submission
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Submission failed.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

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
    addField("Customer Name", fields.customer_name);
    addField("FAM No", fields.fam_no);
    addField("Contact Person", fields.contact_person);
    addField("Area", fields.area);
    addField("Contact Number", fields.contact_number);
    addField("Branch/SC", fields.branch_sc);
    addField("Generator Make", fields.generator_make);
    addField("KVA", fields.kva);
    addField("Engine Make", fields.engine_make);
    addField("Last Service", fields.last_service);
    addField("Alternator Make", fields.alternator_make);
    addField("Gen Model", fields.gen_model);
    addField("Controller Module", fields.controller_module);
    addField("AVR", fields.avr);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("Filters and Battery:", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;
    addField("Oil Filter", filters.oil_filter ? "Yes" : "No");
    addField("Fuel Filter", filters.fuel_filter ? "Yes" : "No");
    addField("Air Filter", filters.air_filter ? "Yes" : "No");
    addField("Battery Charge", filters.battery_charge ? "Yes" : "No");
    addField("Oil", filters.oil ? "Yes" : "No");
    addField("Battery", filters.battery);
    addField("Other", filters.other);
    y += 10;

    doc.setFont(undefined, "bold");
    doc.text("ATS Information:", margin, y);
    doc.setFont(undefined, "normal");
    y += lineHeight;
    doc.text(String(fields.ats_info || ""), margin, y);
    y += lineHeight + 5;

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
    doc.setFont(undefined, "normal");
    doc.text("Materials No", colX[1], y);
    doc.text("Materials", colX[2], y);
    doc.text("Quantity", colX[3], y);
    y += lineHeight;

    items.filter(item => item.materials !== "").forEach(item => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
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
      x.print();
    } else {
      alert('Please allow popups for this website');
    }
  };

  return (
    // Apply theme-dependent background and text colors to the main container
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl mt-6 border ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
      <h2 className="text-center text-xl font-bold mb-6 tracking-wide uppercase">Magma Engineering Solutions - JOB CARD</h2>
      <div className="flex justify-end space-x-4 mb-4">
          {jobCardId && !isEditing && ( // Show Edit button only if jobCardId exists and not currently editing
          <button
            onClick={handleEdit}
            className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}
        
        {jobCardId && (
          <>
            <button onClick={handleDownload} className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
              <FaDownload className="mr-2" /> Download
            </button>
            <button onClick={handlePrint} className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-green-600 hover:bg-green-800 text-white'}`}>
              <FaPrint className="mr-2" /> Print
            </button>
          </>
        )}
      </div>


      {/* Date Picker */}
      <div className="flex items-center space-x-2 mb-6">
        <label className="font-semibold">Select date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => isEditing && setSelectedDate(e.target.value)}
          readOnly={!isEditing}
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-200 text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
        />
        <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>

      {/* First Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
          <label className="font-medium">Customer Name:</label>
          <select
            name="customer_name"
            value={fields.customer_name}
            onChange={handleFieldChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
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
          <div>
            <label className="font-medium">FAM No:</label>
            <input
              type="text"
              name="fam_no"
              value={fields.fam_no}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Contact Person:</label>
            <input
              type="text"
              name="contact_person"
              value={fields.contact_person}
              onChange={handleFieldChange}
              readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
          <label className="font-medium">Area:</label>
          <select
            name="area"
            value={fields.area}
            onChange={handleFieldChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
              isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            <option value="">Select Area</option>
          {areas.map((area) => (
              <option key={area.id} value={area.areaName}>
                {area.areaName}
              </option>
            ))}
          </select>
          </div>
          <div>
            <label className="font-medium">Contact Number:</label>
            <input
              type="text"
              name="contact_number"
              value={fields.contact_number}
              onChange={handleFieldChange}
              readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
          <label className="font-medium">Branch/SC:</label>
          <select
            name="branch_sc"
            value={fields.branch_sc}
            onChange={handleFieldChange}
            disabled={!isEditing}
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
              isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
            } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
          >
            <option value="">Select Branch</option>
          {branches.map((branch) => (
              <option key={branch.id} value={branch.branchName}>
                {branch.branchName}
              </option>
            ))}
          </select>
          </div>
          <div>
            <label className="font-medium">Generator Make:</label>
            <input
              type="text"
              name="generator_make"
              value={fields.generator_make}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">KVA:</label>
            <input
              type="text"
              name="kva"
              value={fields.kva}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Engine Make:</label>
            <input
              type="text"
              name="engine_make"
              value={fields.engine_make}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Last Service:</label>
            <input
              type="text"
              name="last_service"
              value={fields.last_service}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Alternator Make:</label>
            <input
              type="text"
              name="alternator_make"
              value={fields.alternator_make}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Gen Model:</label>
            <input
              type="text"
              name="gen_model"
              value={fields.gen_model}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">Controller Module:</label>
            <input
              type="text"
              name="controller_module"
              value={fields.controller_module}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
          <div>
            <label className="font-medium">AVR:</label>
            <input
              type="text"
              name="avr"
              value={fields.avr}
              onChange={handleFieldChange}
               readOnly={!isEditing} 
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
        </div>

      <hr className={`my-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />

      {/* Filters and Battery Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {["oil_filter", "fuel_filter", "air_filter", "battery_charge", "oil"].map((name) => (
            <div className="flex items-center space-x-2" key={name}>
              <label className="font-medium capitalize">{name.replace(/_/g, " ")}:</label>
              <input
                type="checkbox"
                name={name}
                checked={filters[name] || false}
                onChange={handleFilterChange}
                disabled={!isEditing} 
                className="text-blue-600"
              />
              <input
                type="text"
                name={`${name}_desc`}
                value={filters[`${name}_desc`] || ""}
                onChange={handleFilterChange}
                readOnly={!isEditing} // Make read-only when not editing
              className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
              } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
              />
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <label className="font-medium">Battery:</label>
            <input
              type="text"
              name="battery"
              value={filters.battery || ""}
              onChange={handleFilterChange}
              readOnly={!isEditing} // Make read-only when not editing
            className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
              isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
            } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-medium">Other:</label>
            <input
              type="text"
              name="other"
              value={filters.other || ""}
              onChange={handleFilterChange}
              readOnly={!isEditing} // Make read-only when not editing
            className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
              isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
            } ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
            />
          </div>
        </div>


      {/* ATS Info and Job Description */}
      <div className="mb-6">
        <label className="font-medium">ATS Information:</label>
        <input 
          type="text" 
          name="ats_info"
          value={fields.ats_info}
          onChange={handleFieldChange}
           readOnly={!isEditing}
          className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} 
        />
      </div>
      <div className="mb-6">
        <label className="font-medium">Job Description:</label>
        <textarea 
          name="job_description"
          value={fields.job_description}
          onChange={handleFieldChange}
          readOnly={!isEditing}
          className={`w-full border rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} 
          />
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <label className="font-medium">Items/Materials Replaced:</label>
        <table className={`w-full border mt-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'}`}>
              <th className="p-2 border w-1/8">Action</th>
              <th className="p-2 border w-1/8">Materials No</th>
              <th className="p-2 border">Materials</th>
              <th className="p-2 border w-1/8">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-100 border-gray-300'}`}>
                <td className="p-2 border text-center">
                  {isEditing && items.length > 1 && (
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.materialsNo}
                    onChange={(e) => handleItemChange(index, "materialsNo", e.target.value)}
                    readOnly={!isEditing}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.materials}
                    readOnly={!isEditing}
                    onChange={(e) => handleItemChange(index, "materials", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    readOnly={!isEditing}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

         <div className="flex space-x-4 justify-end mt-6">
        {isEditing && ( // Show submit button only when in editing mode
          <button onClick={handleSubmit} className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
            <FaCheck className="mr-2" /> Submit
          </button>
        )}
      </div>

    </div>
  );
};

export default JobCard;