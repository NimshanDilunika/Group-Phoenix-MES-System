import { useState, useContext } from "react"; // Import useContext
import { FaCalendarAlt, FaTrash, FaEdit, FaDownload, FaPrint, FaCheck, FaUserCheck, FaThumbsUp, FaSun, FaMoon } from "react-icons/fa"; // Import FaSun and FaMoon
import { ThemeContext } from "../../ThemeContext/ThemeContext";

const Quotation = () => {
  // Use useContext to get isDarkMode and toggleTheme from your ThemeContext
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [selectedDate, setSelectedDate] = useState("2025-06-10");
  const [items, setItems] = useState([{ materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
  const [vatValue, setVatValue] = useState(18);
  const [discountValue, setDiscountValue] = useState(10);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    calculateUnitTotal(index);

    const lastItem = newItems[newItems.length - 1];
    // Added a null check for `lastItem` before accessing its properties
    if (lastItem && (lastItem.materialsNo || lastItem.description || lastItem.quantity)) {
      setItems([...newItems, { materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
    }
  };

  const handleDeleteRow = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleVatChange = (e) => {
    setVatValue(e.target.value);
  };
   const handleDiscountChange = (e) => {
    setDiscountValue(e.target.value);
  };

  const calculateUnitTotal = (index) => {
    const newItems = [...items];
    const item = newItems[index];
    const unitTotal = (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0);
    newItems[index].unitTotalPrice = unitTotal.toFixed(2);
    setItems(newItems);
  };

  // Calculate totals
  const calculateTotalWithoutTax = () => {
    return items.reduce((total, item) => total + (parseFloat(item.unitTotalPrice) || 0), 0).toFixed(2);
  };

  const calculateVAT = () => {
    const totalWithoutTax = calculateTotalWithoutTax();
    return (parseFloat(totalWithoutTax) * (vatValue / 100)).toFixed(2);
  };
  const calculateTotalWithTax = () => {
    const totalWithoutTax = calculateTotalWithoutTax();
    const vat = calculateVAT();
    return (parseFloat(totalWithoutTax) + parseFloat(vat)).toFixed(2);
  };

  const calculateDiscount = () => {
    const totalWithTax = calculateTotalWithTax();
    return (parseFloat(totalWithTax) * (discountValue / 100)).toFixed(2);
  };
  const calculateTotalWithTaxAndDiscount = () => {
    const totalWithTax = calculateTotalWithTax();
    const discount = calculateDiscount();
    return (parseFloat(totalWithTax) - parseFloat(discount)).toFixed(2);
  };
  



  

  return (
    // Apply theme-dependent background, text, and border colors to the main container
    <div className={`max-w-4xl mx-auto p-6 rounded-2xl shadow-xl mt-6 border ${isDarkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
      <h1 className="text-center text-xl font-bold mb-6 tracking-wide uppercase">Quotation</h1>
      <div className="flex justify-end space-x-4 mb-4">
        <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaDownload className="mr-2" /> Download
        </button>
        <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-green-600 hover:bg-green-800 text-white'}`}>
          <FaPrint className="mr-2" /> Print
        </button>
      </div>

      <br />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-medium">Attention : </label>
          <textarea className={`w-full border rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="font-medium">Quotation No: </label>
            {/* Corrected Tailwind width class from w/4-full to w-4/5 for better compatibility */}
            <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
          </div>
          <div className="flex items-center space-x-2">
            <label className="font-semibold">Select date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-200 text-gray-900 border-gray-300'}`}
            />
            <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label className="font-medium">Region: </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium">Site : </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <br />
        <div className="flex items-center space-x-2">
          <label className="font-medium">FAM No : </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium">Complain Nature: </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium">Actual Break Down : </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <br />
        <label className="font-medium">Service and Maintenance of Post Warranty Generators</label>
        <div className="flex items-center space-x-2">
          <label className="font-medium">Tender No : </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
        <div className="flex items-center space-x-2">
          <label className="font-medium">Signed Date: </label>
          {/* Corrected Tailwind width class from w/2-full to w-4/5 for better compatibility */}
          <input type="text" className={`w-4/5 border rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
        </div>
      </div>

      <div className="mb-6">
        <label className="font-medium">Items/Materials Replaced:</label>
        <table className={`w-full border mt-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <thead>
            <tr className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200'}`}>
              <th className="p-2 border w-1/15">Action</th>
              <th className="p-2 border w-1/15">Materials No</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border w-1/10"> Price /Rs: </th>
              <th className="p-2 border w-1/15">Quantity</th>
              <th className="p-2 border w-2/15"> Total /Rs: </th>
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
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>

                <td className="p-2 border">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="text"
                    value={item.unitTotalPrice}
                    readOnly
                    // Styling for read-only input
                    className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Second table with VAT editable */}
      <div>
        <table className={`w-full border mt-2 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <tbody>
            <tr className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
              <td className="p-2 border w-3/4">
                <input
                  type="text"
                  value="Total (Without TAX)"
                  readOnly
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                />
              </td>
              <td className="p-2 border w-1/4">
                <input
                  type="text"
                  value={calculateTotalWithoutTax()}
                  readOnly
                  // Styling for read-only input
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
              </td>
            </tr>
            <tr className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
              <td className="p-2 border">
                {/* Nested table for VAT input - ensuring it respects dark mode */}
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="p-0 border-none"> {/* Remove padding and border for inner table cell */}
                        <input
                          type="text"
                          value="VAT"
                          readOnly
                          className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                      </td>
                      <td className="p-0 border-none"> {/* Remove padding and border for inner table cell */}
                        <input
                          type="number"
                          min="0"
                          value={vatValue}
                          onChange={handleVatChange} // Handle VAT change
                          className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={calculateVAT()}
                  readOnly
                  // Styling for read-only input
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
              </td>
            </tr>
             <tr className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
              <td className="p-2 border">
                <input
                  type="text"
                  value="Total ( With TAX)"
                  readOnly
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={calculateTotalWithTax()}
                  readOnly
                  // Styling for read-only input
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
              </td>
            </tr>






             <tr className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
              <td className="p-2 border">
                {/* Nested table for VAT input - ensuring it respects dark mode */}
                <table className="w-full">
                  <tbody>
                    <tr>
                      <td className="p-0 border-none"> {/* Remove padding and border for inner table cell */}
                        <input
                          type="text"
                          value="Discount"
                          readOnly
                          className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                      </td>
                      <td className="p-0 border-none"> {/* Remove padding and border for inner table cell */}
                        <input
                          type="number"
                          min="0"
                          value={discountValue}
                          onChange={handleDiscountChange} // Handle VAT change
                          className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={calculateDiscount()}
                  readOnly
                  // Styling for read-only input
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
              </td>
            </tr>









            <tr className={`${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
              <td className="p-2 border">
                <input
                  type="text"
                  value="Total ( With TAX & Discount)"
                  readOnly
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={calculateTotalWithTaxAndDiscount()}
                  readOnly
                  // Styling for read-only input
                  className={`w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'}`}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <div className="mb-6">
        <label className="font-medium"> Special Note : </label>
        <textarea className={`w-full border rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`} />
      </div>

      <div className="flex space-x-4 justify-end mt-6">
        {/* Buttons now adapt to dark mode */}
        <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaCheck className="mr-2" /> Submit
        </button>
        <button className={`px-6 py-2 rounded-lg shadow-md transition flex items-center ${isDarkMode ? 'bg-blue-600 hover:bg-blue-800 text-white' : 'bg-blue-600 hover:bg-blue-800 text-white'}`}>
          <FaEdit className="mr-2" /> Edit
        </button>
      </div>
    </div>
  );
};

export default Quotation;