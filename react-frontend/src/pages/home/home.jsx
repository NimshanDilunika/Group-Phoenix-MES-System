import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FiFilter, FiWind } from "react-icons/fi";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaRegFlag } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import { PiClockClockwiseFill } from "react-icons/pi";
import { MdArrowDropDown } from "react-icons/md"; // Import an arrow icon for the dropdown
import { AirVent, SunDim, MonitorCog, Waves , Wrench,Hammer, Cable, Volume2 , Bug, Phone, Cog, BatteryCharging, Wind, Unplug} from "lucide-react";
// Import icons from react-icons based on your database values (e.g., FaFaucet, GiMechanicGarage)
import { FaFaucet } from "react-icons/fa";
import { GiMechanicGarage } from "react-icons/gi";
import { Tag } from "lucide-react"; // Assuming 'Tag' is a fallback from Lucide
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import JobHome from "../JobHome/JobHome";
import '../../components/SummaryDashboard/JobStatusPieChart'; // Ensure this path is correct
import { useAuth } from "../../pages/hooks/useAuth";

const DynamicIcons = {
    FaFaucet: FaFaucet,
    Unplug :Unplug,
    GiMechanicGarage: GiMechanicGarage,
    BatteryCharging: BatteryCharging,
    AirVent: AirVent,
    SunDim: SunDim,
    MonitorCog: MonitorCog,
    Wind : Wind,
    Cable: Cable,
    Bug : Bug,
    Cog: Cog,
    Phone: Phone,
    Volume2: Volume2,
    Wrench: Wrench,
    Waves: Waves,
    Hammer: Hammer,
    Tag: Tag,
};
// Map status strings to their respective icons
const StatusIcons = {
    Pending: PiClockClockwiseFill,
    Todo: LuListTodo,
    "In Process": FaRegClock,
    Ended: FaRegFlag,
    Completed: FaCheckCircle,
    Cancelled: FaTimesCircle,
};

// Map status strings to their respective colors
const StatusIconColors = {
    Pending: "text-blue-500",
    Todo: "text-blue-500", // Often same as pending or a distinct blue
    "In Process": "text-orange-400",
    Ended: "text-yellow-400",
    Completed: "text-green-400",
    Cancelled: "text-red-400",
};


const Home = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;
    const [selectedJob, setSelectedJob] = useState(null);

    const [items, setItems] = useState([]); // State to store fetched items
    const [itemsLoading, setItemsLoading] = useState(true); // Loading state for items
    const [itemsError, setItemsError] = useState(null); // Error state for items
    const [jobs, setJobs] = useState([]);

    

    //const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);


    const { isAuthenticated, userRole, isLoading } = useAuth();
    // --- NEW STATE FOR DROPDOWN ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // --- END NEW STATE ---

    // Sample Job Data (your existing data - consider fetching this from backend too!)
    // const jobs = [
    //     { id: 61, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    //     { id: 31, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    //     { id: 32, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
        
    // ];

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/job-homes")
        .then(response => {
            const formattedJobs = response.data.map(job => ({
            id: job.id,
            title: job.job_type || "Untitled Job",
            company: job.customer?.name || "Unknown Company",
            date: job.created_at ? new Date(job.created_at).toLocaleDateString() : "N/A",
            status: job.job_status ? job.job_status.trim() : "",
            service: job.job_type,
            }));
            setJobs(formattedJobs);
            //setFilteredJobs(formattedJobs); // Or apply filters here
        })
        .catch(error => {
            console.error("Error fetching jobs:", error);
        });
    }, []);
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/items");
                setItems(response.data);
            } catch (err) {
                console.error("Error fetching items:", err);
                setItemsError("Failed to load services. Please refresh the page.");
            } finally {
                setItemsLoading(false);
            }
        };

        fetchItems();
    }, []); // Empty dependency array ensures this runs once on mount

    // --- NEW useEffect to close dropdown on outside click ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is outside the dropdown container
            // Use a ref for more precision if needed, but closest works for simple cases
            if (isDropdownOpen && !event.target.closest('.create-job-dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);
    // --- END NEW useEffect ---

    const countJobsByService = jobs.reduce((acc, job) => {
        acc[job.service] = (acc[job.service] || 0) + 1;
        return acc;
    }, {});

    const countJobsBystatus = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
    }, {});

    const services = items.map(item => {
        const IconComponent = DynamicIcons[item.icon] || Tag; // Get the component from the map, fallback to Tag
        return {
            id: item.id, // Add item.id for the key prop
            icon: <IconComponent className="text-2xl" />,
            name: item.name, // Use 'name' from the item
            jobs: countJobsByService[item.name] || 0 // Count jobs by this item's name
        };
    });

    const statuses = [
        { icon: <PiClockClockwiseFill />, text: "Pending", status: "Pending", jobs: countJobsBystatus["Pending"] || 0 },
        { icon: <LuListTodo />, text: "Todo", status: "Todo", jobs: countJobsBystatus["Todo"] || 0 },
        { icon: <FaRegClock />, text: "In Process", status: "In Process", jobs: countJobsBystatus["In Process"] || 0 },
        { icon: <FaRegFlag />, text: "Ended", status: "Ended", jobs: countJobsBystatus["Ended"] || 0 },
        { icon: <FaCheckCircle />, text: "Completed", status: "Completed", jobs: countJobsBystatus["Completed"] || 0 },
        { icon: <FaTimesCircle />, text: "Cancelled", status: "Cancelled", jobs: countJobsBystatus["Cancelled"] || 0 }
    ];

    const [selectedService, setSelectedService] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const filteredJobs = jobs.filter(job => {
    const matchesService = selectedService ? job.service === selectedService : true;
    const matchesStatus = selectedStatus ? job.status === selectedStatus : true;
    return matchesService && matchesStatus;
    });

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const displayedJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPageButtons = () => {
        const buttons = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 3);

        if (endPage - startPage < 3) {
            startPage = Math.max(1, endPage - 3);
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`px-4 py-2 rounded border-2 border-transparent transition-colors duration-200 ${
                        currentPage === i
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : `hover:border-blue-500 ${
                                isDarkMode
                                    ? 'hover:bg-gray-800 bg-gray-900 text-gray-300'
                                    : 'hover:bg-gray-200 bg-white text-gray-800'
                            }`
                    }`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    };

    const clearFilters = () => {
        setSelectedStatus(null);
        setSelectedService(null);
        setCurrentPage(1);
    };

