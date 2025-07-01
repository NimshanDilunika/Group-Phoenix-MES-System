import { useState, useContext } from "react"; // Import useContext
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { FaEdit, FaDownload, FaPrint, FaCheck, FaSun, FaMoon } from 'react-icons/fa'; // Import sun/moon icons
import { ThemeContext } from "../../ThemeContext/ThemeContext";

const JobCard = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [selectedDate, setSelectedDate] = useState("2025-06-10");
  
  const [fields, setFields] = useState({
    customer_name: "", fam_no: "", contact_person: "", area: "",
    contact_number: "", branch_sc: "", generator_make: "", kva: "",
    engine_make: "", last_service: "", alternator_make: "",
    gen_model: "", controller_module: "", avr: "", ats_info: "",
    job_description: ""
  });

  const [filters, setFilters] = useState({
    oil_filter: false, fuel_filter: false, air_filter: false,
    battery_charge: false, oil: false, battery: "", other: "",
  });

  const [items, setItems] = useState([{ materialsNo: "", materials: "", quantity: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const handleFieldChange = (e) => setFields({ ...fields, [e.target.name]: e.target.value });
  const handleFilterChange = (e) => {
  const { name, type, checked, value } = e.target;
  setFilters((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  const handleItemChange = (i, field, value) => {
    const arr = [...items];
    arr[i][field] = value;
    if (i === items.length - 1 && Object.values(arr[i]).some(val => val !== "")) {
      arr.push({ materialsNo: "", materials: "", quantity: "" });
    }
    setItems(arr);
  };

  const handleDeleteRow = (i) => {
    if (items.length > 1) setItems(items.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    const payload = {
      selected_date: selectedDate,
      ...fields,
      filters: {
        oil_filter: filters.oil_filter,
        fuel_filter: filters.fuel_filter,
        air_filter: filters.air_filter,
        battery: filters.battery,
        battery_charge: filters.battery_charge,
        oil: filters.oil,
        other: filters.other,
      },
      items: items.filter(item => item.materials !== ""),
    };

    try {
      const res = await fetch("http://localhost:8000/api/jobcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("Result:", data);
      alert("Submitted successfully.");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

    const handleEdit = () => {
    if (isEditing) {
      handleSubmit();
    }
    setIsEditing((prev) => !prev);
  };


  
  return (
    // Apply theme-dependent background and text colors to the main container
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl mt-6 border ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
      <h2 className="text-center text-xl font-bold mb-6 tracking-wide uppercase">Magma Engineering Solutions - JOB CARD</h2>
      <div className="flex justify-end space-x-4 mb-4">
        

      <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaDownload className="mr-2" /> Download
        </button>
        <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-green-600 hover:bg-green-800 text-white'}`}>
          <FaPrint className="mr-2" /> Print
        </button>
      </div>


      {/* Date Picker */}
      <div className="flex items-center space-x-2 mb-6">
        <label className="font-semibold">Select date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          // Apply theme-dependent input styles
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-200 text-gray-900 border-gray-300'}`}
        />
        <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </div>

      {/* First Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium">Customer Name:</label>
            <input
              type="text"
              name="customer_name"
              value={fields.customer_name}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">FAM No:</label>
            <input
              type="text"
              name="fam_no"
              value={fields.fam_no}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Contact Person:</label>
            <input
              type="text"
              name="contact_person"
              value={fields.contact_person}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Area:</label>
            <input
              type="text"
              name="area"
              value={fields.area}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Contact Number:</label>
            <input
              type="text"
              name="contact_number"
              value={fields.contact_number}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Branch/SC:</label>
            <input
              type="text"
              name="branch_sc"
              value={fields.branch_sc}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Generator Make:</label>
            <input
              type="text"
              name="generator_make"
              value={fields.generator_make}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">KVA:</label>
            <input
              type="text"
              name="kva"
              value={fields.kva}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Engine Make:</label>
            <input
              type="text"
              name="engine_make"
              value={fields.engine_make}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Last Service:</label>
            <input
              type="text"
              name="last_service"
              value={fields.last_service}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Alternator Make:</label>
            <input
              type="text"
              name="alternator_make"
              value={fields.alternator_make}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Gen Model:</label>
            <input
              type="text"
              name="gen_model"
              value={fields.gen_model}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">Controller Module:</label>
            <input
              type="text"
              name="controller_module"
              value={fields.controller_module}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="font-medium">AVR:</label>
            <input
              type="text"
              name="avr"
              value={fields.avr}
              onChange={handleFieldChange}
              className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
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
                className="text-blue-600"
              />
              <input
                type="text"
                name={`${name}_desc`}
                value={filters[`${name}_desc`] || ""}
                onChange={handleFilterChange}
                className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-100 border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
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
              className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="font-medium">Other:</label>
            <input
              type="text"
              name="other"
              value={filters.other || ""}
              onChange={handleFilterChange}
              className={`w-1/2 border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
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
          className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} 
        />
      </div>
      <div className="mb-6">
        <label className="font-medium">Job Description:</label>
        <textarea 
          name="job_description"
          value={fields.job_description}
          onChange={handleFieldChange}
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
                  {items.length > 1 && (
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
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.materials}
                    onChange={(e) => handleItemChange(index, "materials", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
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
        {/* Buttons now adapt to dark mode */}
        <button   onClick={handleSubmit} className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaCheck className="mr-2" /> Submit
        </button>
        <button  onClick={handleEdit} className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>

    </div>
  );
};

export default JobCard;