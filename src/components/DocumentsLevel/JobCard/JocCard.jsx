import { useState } from "react";
import { FaCalendarAlt, FaTrash } from "react-icons/fa";
import { FaEdit, FaDownload, FaPrint,FaCheck} from 'react-icons/fa';
const JobCard = () => {
  const [selectedDate, setSelectedDate] = useState("Jun 10, 2025");
  const [items, setItems] = useState([{ materialsNo: "", materials: "", quantity: "" }]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    // If the last row is being filled, add a new empty row
    const lastItem = newItems[newItems.length - 1];
    if (lastItem.materialsNo || lastItem.materials || lastItem.quantity) {
      setItems([...newItems, { materialsNo: "", materials: "", quantity: "" }]);
    }
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-200">
      <h2 className="text-center text-xl font-bold mb-6 text-gray-900 tracking-wide uppercase">Magma Engineering Solutions - JOB CARD</h2>
      <div className="flex justify-end space-x-4 mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-800 transition flex items-center">
          <FaDownload className="mr-2" />
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800 transition flex items-center">
          <FaPrint className="mr-2" />
        </button>
      </div>


      {/* Date Picker */}
      <div className="flex items-center space-x-2 mb-6">
        <label className="font-semibold text-gray-700">Select date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <FaCalendarAlt className="text-gray-600" />
      </div>

      {/* First Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-700 font-medium">Customer Name : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">FAM NO : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Contact Person : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Area : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Contact Number : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Branch/SC : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Generator Make : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">KVA : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>

      {/* Second Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-700 font-medium">Engine Make : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Last Service : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Alternator Make : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Gen Model : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">Controller Module : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div>
          <label className="text-gray-700 font-medium">AVR : </label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>

      <hr className="my-6" />

      {/* Filters and Battery Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Oil Filter : </label>
          <input type="checkbox" className="text-blue-600" />
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Battery : </label>
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Fuel Filter : </label>
          <input type="checkbox" className="text-blue-600" />
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Battery Charge : </label>
          <input type="checkbox" className="text-blue-600" />
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Air Filter : </label>
          <input type="checkbox" className="text-blue-600" />
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Other : </label>
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-gray-700 font-medium">Oil : </label>
          <input type="checkbox" className="text-blue-600" />
          <input type="text" className="w/2 border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
        </div>
      </div>

      {/* ATS Info and Job Description */}
      <div className="mb-6">
        <label className="text-gray-700 font-medium">ATS Information:</label>
        <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-blue-400" />
      </div>
      <div className="mb-6">
        <label className="text-gray-700 font-medium">Job Description:</label>
        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400" />
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <label className="text-gray-700 font-medium">Items/Materials Replaced:</label>
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-200">
            <th className="p-2 border w-1/8">Action</th>
              <th className="p-2 border w-1/8">Materials No</th>
              <th className="p-2 border">Materials</th>
              <th className="p-2 border w-1/8">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}  className="hover:bg-gray-100">
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
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.materials}
                    onChange={(e) => handleItemChange(index, "materials", e.target.value)}
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex space-x-4 justify-end mt-6">
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition flex items-center">
          <FaCheck className="mr-2" /> Submit
        </button>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition flex items-center">
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>

    </div>
  );
};

export default JobCard;
