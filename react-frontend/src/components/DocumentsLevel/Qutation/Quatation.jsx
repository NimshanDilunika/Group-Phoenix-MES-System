import { useState, useContext, useEffect } from "react";
import { FaCalendarAlt, FaTrash, FaDownload,FaInfoCircle, FaPrint, FaCheck, FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Added chevron icons
import { ThemeContext } from "../../ThemeContext/ThemeContext";
import Notification from '../../Notification/Notification'; 
import { useAuth } from "../../../pages/hooks/useAuth";
import axios from "axios";

const Quotation = ({ jobCardId }) => {
    const { isDarkMode } = useContext(ThemeContext);
    //console.log('jobCardId:', jobCardId);


    const [selectedDate, setSelectedDate] = useState("2025-06-10");
    const [TenderSignedDate, setTenderSignedDate] = useState("2025-06-10");
    const [isEditing, setIsEditing] = useState(true);
    //const [quotationData, setQuotationData] = useState(null);

    // State for managing expanded/collapsed sections
    const [isQuotationInfoExpanded, setIsQuotationInfoExpanded] = useState(false);
    const [isTenderInfoExpanded, setIsTenderInfoExpanded] = useState(false);
    const [isItemsTableExpanded, setIsItemsTableExpanded] = useState(true); // Added for items table  
    const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
    const [isSpecialNoteExpanded, setIsSpecialNoteExpanded] = useState(false);
    // Destructure all relevant states from the useAuth hook, including isLoading and isAuthenticated
    const { isAuthenticated, userRole } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
    //const [items, setItems] = useState([]);
    const [quotation, setQuotation] = useState(null);

    useEffect(() => {
    // ✅ Keep the initial validity check for jobCardId
    if (!jobCardId || jobCardId === 'undefined' || jobCardId === null) {
        console.log('Invalid jobCardId, skipping fetch');
        return;
    }

    const fetchQuotationData = async () => {
    try {
        // 1. Attempt to fetch an EXISTING quotation first
        console.log('Attempting to fetch existing quotation data for jobCardId:', jobCardId);

        // Use your existing endpoint, which returns 404 if not found
        const response = await axios.get(`http://localhost:8000/api/quotations/${jobCardId}`, { withCredentials: true });
        
        // If the call succeeds, a quotation already exists.
        const data = response.data;
        console.log('Fetched existing quotation:', data);

        // Set the quotation state
        setQuotation(data);

        // Safely set the items from the fetched data
        const safeItems = (data && data.items) ? data.items : [];
        const computedItems = safeItems.map(item => ({
            ...item,
            unitTotalPrice: item.unitPrice && item.quantity
                ? parseFloat(item.unitPrice) * parseFloat(item.quantity)
                : 0
        }));
        setItems(computedItems);
        
    } catch (error) {
        // 2. If the first call fails (e.g., a 404 Not Found),
        // it means no quotation exists yet.
        // Now, we fetch the JobCard's materials to initialize the form.
        console.log("No existing quotation found. Fetching Job Card materials.");
        
        try {
            // Use the NEW endpoint you created in the JobCardController
            const materialsResponse = await axios.get(`http://localhost:8000/api/job-cards/${jobCardId}/items`, { withCredentials: true });
            const materialsData = materialsResponse.data;
            
            console.log('Fetched Job Card materials:', materialsData);

            // ✅ FIX: Normalize the fetched data to match the expected format
            const normalizedItems = materialsData.map(item => ({
                id: item.id,
                // The '??' (nullish coalescing) operator checks if a value is null or undefined
                // This ensures we use the correct key regardless of the endpoint
                materialsNo: item.materialsNo ?? item.materials_no,
                description: item.description ?? item.materials,
                unitPrice: item.unitPrice ?? '', // Fallback to an empty string for the input field
                quantity: item.quantity,
                unitTotalPrice: 0 // Default to 0 for a new quotation total
            }));

            // Log the normalized data to confirm it looks correct
            console.log('Normalized Job Card materials:', normalizedItems);
            
            // Set the items state with the newly normalized array
            setItems(normalizedItems.length > 0 ? normalizedItems : [{ 
                materialsNo: "", 
                description: "", 
                unitPrice: "", 
                quantity: "", 
                unitTotalPrice: "" 
            }]);

            // IMPORTANT: Ensure other state variables are reset for a new quotation
            setQuotation(null); // Clear any old quotation data
            
        } catch (materialsError) {
            console.error("Failed to fetch Job Card materials.", materialsError);
            setItems([{ 
                materialsNo: "", 
                description: "", 
                unitPrice: "", 
                quantity: "", 
                unitTotalPrice: "" 
            }]);
        }
    }
};

    fetchQuotationData();
}, [jobCardId]); // ✅ Added proper dependency array


    // --- Handlers ---
    const handleFieldChange = (e) => {
        if (!isEditing) return;
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    const handleItemChange = (index, field, value) => {
    if (!isEditing) return;
    
    setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[index][field] = value;

        const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
        const quantity = parseFloat(newItems[index].quantity) || 0;
        newItems[index].unitTotalPrice = (unitPrice * quantity).toFixed(2);

        // Check if we need to add a new row (only for the last item)
        const isLastItem = index === newItems.length - 1;
        const hasContent = newItems[index].materialsNo !== "" || 
                          newItems[index].description !== "" || 
                          newItems[index].quantity !== "";

        if (isLastItem && hasContent) {
            // Add new empty row
            newItems.push({ 
                materialsNo: "", 
                description: "", 
                unitPrice: "", 
                quantity: "", 
                unitTotalPrice: "" 
            });
        }

        return newItems;
    });
};

    const handleDeleteRow = (index) => {
    if (!isEditing) {
        console.log('Cannot delete: not in editing mode');
        return;
    }
    
    console.log(`Attempting to delete row at index: ${index}, total items: ${items.length}`);
    
    if (items.length > 1 && index < items.length) {
        setItems(prevItems => {
            const newItems = prevItems.filter((_, i) => i !== index);
            console.log('Items after deletion:', newItems);
            return newItems;
        });
    } else {
        console.log('Cannot delete: either only one item left or invalid index');
    }
};

useEffect(() => {
    console.log('Items state changed:', items);
}, [items]);

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

    const handleSubmit = async () => {
    try {
        // ... (existing validation for items) ...

        // Ensure jobCardId is available
        if (!jobCardId || jobCardId === 'undefined' || jobCardId === null) {
            showNotification("Job Card ID is missing, cannot submit quotation.", "error");
            return;
        }

        const validItems = items.filter(item =>
            item &&
            (item.materialsNo?.trim() || item.description?.trim()) &&
            !isNaN(parseFloat(item.unitPrice)) && parseFloat(item.unitPrice) >= 0 &&
            !isNaN(parseFloat(item.quantity)) && parseFloat(item.quantity) >= 0
        );

        if (validItems.length === 0) {
            showNotification("No valid items to save - please add at least one item.", "error");
            return;
        }

        // The main payload to create/update the quotation record
        const payload = {
            job_card_id: jobCardId,
            attention: fields.attention || null,
            quotation_no: fields.quotation_no || null,
            select_date: selectedDate || null,
            region: fields.region || null,
            ref_qtn: fields.ref_qtn || null,
            site: fields.site || null,
            job_date: fields.job_date || null,
            fam_no: fields.fam_no || null,
            complain_nature: fields.complain_nature || null,
            po_no: fields.po_no || null,
            po_date: fields.po_date || null,
            actual_break_down: fields.actual_break_down || null,
            tender_no: fields.tender_no || null,
            signed_date: TenderSignedDate || null,
            total_without_tax: parseFloat(calculateTotalWithoutTax()) || 0,
            vat: parseFloat(calculateVAT()) || 0,
            total_with_tax: parseFloat(calculateTotalWithTax()) || 0,
            discount: parseFloat(calculateDiscount()) || 0,
            total_with_tax_vs_disc: parseFloat(calculateTotalWithTaxAndDiscount()) || 0,
            special_note: fields.special_note || null,
        };

        // The items payload to update prices
        const itemsPayload = {
            items: validItems.map(item => ({
                id: item.id,
                unitPrice: parseFloat(item.unitPrice) || 0,
                quantity: parseFloat(item.quantity) || 0,
            }))
        };

        // ✅ THE FIX: Conditionally handle create vs. update
        if (quotation && quotation.id) {
            // SCENARIO A: QUOTATION ALREADY EXISTS
            // Update prices first
            const updateResponse = await axios.put(
                `http://localhost:8000/api/quotations/update-prices/${jobCardId}`,
                itemsPayload,
                { withCredentials: true }
            );

            if (updateResponse.status === 200) {
                // Then, update the main quotation fields
                const createResponse = await axios.post('http://localhost:8000/api/quotations', payload, { withCredentials: true });
                if (createResponse.status === 201 || createResponse.status === 200) {
                    showNotification("Quotation submitted successfully!", "success");
                    setIsEditing(false);
                }
            }
        } else {
            // SCENARIO B: NO QUOTATION EXISTS
            // Create the main quotation record FIRST
            const createResponse = await axios.post('http://localhost:8000/api/quotations', payload, { withCredentials: true });

            if (createResponse.status === 201) { // New quotation created successfully
                showNotification("Quotation created successfully!", "success");
                
                // Then, update the prices using the newly created quotation's jobCardId
                const updateResponse = await axios.put(
                    `http://localhost:8000/api/quotations/update-prices/${jobCardId}`,
                    itemsPayload,
                    { withCredentials: true }
                );

                if (updateResponse.status === 200) {
                    showNotification("Prices updated successfully!", "success");
                    setIsEditing(false);
                }
            }
        }

    } catch (error) {
        console.error('Error submitting quotation:', error.response ? error.response.data : error.message);
        const errorMessage = error.response && error.response.data && error.response.data.message
                               ? error.response.data.message
                               : "Error submitting quotation - please try again";
        showNotification(errorMessage, "error");

        if (error.response && error.response.data && error.response.data.errors) {
            console.error('Validation Errors:', error.response.data.errors);
        }
    }
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

    console.log("Rendering with items:", items);

    return (
        <div className={`w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mt-4 sm:mt-6 md:mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-50 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}`}>
            {/* Notification Popup */}
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={clearNotification}
                />
            )}

            {/* Header and Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} `}>
                    Quotation
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    {!isEditing && (
                        <button
                            onClick={handleEdit}
                            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
                        >
                            <FaEdit className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
                            <span className="text-sm sm:text-base">Edit</span>
                        </button>
                    )}
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
                </div>
            </div>

            {/* Quotation Details Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4 sm:mb-6 cursor-pointer" onClick={() => setIsQuotationInfoExpanded(!isQuotationInfoExpanded)}>
                    <h3 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"} flex items-center`}>
                    <FaInfoCircle className="mr-2 text-blue-400" /> Quotation Information
                    </h3>
                    {isQuotationInfoExpanded ? <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                </div>

                {isQuotationInfoExpanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Attention */}
                    <div className="col-span-full sm:col-span-1">
                        <label htmlFor="attention" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Attention:</label>
                        <textarea
                        id="attention"
                        name="attention"
                        value={fields.attention}
                        onChange={handleFieldChange}
                        readOnly={!isEditing}
                        rows="4"
                        className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                    </div>

                    <div className="col-span-full sm:col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Quotation No */}
                        <div>
                        <label htmlFor="quotation_no" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Quotation No:</label>
                        <input
                            type="text"
                            id="quotation_no"
                            name="quotation_no"
                            value={fields.quotation_no}
                            onChange={handleFieldChange}
                            readOnly={!isEditing}
                            className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                        />
                        </div>

                        {/* Selected Date */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                        <label className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date:</label>
                        <div className="relative flex items-center flex-grow">
                            <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => isEditing && setSelectedDate(e.target.value)}
                            readOnly={!isEditing}
                            className={`w-full px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                            />
                            <FaCalendarAlt className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
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
                )}
                </section>
            )}

            {/* Tender Information Section */}
            {(userRole === 'Administrator' || userRole === 'Tecnical_Head') && (
                <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6 cursor-pointer" onClick={() => setIsTenderInfoExpanded(!isTenderInfoExpanded)}>
                        <h3
                        className={`text-xl sm:text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Tender Information
                        </h3>
                        {isTenderInfoExpanded ? <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isTenderInfoExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                                <label htmlFor="tender_no" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tender No:</label>
                                <input
                                    type="text"
                                    id="tender_no"
                                    name="tender_no"
                                    value={fields.tender_no}
                                    onChange={handleFieldChange}
                                    readOnly={!isEditing}
                                    className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                <label className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Signed Date:</label>
                                <div className="relative flex items-center flex-grow">
                                    <input
                                        type="date"
                                        value={TenderSignedDate}
                                        onChange={(e) => isEditing && setTenderSignedDate(e.target.value)}
                                        readOnly={!isEditing}
                                        className={`w-full px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl border-2 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                    />
                                    <FaCalendarAlt className={`absolute right-3 sm:right-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Items Table */}
            <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex justify-between items-center mb-4 sm:mb-6 cursor-pointer" onClick={() => setIsItemsTableExpanded(!isItemsTableExpanded)}>
                    <h3
                    className={`text-xl sm:text-2xl font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                    } flex items-center`}
                    >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Items/Materials Replaced
                    </h3>
                    {isItemsTableExpanded ? <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                </div>
                {isItemsTableExpanded && (
                    <div className="overflow-x-auto">
                        <table className={`w-full text-left rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                            <thead className={`${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-blue-100 text-blue-800'}`}>
                                <tr>
                                    <th className="p-2 sm:p-4 border-b-2 border-r-2 rounded-tl-lg text-xs sm:text-sm md:text-base">Action</th>
                                    <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Materials No</th>
                                    <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Description</th>
                                    <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Price /Rs:</th>
                                    <th className="p-2 sm:p-4 border-b-2 border-r-2 text-xs sm:text-sm md:text-base">Quantity</th>
                                    <th className="p-2 sm:p-4 border-b-2 rounded-tr-lg text-xs sm:text-sm md:text-base">Total /Rs:</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    //console.log("Rendering item:", item);
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
                                                readOnly={true} // Changed to always be true
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={item.description}
                                                readOnly={!true} // Changed to always be true
                                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                                                readOnly={!true} // Changed to always be true
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                            />
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={item.unitTotalPrice}
                                                readOnly={true} // Changed to always be true
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
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
                <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6 cursor-pointer" onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}>
                        <h3
                        className={`text-xl sm:text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Summary
                        </h3>
                        {isSummaryExpanded ? <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isSummaryExpanded && (
                        <div className="overflow-x-auto">
                            <table className={`w-full text-left rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                                <tbody>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} w-3/4`}>
                                            <label className={`block text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (Without TAX):</label>
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} w-1/4`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithoutTax()}
                                                readOnly
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50'}`}>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                                <label htmlFor="vatValue" className={`block text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>VAT (%):</label>
                                                <input
                                                    type="number"
                                                    id="vatValue"
                                                    min="0"
                                                    value={vatValue}
                                                    onChange={handleVatChange}
                                                    readOnly={!isEditing}
                                                    className={`flex-grow px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                                />
                                            </div>
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateVAT()}
                                                readOnly
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <label className={`block text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (With TAX):</label>
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithTax()}
                                                readOnly
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800/70' : 'bg-gray-50'}`}>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                                                <label htmlFor="discountValue" className={`block text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Discount (%):</label>
                                                <input
                                                    type="number"
                                                    id="discountValue"
                                                    min="0"
                                                    value={discountValue}
                                                    onChange={handleDiscountChange}
                                                    readOnly={!isEditing}
                                                    className={`flex-grow px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                                                />
                                            </div>
                                        </td>
                                        <td className={`p-2 sm:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateDiscount()}
                                                readOnly
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
                                            />
                                        </td>
                                    </tr>
                                    <tr className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <td className={`p-2 sm:p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <label className={`block text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total (With TAX & Discount):</label>
                                        </td>
                                        <td className={`p-2 sm:p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                            <input
                                                type="text"
                                                value={calculateTotalWithTaxAndDiscount()}
                                                readOnly
                                                className={`w-full px-2 py-1 sm:px-3 sm:py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} cursor-not-allowed opacity-70`}
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
                <section className={`mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 sm:mb-6 cursor-pointer" onClick={() => setIsSpecialNoteExpanded(!isSpecialNoteExpanded)}>
                        <h3
                        className={`text-xl sm:text-2xl font-semibold ${
                            isDarkMode ? "text-gray-200" : "text-gray-700"
                        } flex items-center`}
                        >
                        <FaInfoCircle className="mr-2 text-blue-400" /> Additional Notes
                        </h3>
                        {isSpecialNoteExpanded ? <FaChevronUp className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} /> : <FaChevronDown className={`text-base sm:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />}
                    </div>
                    {isSpecialNoteExpanded && (
                        <div>
                            <label htmlFor="special_note" className={`block text-sm sm:text-base font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Special Note:</label>
                            <textarea
                                id="special_note"
                                name="special_note"
                                value={fields.special_note}
                                onChange={handleFieldChange}
                                readOnly={!isEditing}
                                rows="4"
                                className={`w-full border rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 transition-all duration-200 focus:ring-2 sm:focus:ring-4 focus:ring-blue-300 ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-300'} ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}`}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* Submit Button */}
            <div className="flex justify-end mt-6 sm:mt-8">
                {isEditing && (
                    <button
                        onClick={handleSubmit}
                        className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-300 flex items-center transform hover:scale-105 ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    >
                        <FaCheck className="mr-2 sm:mr-3 text-base sm:text-lg" /> 
                        <span className="text-sm sm:text-base">Submit Quotation</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quotation;