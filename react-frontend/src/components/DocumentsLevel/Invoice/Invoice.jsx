import { useState, useContext } from "react";
import {
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaDownload,
  FaPrint,
  FaCheck,
  FaFileInvoiceDollar,
  FaInfoCircle,
  FaChevronDown, // Added for expand/collapse icon
  FaChevronUp, // Added for expand/collapse icon
} from "react-icons/fa";
import { ThemeContext } from "../../ThemeContext/ThemeContext";
//import jsPDF from "jspdf";
import Notification from '../../Notification/Notification'; // Import the Notification component

const TaxInvoice = () => {
  const { isDarkMode } = useContext(ThemeContext);

  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [tenderSignedDate, setTenderSignedDate] = useState("2025-06-10");
  const [items, setItems] = useState([
    { materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" },
  ]);
  const [vatValue, setVatValue] = useState(18);
  const [discountValue, setDiscountValue] = useState(10);

  // New state for general invoice fields
  const [invoiceFields, setInvoiceFields] = useState({
    attention: "",
    invoiceNo: "",
    vatNo: "",
    region: "",
    refQtn: "",
    site: "",
    jobDate: "",
    famNo: "",
    complainNature: "",
    poNo: "",
    poDate: "",
    // Add other fields as necessary
    specialNote: "",
  });

  // State for notification
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Function to show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    // Automatically hide notification after 5 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  };

  // State for section expansion
  const [isInvoiceInfoExpanded, setIsInvoiceInfoExpanded] = useState(false);
  const [isTenderInfoExpanded, setIsTenderInfoExpanded] = useState(false);
  const [isItemsTableExpanded, setIsItemsTableExpanded] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [isSpecialNotesExpanded, setIsSpecialNotesExpanded] = useState(false);

  // Styling helper functions
  const inputStyle = (isReadOnly) => `
    w-full border rounded-xl px-4 py-2.5 transition-all duration-200
    focus:ring-4 focus:ring-blue-300
    ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}
    ${isReadOnly ? 'cursor-not-allowed opacity-70' : ''}
  `;

  const labelStyle = `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

  const buttonStyle = `
    px-8 py-3 rounded-xl shadow-lg transition-all duration-300
    flex items-center transform hover:scale-105
  `;

  const actionButtonColors = {
    submit: `${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`,
    edit: `${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`,
    download: `${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`,
    print: `${isDarkMode ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700'} text-white`,
  };

  // Handlers for form fields
  const handleInvoiceFieldChange = (e) => {
    const { name, value } = e.target;
    setInvoiceFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = items.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: value };
      }
      return item;
    });

    // Automatically add a new row if the last row is being filled
    const lastItem = newItems[newItems.length - 1];
    if (index === newItems.length - 1 && (lastItem.materialsNo || lastItem.description || lastItem.unitPrice || lastItem.quantity)) {
      setItems([...newItems, { materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
    } else {
      setItems(newItems);
    }
  };

  const handleDeleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length > 0 ? newItems : [{ materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
  };

  // Calculate totals
  const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.unitTotalPrice) || 0), 0);
  const vatAmount = subTotal * (vatValue / 100);
  const discountAmount = subTotal * (discountValue / 100);
  const totalAmount = subTotal + vatAmount - discountAmount;

  // Placeholder for submit logic
  const handleSubmit = () => {
    console.log("Invoice Submitted", { invoiceFields, items, vatValue, discountValue });
    // In a real application, you would send this data to your backend
    showNotification("Invoice submitted successfully!", "success");
  };

  // PDF Generation Logic (simplified for brevity)
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Tax Invoice", 20, 20);
    // Add more content from invoiceFields and items
    doc.save("invoice.pdf");
  };

  const handleDownloadPDF = () => {
    generatePDF();
    showNotification("Invoice PDF downloaded!", "success");
  };

  const handlePrint = () => {
    const doc = generatePDF();
    const string = doc.output('bloburl');
    const x = window.open(string);
    if (x) {
      x.focus();
    } else {
      showNotification("Please allow popups to print the invoice.", "error");
    }
  };

  return (
    <div className={`w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mt-4 sm:mt-6 md:mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-50 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
      {/* Notification Component */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })} // Clear notification when closed
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} `}>
          Tax Invoice
        </h2>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <button
            onClick={handleDownloadPDF}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${actionButtonColors.download}`}
          >
            <FaDownload className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
            <span className="text-sm sm:text-base">Download</span>
          </button>
          <button
            onClick={handlePrint}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${actionButtonColors.print}`}
          >
            <FaPrint className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
            <span className="text-sm sm:text-base">Print</span>
          </button>
        </div>
      </div>

      {/* Invoice Information Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6" onClick={() => setIsInvoiceInfoExpanded(!isInvoiceInfoExpanded)}>
          <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaFileInvoiceDollar className="mr-2 text-blue-400" /> Invoice Information
          </h3>
          {isInvoiceInfoExpanded ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isInvoiceInfoExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isInvoiceInfoExpanded ? '1000px' : '0' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Invoice Date */}
            <div className="col-span-full mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <label className={`font-semibold text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Invoice Date:</label>
              <div className="relative flex items-center w-full sm:w-auto flex-grow">
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={`w-full px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 transition-all duration-200`}
                />
                <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <div className={`w-full sm:w-auto px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-base sm:text-lg font-bold ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                Invoice No: {invoiceFields.invoiceNo || "N/A"}
              </div>
            </div>

            {/* Fields */}
            <div>
              <label htmlFor="attention" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Attention:</label>
              <input
                type="text"
                id="attention"
                name="attention"
                value={invoiceFields.attention}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="invoiceNo" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Invoice No:</label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={invoiceFields.invoiceNo}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="vatNo" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VAT No:</label>
              <input
                type="text"
                id="vatNo"
                name="vatNo"
                value={invoiceFields.vatNo}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="region" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={invoiceFields.region}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="refQtn" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ref Qtn:</label>
              <input
                type="text"
                id="refQtn"
                name="refQtn"
                value={invoiceFields.refQtn}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="site" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Site:</label>
              <input
                type="text"
                id="site"
                name="site"
                value={invoiceFields.site}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="jobDate" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Job Date:</label>
              <input
                type="date"
                id="jobDate"
                name="jobDate"
                value={invoiceFields.jobDate}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="famNo" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>FAM No:</label>
              <input
                type="text"
                id="famNo"
                name="famNo"
                value={invoiceFields.famNo}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="complainNature" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Complain Nature:</label>
              <input
                type="text"
                id="complainNature"
                name="complainNature"
                value={invoiceFields.complainNature}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="poNo" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PO No:</label>
              <input
                type="text"
                id="poNo"
                name="poNo"
                value={invoiceFields.poNo}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="poDate" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PO Date:</label>
              <input
                type="date"
                id="poDate"
                name="poDate"
                value={invoiceFields.poDate}
                onChange={handleInvoiceFieldChange}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Items Table Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6" onClick={() => setIsItemsTableExpanded(!isItemsTableExpanded)}>
          <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaCheck className="mr-2 text-blue-400" /> Items/Materials
          </h3>
          {isItemsTableExpanded ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isItemsTableExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isItemsTableExpanded ? '1500px' : '0' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Materials No
                  </th>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Description
                  </th>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unit Price
                  </th>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Quantity
                  </th>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Price
                  </th>
                  <th className={`px-2 sm:px-4 py-2 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.materialsNo}
                        onChange={(e) => handleItemChange(index, "materialsNo", e.target.value)}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        placeholder="Materials No"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleItemChange(index, "unitPrice", val);
                          handleItemChange(index, "unitTotalPrice", (parseFloat(val || 0) * parseFloat(item.quantity || 0)).toFixed(2));
                        }}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        placeholder="Unit Price"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleItemChange(index, "quantity", val);
                          handleItemChange(index, "unitTotalPrice", (parseFloat(item.unitPrice || 0) * parseFloat(val || 0)).toFixed(2));
                        }}
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
                        placeholder="Quantity"
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.unitTotalPrice}
                        readOnly
                        className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                      />
                    </td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className={`text-red-600 hover:text-red-900 ${isDarkMode ? 'hover:text-red-400' : ''}`}
                      >
                        <FaTrash className="text-base sm:text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
          <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaInfoCircle className="mr-2 text-blue-400" /> Summary
          </h3>
          {isSummaryExpanded ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSummaryExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isSummaryExpanded ? '500px' : '0' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div>
              <label htmlFor="subTotal" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sub Total:</label>
              <input
                type="text"
                id="subTotal"
                value={subTotal.toFixed(2)}
                readOnly
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
              />
            </div>
            <div>
              <label htmlFor="vatValue" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VAT (%):</label>
              <input
                type="number"
                id="vatValue"
                value={vatValue}
                onChange={(e) => setVatValue(parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="vatAmount" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VAT Amount:</label>
              <input
                type="text"
                id="vatAmount"
                value={vatAmount.toFixed(2)}
                readOnly
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
              />
            </div>
            <div>
              <label htmlFor="discountValue" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount (%):</label>
              <input
                type="number"
                id="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="discountAmount" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount Amount:</label>
              <input
                type="text"
                id="discountAmount"
                value={discountAmount.toFixed(2)}
                readOnly
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Amount:</label>
              <input
                type="text"
                id="totalAmount"
                value={totalAmount.toFixed(2)}
                readOnly
                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Special Notes Section */}
      <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-4 sm:mb-6" onClick={() => setIsSpecialNotesExpanded(!isSpecialNotesExpanded)}>
          <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaInfoCircle className="mr-2 text-blue-400" /> Special Notes
          </h3>
          {isSpecialNotesExpanded ? (
            <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isSpecialNotesExpanded ? "max-h-screen opacity-100 mt-4 sm:mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div>
            <label htmlFor="specialNote" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Special Note:
            </label>
            <textarea
              id="specialNote"
              name="specialNote"
              value={invoiceFields.specialNote}
              onChange={handleInvoiceFieldChange}
              rows="4"
              className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} h-auto`}
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex justify-end mt-6 sm:mt-8">
        <button 
          onClick={handleSubmit} 
          className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${actionButtonColors.submit}`}
        >
          <FaCheck className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
          <span className="text-sm sm:text-base">Submit Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default TaxInvoice;