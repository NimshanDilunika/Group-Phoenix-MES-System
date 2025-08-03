import { useState, useContext } from "react";
import { FaCalendarAlt, FaTrash, FaDownload,FaInfoCircle, FaPrint, FaCheck, FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Added chevron icons
import { ThemeContext } from "../../ThemeContext/ThemeContext";
import Notification from '../../Notification/Notification'; 
import { useAuth } from "../../../pages/hooks/useAuth";

const Quotation = () => {
    const { isDarkMode } = useContext(ThemeContext);

    const [selectedDate, setSelectedDate] = useState("2025-06-10");
    const [TenderSignedDate, setTenderSignedDate] = useState("2025-06-10");
    const [isEditing, setIsEditing] = useState(true);

    // State for managing expanded/collapsed sections
    const [isQuotationInfoExpanded, setIsQuotationInfoExpanded] = useState(false);
    const [isTenderInfoExpanded, setIsTenderInfoExpanded] = useState(false);
    const [isItemsTableExpanded, setIsItemsTableExpanded] = useState(true); // Added for items table  
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isSpecialNoteExpanded, setIsSpecialNoteExpanded] = useState(false);
    // Destructure all relevant states from the useAuth hook, including isLoading and isAuthenticated
    const { isAuthenticated, userRole } = useAuth();

    const [fields, setFields] = useState({
        attention: "",
        quotation_no: "",
        region: "",
        ref_qtn: "",
        site: "",
        job_date: "",
        fam_no: "",
        complain_nature: "",
        po_no: "",
        po_date: "",
        tender_no: "",
        special_note: ""
    });

    const [items, setItems] = useState([{ materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
    const [vatValue, setVatValue] = useState(18);
    const [discountValue, setDiscountValue] = useState(10);

    // --- Handlers ---
    const handleFieldChange = (e) => {
        if (!isEditing) return;
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    const handleItemChange = (index, field, value) => {
        if (!isEditing) return;
        const newItems = [...items];
        newItems[index][field] = value;

        const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
        const quantity = parseFloat(newItems[index].quantity) || 0;
        newItems[index].unitTotalPrice = (unitPrice * quantity).toFixed(2);

        setItems(newItems);

        const lastItem = newItems[newItems.length - 1];
        if (isEditing && index === newItems.length - 1 && (lastItem.materialsNo !== "" || lastItem.description !== "" || lastItem.quantity !== "")) {
            setItems([...newItems, { materialsNo: "", description: "", unitPrice: "", quantity: "", unitTotalPrice: "" }]);
        }
    };

    const handleDeleteRow = (index) => {
        if (!isEditing) return;
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const handleVatChange = (e) => {
        if (!isEditing) return;
        setVatValue(e.target.value);
    };

    const handleDiscountChange = (e) => {
        if (!isEditing) return;
        setDiscountValue(e.target.value);
    };

    // --- Notification State ---
    const [notification, setNotification] = useState({ message: "", type: "" }); // type: 'success' or 'error'

    // Function to show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        // The Notification component will handle its own hiding
    };

    // Function to clear notification
    const clearNotification = () => {
        setNotification({ message: "", type: "" });
    };

    const handleSubmit = () => {
        showNotification("Quotation submitted/updated!", "success");
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
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

    const createPDFDocument = () => {
        console.log("Creating PDF document...");
        const doc = {};
        return doc;
    };

    const handleDownload = () => {
        const doc = createPDFDocument();
        alert("Download functionality to be implemented with jsPDF!");
    };

    const handlePrint = () => {
        const doc = createPDFDocument();
        alert("Print functionality to be implemented with jsPDF!");
    };

    return (
        <div className={`w-full px-8 py-8 rounded-3xl shadow-2xl mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-50 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
            {/* Notification Popup */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={clearNotification}
                />
            )}

            {/* Header and Action Buttons */}
            <div className="flex justify-between items-center mb-8">
                <h2 className={`text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} `}>
                    Quotation
                </h2>
                <div className="flex space-x-4">
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                        >
                            <FaEdit className="mr-3 text-lg" /> Edit
                        </button>
                    )}
                    <>
                        <button
                            onClick={handleDownload}
                            className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-indigo-700 hover:bg-indigo-800 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                        >
                            <FaDownload className="mr-3 text-lg" /> Download
                        </button>
                        <button
                            onClick={handlePrint}
                            className={`px-6 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-emerald-700 hover:bg-emerald-800 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                        >
                            <FaPrint className="mr-3 text-lg" /> Print
                        </button>
                    </>
                </div>
            </div>

            {/* Quotation Details Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsQuotationInfoExpanded(!isQuotationInfoExpanded)}>
                    <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
                    <FaInfoCircle className="mr-2 text-blue-400" /> Quotation Information
                    </h3>
                    {isQuotationInfoExpanded ? <FaChevronUp className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                </div>

                {isQuotationInfoExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Attention */}
                    <div className="col-span-full md:col-span-1">
                        <label htmlFor="attention" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Attention:</label>
                        <textarea
                        id="attention"
                        name="attention"
                        value={fields.attention}
                        onChange={handleFieldChange}
                        readOnly={!isEditing}
                        rows="4"
                        className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                    </div>

                    <div className="col-span-full md:col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quotation No */}
                        <div>
                        <label htmlFor="quotation_no" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quotation No:</label>
                        <input
                            type="text"
                            id="quotation_no"
                            name="quotation_no"
                            value={fields.quotation_no}
                            onChange={handleFieldChange}
                            readOnly={!isEditing}
                            className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                        </div>

                        {/* Selected Date */}
                        <div className="flex items-center">
                        <label className={`font-medium text-sm mr-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date:</label>
                        <div className="relative flex items-center flex-grow">
                            <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => isEditing && setSelectedDate(e.target.value)}
                            readOnly={!isEditing}
                            className={`px-5 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                            />
                            <FaCalendarAlt className={`absolute right-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        </div>
                        </div>
                    </div>

                    {/* Other fields */}
                    {[
                        { name: "region", label: "Region" },
                        { name: "ref_qtn", label: "Ref Qtn" },
                        { name: "site", label: "Site" },
                        { name: "job_date", label: "Job Date" },
                        { name: "fam_no", label: "FAM NO" },
                        { name: "complain_nature", label: "Complain Nature" },
                        { name: "po_no", label: "PO NO" },
                        { name: "po_date", label: "PO Date" },
                    ].map((field) => (
                        <div key={field.name}>
                        <label htmlFor={field.name} className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{field.label}:</label>
                        <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={fields[field.name]}
                            onChange={handleFieldChange}
                            readOnly={!isEditing}
                            className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                        </div>
                    ))}
                    </div>
                )}
                </section>
            )}

            {/* Tender Information Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsTenderInfoExpanded(!isTenderInfoExpanded)}>
                        <h3
                        className={`text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Tender Information
                        </h3>
                        {isTenderInfoExpanded ? <FaChevronUp className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isTenderInfoExpanded && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="tender_no" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tender No:</label>
                                <input
                                    type="text"
                                    id="tender_no"
                                    name="tender_no"
                                    value={fields.tender_no}
                                    onChange={handleFieldChange}
                                    readOnly={!isEditing}
                                    className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                />
                            </div>
                            <div className="flex items-center">
                                <label className={`font-medium text-sm mr-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Signed Date:</label>
                                <div className="relative flex items-center flex-grow">
                                    <input
                                        type="date"
                                        value={TenderSignedDate}
                                        onChange={(e) => isEditing && setTenderSignedDate(e.target.value)}
                                        readOnly={!isEditing}
                                        className={`px-5 py-3 rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                    />
                                    <FaCalendarAlt className={`absolute right-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Items Table */}
            <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsItemsTableExpanded(!isItemsTableExpanded)}>
                    <h3
                      className={`text-2xl font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      } flex items-center`}
                    >
                      <FaInfoCircle className="mr-2 text-blue-400" /> Items/Materials Replaced
                    </h3>
                    {isItemsTableExpanded ? <FaChevronUp className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                </div>
                {isItemsTableExpanded && (
                    <div className="overflow-x-auto">
                        <table className={`w-full text-left rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                            <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-blue-100 text-blue-800'}`}>
                                <tr>
                                    <th className="p-4 border-b-2 border-r-2 rounded-tl-lg">Action</th>
                                    <th className="p-4 border-b-2 border-r-2">Materials No</th>
                                    <th className="p-4 border-b-2 border-r-2">Description</th>
                                    <th className="p-4 border-b-2 border-r-2">Price /Rs:</th>
                                    <th className="p-4 border-b-2 border-r-2">Quantity</th>
                                    <th className="p-4 border-b-2 rounded-tr-lg">Total /Rs:</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50')}`}>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                                            {isEditing && items.length > 1 && (
                                                <button
                                                    onClick={() => handleDeleteRow(index)}
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                    title="Delete Row"
                                                >
                                                    <FaTrash className="text-lg" />
                                                </button>
                                            )}
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={item.materialsNo}
                                                onChange={(e) => handleItemChange(index, "materialsNo", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={item.description}
                                                readOnly={!isEditing}
                                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={item.unitTotalPrice}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Totals and Summary Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                        <h3
                        className={`text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Summary
                        </h3>
                        {isSummaryExpanded ? <FaChevronUp className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isSummaryExpanded && (
                        <div className="overflow-x-auto">
                            <table className={`w-full text-left rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                <tbody>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} w-3/4`}>
                                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (Without TAX):</label>
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} w-1/4`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithoutTax()}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50'}`}>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="flex items-center space-x-4">
                                                <label htmlFor="vatValue" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VAT (%):</label>
                                                <input
                                                    type="number"
                                                    id="vatValue"
                                                    min="0"
                                                    value={vatValue}
                                                    onChange={handleVatChange}
                                                    readOnly={!isEditing}
                                                    className={`flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                                />
                                            </div>
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateVAT()}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (With TAX):</label>
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithTax()}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50'}`}>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="flex items-center space-x-4">
                                                <label htmlFor="discountValue" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount (%):</label>
                                                <input
                                                    type="number"
                                                    id="discountValue"
                                                    min="0"
                                                    value={discountValue}
                                                    onChange={handleDiscountChange}
                                                    readOnly={!isEditing}
                                                    className={`flex-grow px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                                />
                                            </div>
                                        </td>
                                        <td className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateDiscount()}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (With TAX & Discount):</label>
                                        </td>
                                        <td className={`p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithTaxAndDiscount()}
                                                readOnly
                                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}

            {/* Special Note Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-6 cursor-pointer" onClick={() => setIsSpecialNoteExpanded(!isSpecialNoteExpanded)}>
                        <h3
                        className={`text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Additional Notes
                        </h3>
                        {isSpecialNoteExpanded ? <FaChevronUp className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isSpecialNoteExpanded && (
                        <div>
                            <label htmlFor="special_note" className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Special Note:</label>
                            <textarea
                                id="special_note"
                                name="special_note"
                                value={fields.special_note}
                                onChange={handleFieldChange}
                                readOnly={!isEditing}
                                rows="5"
                                className={`w-full border rounded-xl px-4 py-2.5 transition-all duration-200 focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
                {isEditing && (
                    <button
                        onClick={handleSubmit}
                        className={`px-8 py-3 rounded-xl shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        <FaCheck className="mr-3 text-lg" /> Submit Quotation
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quotation;