const handleJobClick = (job) => {
        setSelectedJob({...job, job_home_id: job.id});
    };

    // --- MODIFIED handleCreateJobCardClick ---
    // Now accepts an optional 'serviceName' argument
    const handleCreateJobCardClick = (serviceName = null) => {
        if (selectedJob && selectedJob.service === serviceName) {
        // If a job is already selected, don't trigger new job creation
        console.log('A job is already selected. Please deselect it to create a new job.');
        return;
    }
    // Set selected job (for UI/state use)
        setSelectedJob({ service: serviceName });

        // Close dropdown after selection
        setIsDropdownOpen(false);

        // Create new JobHome in Laravel backend
        axios.post("http://127.0.0.1:8000/api/job-homes", {
            job_type: serviceName,
            customer_id: 1, // Replace with actual selected customer ID
            job_status: `Pending - ${serviceName}`
        })
        .then(response => {
            console.log('JobHome created:', response.data.job_home);
            // You can redirect, refresh list, show success toast, etc.
        })
        .catch(error => {
            console.error('Error creating JobHome:', error.response?.data || error.message);
        });
    };
    // --- END MODIFIED handleCreateJobCardClick ---

    // --- NEW handleDropdownToggle ---
    const handleDropdownToggle = () => {
        setIsDropdownOpen(prev => !prev);
    };
    // --- END NEW handleDropdownToggle ---


    if (selectedJob) {
        return <JobHome job={selectedJob} onGoBack={() => setSelectedJob(null)} />;
    }

    if (itemsLoading) {
        return (
            <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 min-h-screen flex justify-center items-center`}>
                <p>Loading services...</p>
            </div>
        );
    }

    if (itemsError) {
        return (
            <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 min-h-screen flex justify-center items-center`}>
                <div className="bg-red-600 text-white p-4 rounded-lg flex items-center space-x-2">
                    <span>{itemsError}</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} space-y-8 p-6 min-h-screen`}>
            {/*<JobStatusPieChart jobs={jobs}/>*/}
            {/* Header Section */}
            <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-6 shadow-xl mx-auto`}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-3xl font-semibold">Job Management</h1>
                        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Filter and manage your service jobs efficiently.</p>
                    </div>

                    {/* --- NEW DROPDOWN CONTAINER --- */}
                    {/*
                        This is where you'll place the code snippet.
                        A cleaner way to handle the conditional rendering is with a ternary operator.
                    */}
                    {userRole === 'Administrator' || userRole === 'Tecnical_Head' || userRole === 'Manager'  ? (
                        <div className="relative inline-block text-left create-job-dropdown-container">
                        <button
                            type="button"
                            className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'} px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md flex items-center`}
                            onClick={handleDropdownToggle}
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen ? "true" : "false"}
                        >
                            <IoIosAddCircle className="inline-block mr-2 text-lg" />
                            Create Job Card
                            <MdArrowDropDown className={`ml-1 text-xl transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>

                        {isDropdownOpen && (
                            <div
                            className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} absolute right-0 mt-2 w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="menu-button"
                            tabIndex="-1"
                            >
                            <div className="py-1" role="none">
                                {items.length === 0 ? (
                                <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} px-4 py-2 text-sm`}>
                                    No services available.
                                </div>
                                ) : (
                                items.map(item => (
                                    <button
                                    key={item.id}
                                    className={`${isDarkMode ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'} block w-full text-left px-4 py-2 text-sm transition-colors duration-200`}
                                    role="menuitem"
                                    tabIndex="-1"
                                    onClick={() => handleCreateJobCardClick(item.name)}
                                    >
                                    {item.name}
                                    </button>
                                ))
                                )}
                            </div>
                            </div>
                        )}
                        </div>
                    ) : null}
                    {/* --- END NEW DROPDOWN CONTAINER --- */}
                </div>
            </div>

            {/* Services Section */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {services.length === 0 ? (
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} col-span-full text-center`}>No services found. Add some items to display here.</p>
                ) : (
                    services.map((service) => (
                        <div
                            key={service.id} // Changed key to service.id (from item.id)
                            className={`service-card ${selectedService === service.name ? 'bg-blue-500 border-blue-500' : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
                                ${isDarkMode ? 'text-white' : (selectedService === service.name ? 'text-white' : 'text-black')} rounded-lg p-4 shadow-md border-2 hover:border-blue-500 transition-all duration-300 flex items-center space-x-3`}
                            onClick={() => setSelectedService(service.name)}
                        >
                            <div className={`${selectedService === service.name ? 'text-gray-300' : isDarkMode ? 'text-blue-500' : 'text-blue-500'} transition-colors duration-300`}>
                                {service.icon}
                            </div>
                            <div>
                                <p className="font-medium">{service.name}</p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{service.jobs} Jobs</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Status Filter Section */}
            <div className={`status-filter ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg`}>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FiFilter className="text-blue-500" /> Filter by Status
                </h2>

                {/* Clear Filters Button */}
                <div className="flex justify-between items-center text-gray-200">
                    <span></span>
                    <button
                        className="bg-transparent text-blue-500 hover:text-white hover:bg-blue-600 border border-blue-500 hover:border-transparent text-sm font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Status Buttons */}
                <div className="status-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                    {statuses.map((status) => {
                        const CurrentStatusIcon = StatusIcons[status.status]; // Get the icon component
                        const iconColorClass = StatusIconColors[status.status]; // Get the color class

                        return (
                            <div
                                key={status.status} // Changed key to status.status for uniqueness
                                className={`
                                    status-card grid place-items-center
                                    ${selectedStatus === status.status
                                        ? (isDarkMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-500 text-white border-blue-500')
                                        : (isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-500' : 'bg-white text-gray-800 hover:bg-gray-200 border-gray-300')
                                    }
                                    p-6 rounded-lg shadow-lg transition-all duration-300 transform
                                    border-2 hover:border-blue-600 flex items-center space-x-3`}
                                onClick={() => setSelectedStatus(status.status)}
                            >
                                {CurrentStatusIcon && ( // Render icon only if component exists
                                    <CurrentStatusIcon className={`text-[30px] ${selectedStatus === status.status ? 'text-white' : iconColorClass}`} />
                                )}
                                <span className={`text-sm mt-2 ${selectedStatus === status.status ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>{status.text} - {status.jobs} jobs</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Filtered Jobs List */}
            <h2 className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg text-xl font-semibold mb-4 mt-13`}>
                Filtered Jobs List ({filteredJobs.length} Jobs)
            </h2>

            {displayedJobs.length > 0 ? (
                <div className={`job-list space-y-4 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                    {displayedJobs.map(job => {
                        const trimmedStatus = job.status ? job.status.trim() : "";
                        const CurrentStatusIcon = StatusIcons[trimmedStatus]; // Get icon component dynamically
                        const iconColorClass = StatusIconColors[trimmedStatus]; // Get color class dynamically

                        return (
                            <div
                                key={job.id}
                                className={`job-card ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-black hover:bg-gray-200'} p-5 rounded-md shadow-md flex items-center justify-between transition-all duration-300 cursor-pointer group`}
                                onClick={() => handleJobClick(job)}
                            >
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">{job.title}</p>
                                    <span className="text-sm text-gray-400">{job.company}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-6">
                                    <span className="text-gray-400 whitespace-nowrap">📅 {job.date}</span>
                                    {CurrentStatusIcon && (
                                        <CurrentStatusIcon className={`text-[30px] ${iconColorClass}`} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredJobs.length > jobsPerPage && (
                        <div className={`flex items-left justify-center p-4 rounded-lg shadow-md mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    currentPage === 1
                                        ? 'cursor-not-allowed text-gray-400'
                                        : `${isDarkMode ? 'bg-gray-700 hover:bg-blue-500 text-gray-300' : 'bg-gray-200 hover:bg-blue-500 text-gray-800'}`
                                }`}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous Page"
                            >
                                Prev
                            </button>
                            <div className="flex space-x-2 mx-2">
                                {renderPageButtons()}
                            </div>
                            <button
                                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    currentPage === totalPages
                                        ? 'cursor-not-allowed text-gray-400'
                                        : `${isDarkMode ? 'bg-gray-700 hover:bg-blue-500 text-gray-300' : 'bg-gray-200 hover:bg-blue-500 text-gray-800'}`
                                }`}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next Page"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500">No jobs found</p>
            )}

        </div>
    );
};

export default Home;