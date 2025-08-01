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
<<<<<<< HEAD
// import jsPDF from "jspdf";
=======
import jsPDF from "jspdf";
>>>>>>> 2a6651829b53e5ce30d2b16296e28b0734d064eb
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
    <div className={`w-full px-8 py-8 rounded-3xl shadow-2xl mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-50 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
      {/* Notification Component */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })} // Clear notification when closed
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} `}>
          Tax Invoice
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadPDF}
            className={`${buttonStyle} ${actionButtonColors.download}`}
          >
            <FaDownload className="mr-3 text-lg" /> Download
          </button>
          <button
            onClick={handlePrint}
            className={`${buttonStyle} ${actionButtonColors.print}`}
          >
            <FaPrint className="mr-3 text-lg" /> Print
          </button>
        </div>
      </div>

      {/* Invoice Information Section */}
      <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => setIsInvoiceInfoExpanded(!isInvoiceInfoExpanded)}>
          <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaFileInvoiceDollar className="mr-2 text-blue-400" /> Invoice Information
          </h3>
          {isInvoiceInfoExpanded ? (
            <FaChevronUp className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isInvoiceInfoExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isInvoiceInfoExpanded ? '1000px' : '0' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Invoice Date */}
            <div className="col-span-full mb-4 flex items-center">
              <label className={`font-semibold text-lg mr-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Invoice Date:</label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={inputStyle(false)}
                />
                <FaCalendarAlt className={`absolute right-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
              <div className={`ml-auto px-4 py-2 rounded-xl text-lg font-bold ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                Invoice No: {invoiceFields.invoiceNo || "N/A"}
              </div>
            </div>

            {/* Fields */}
            <div>
              <label htmlFor="attention" className={labelStyle}>Attention:</label>
              <input
                type="text"
                id="attention"
                name="attention"
                value={invoiceFields.attention}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="invoiceNo" className={labelStyle}>Invoice No:</label>
              <input
                type="text"
                id="invoiceNo"
                name="invoiceNo"
                value={invoiceFields.invoiceNo}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="vatNo" className={labelStyle}>VAT No:</label>
              <input
                type="text"
                id="vatNo"
                name="vatNo"
                value={invoiceFields.vatNo}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="region" className={labelStyle}>Region:</label>
              <input
                type="text"
                id="region"
                name="region"
                value={invoiceFields.region}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="refQtn" className={labelStyle}>Ref Qtn:</label>
              <input
                type="text"
                id="refQtn"
                name="refQtn"
                value={invoiceFields.refQtn}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="site" className={labelStyle}>Site:</label>
              <input
                type="text"
                id="site"
                name="site"
                value={invoiceFields.site}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="jobDate" className={labelStyle}>Job Date:</label>
              <input
                type="date"
                id="jobDate"
                name="jobDate"
                value={invoiceFields.jobDate}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="famNo" className={labelStyle}>FAM No:</label>
              <input
                type="text"
                id="famNo"
                name="famNo"
                value={invoiceFields.famNo}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="complainNature" className={labelStyle}>Complain Nature:</label>
              <input
                type="text"
                id="complainNature"
                name="complainNature"
                value={invoiceFields.complainNature}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="poNo" className={labelStyle}>PO No:</label>
              <input
                type="text"
                id="poNo"
                name="poNo"
                value={invoiceFields.poNo}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="poDate" className={labelStyle}>PO Date:</label>
              <input
                type="date"
                id="poDate"
                name="poDate"
                value={invoiceFields.poDate}
                onChange={handleInvoiceFieldChange}
                className={inputStyle(false)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Items Table Section */}
      <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => setIsItemsTableExpanded(!isItemsTableExpanded)}>
          <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaCheck className="mr-2 text-blue-400" /> Items/Materials
          </h3>
          {isItemsTableExpanded ? (
            <FaChevronUp className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isItemsTableExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isItemsTableExpanded ? '1500px' : '0' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Materials No
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Description
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Unit Price
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Quantity
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Total Price
                  </th>
                  <th className={`px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-800' : 'divide-gray-200 bg-white'}`}>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.materialsNo}
                        onChange={(e) => handleItemChange(index, "materialsNo", e.target.value)}
                        className={inputStyle(false)}
                        placeholder="Materials No"
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                        className={inputStyle(false)}
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleItemChange(index, "unitPrice", val);
                          handleItemChange(index, "unitTotalPrice", (parseFloat(val || 0) * parseFloat(item.quantity || 0)).toFixed(2));
                        }}
                        className={inputStyle(false)}
                        placeholder="Unit Price"
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleItemChange(index, "quantity", val);
                          handleItemChange(index, "unitTotalPrice", (parseFloat(item.unitPrice || 0) * parseFloat(val || 0)).toFixed(2));
                        }}
                        className={inputStyle(false)}
                        placeholder="Quantity"
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <input
                        type="text"
                        value={item.unitTotalPrice}
                        readOnly
                        className={inputStyle(true)}
                      />
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className={`text-red-600 hover:text-red-900 ${isDarkMode ? 'hover:text-red-400' : ''}`}
                      >
                        <FaTrash />
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
      <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
          <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaInfoCircle className="mr-2 text-blue-400" /> Summary
          </h3>
          {isSummaryExpanded ? (
            <FaChevronUp className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isSummaryExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: isSummaryExpanded ? '500px' : '0' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="subTotal" className={labelStyle}>Sub Total:</label>
              <input
                type="text"
                id="subTotal"
                value={subTotal.toFixed(2)}
                readOnly
                className={inputStyle(true)}
              />
            </div>
            <div>
              <label htmlFor="vatValue" className={labelStyle}>VAT (%):</label>
              <input
                type="number"
                id="vatValue"
                value={vatValue}
                onChange={(e) => setVatValue(parseFloat(e.target.value) || 0)}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="vatAmount" className={labelStyle}>VAT Amount:</label>
              <input
                type="text"
                id="vatAmount"
                value={vatAmount.toFixed(2)}
                readOnly
                className={inputStyle(true)}
              />
            </div>
            <div>
              <label htmlFor="discountValue" className={labelStyle}>Discount (%):</label>
              <input
                type="number"
                id="discountValue"
                value={discountValue}
                onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                className={inputStyle(false)}
              />
            </div>
            <div>
              <label htmlFor="discountAmount" className={labelStyle}>Discount Amount:</label>
              <input
                type="text"
                id="discountAmount"
                value={discountAmount.toFixed(2)}
                readOnly
                className={inputStyle(true)}
              />
            </div>
            <div>
              <label htmlFor="totalAmount" className={labelStyle}>Total Amount:</label>
              <input
                type="text"
                id="totalAmount"
                value={totalAmount.toFixed(2)}
                readOnly
                className={inputStyle(true)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Special Notes Section */}
      <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <div className="flex justify-between items-center cursor-pointer mb-6" onClick={() => setIsSpecialNotesExpanded(!isSpecialNotesExpanded)}>
          <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
            <FaInfoCircle className="mr-2 text-blue-400" /> Special Notes
          </h3>
          {isSpecialNotesExpanded ? (
            <FaChevronUp className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <FaChevronDown className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isSpecialNotesExpanded ? "max-h-screen opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div>
            <label htmlFor="specialNote" className={labelStyle}>
              Special Note:
            </label>
            <textarea
              id="specialNote"
              name="specialNote"
              value={invoiceFields.specialNote}
              onChange={handleInvoiceFieldChange}
              rows="5"
              className={`${inputStyle(false)} h-auto`}
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex space-x-4 justify-end mt-6">
        <button onClick={handleSubmit} className={`${buttonStyle} ${actionButtonColors.submit}`}>
          <FaCheck className="mr-3 text-lg" /> Submit Invoice
        </button>
      </div>
    </div>
  );
};

export default TaxInvoice;