import { useState} from "react";
import { FaCalendarAlt, FaTrash, FaEdit, FaDownload, FaPrint, FaCheck,FaUserCheck, FaThumbsUp  } from "react-icons/fa";

const Quotation = () => {
  const [selectedDate, setSelectedDate] = useState("2025-06-10");
  const [items, setItems] = useState([{ materialsNo: "", description : "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
  const [vatValue, setVatValue] = useState(18);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);

    calculateUnitTotal(index);

    const lastItem = newItems[newItems.length - 1];
    if (lastItem.materialsNo || lastItem.description || lastItem.quantity) {
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
    return (parseFloat(totalWithoutTax) *(vatValue/100)).toFixed(2);
  };

  const calculateTotalWithTax = () => {
    const totalWithoutTax = calculateTotalWithoutTax();
    const vat = calculateVAT();
    return (parseFloat(totalWithoutTax) + parseFloat(vat)).toFixed(2);
  };

    const [CustomerOk, setCustomerOk] = useState(false);
    const [SpecialApprove, setSpecialApprove] = useState(false);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-200">
      <h1 className="text-center text-xl font-bold mb-6 text-gray-900 tracking-wide uppercase">Quotation</h1>
      <div className="flex justify-end space-x-4 mb-4">
      <div className="flex items-center space-x-2">
                <p className="text-gray-900">Customer Ok</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={CustomerOk} 
                    onChange={() => setCustomerOk(!CustomerOk)} 
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900">Special Approve</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={SpecialApprove} 
                    onChange={() => setSpecialApprove(!SpecialApprove)} 
                  />
                  <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-500"></div>
                </label>
              </div>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition flex items-center">
          <FaDownload className="mr-2" />
        </button>
        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-800 transition flex items-center">
          <FaPrint className="mr-2" />
        </button>
      </div>

      <br/>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-gray-700 font-medium">Attention : </label>
          <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400" />
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">    
                <div className="flex items-center space-x-2">
                  <label className="text-gray-700 font-medium">Quotation No: </label>
                  <input type="text" className="w/4-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="font-semibold text-gray-700">Select date:</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <FaCalendarAlt className="text-gray-600" />
                </div>
              </div> 
        </div>
        <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Region: </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Site : </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <br/>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">FAM No : </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Complain Nature: </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Actual Break Down : </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <br/>
            <label className="text-gray-700 font-medium">Service and Maintenance of Post Warranty Generators</label>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Tender No : </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-700 font-medium">Signed Date: </label>
              <input type="text" className="w/2-full border border-gray-300 rounded-lg px-3 py-1 mt-1 focus:ring-2 focus:ring-blue-400" />
            </div>
      </div>

       <div className="mb-6">
        <label className="text-gray-700 font-medium">Items/Materials Replaced:</label>
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-200">
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
              <tr key={index} className="hover:bg-gray-100">
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
                    value={item.description}
                    onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>

                <td className="p-2 border">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
                <td className="p-2 border">
                  <input
                     type="text"
                     value={item.unitTotalPrice}
                     readOnly
                     className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Second table with VAT editable */}
      <div>
        <table className="w-full border mt-2">
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border w-3/4">
                <input
                  type="text"
                  value="Total (Without TAX)"
                  className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="p-2 border w-1/4">
                <input
                  type="text"
                  value={calculateTotalWithoutTax()}
                  className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          value="VAT"
                          className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={vatValue}
                          onChange={handleVatChange} // Handle VAT change
                          className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
                  className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </td>
            </tr>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border">
                <input
                  type="text"
                  value="Total ( With TAX)"
                  className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={calculateTotalWithTax()}
                  className="w-full px-3 py-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <br/>
      <br/>
      <div className="mb-6">
        <label className="text-gray-700 font-medium"> Special Note : </label>
        <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-blue-400" />
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

export default Quotation;
