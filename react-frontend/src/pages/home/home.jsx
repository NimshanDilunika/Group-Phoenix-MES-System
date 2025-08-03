import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FiFilter, FiWind } from "react-icons/fi";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaRegFlag } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import { PiClockClockwiseFill } from "react-icons/pi";
import { MdArrowDropDown } from "react-icons/md";
import { AirVent, SunDim, MonitorCog, Waves, Wrench, Hammer, Cable, Volume2, Bug, Phone, Cog, BatteryCharging, Wind, Unplug, Tag } from "lucide-react";
import { FaFaucet } from "react-icons/fa";
import { GiMechanicGarage } from "react-icons/gi";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import JobHome from "../JobHome/JobHome";
import LoadingItems from "../../components/Loading/LoadingItems";
import '../../components/SummaryDashboard/JobStatusPieChart';
import { useAuth } from "../../pages/hooks/useAuth";

const DynamicIcons = {
  FaFaucet: FaFaucet,
  Unplug: Unplug,
  GiMechanicGarage: GiMechanicGarage,
  BatteryCharging: BatteryCharging,
  AirVent: AirVent,
  SunDim: SunDim,
  MonitorCog: MonitorCog,
  Wind: Wind,
  Cable: Cable,
  Bug: Bug,
  Cog: Cog,
  Phone: Phone,
  Volume2: Volume2,
  Wrench: Wrench,
  Waves: Waves,
  Hammer: Hammer,
  Tag: Tag,
};

const StatusIcons = {
  Pending: PiClockClockwiseFill,
  Todo: LuListTodo,
  "In Process": FaRegClock,
  Ended: FaRegFlag,
  Completed: FaCheckCircle,
  Cancelled: FaTimesCircle,
};

const StatusIconColors = {
  Pending: "text-blue-500",
  Todo: "text-blue-500",
  "In Process": "text-orange-400",
  Ended: "text-yellow-400",
  Completed: "text-green-400",
  Cancelled: "text-red-400",
};

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [selectedJob, setSelectedJob] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const { userRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.create-job-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const countJobsByService = jobs.reduce((acc, job) => {
    acc[job.service] = (acc[job.service] || 0) + 1;
    return acc;
  }, {});

  const countJobsBystatus = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const services = items.map(item => {
    const IconComponent = DynamicIcons[item.icon] || Tag;
    return {
      id: item.id,
      icon: <IconComponent className="text-2xl" />,
      name: item.name,
      jobs: countJobsByService[item.name] || 0
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
          className={`
            px-4 py-2 rounded-lg transition-colors duration-200
            ${currentPage === i
            ? 'border-blue-500 bg-blue-500 text-white'
            : `hover:border-blue-500 ${isDarkMode ? 'hover:bg-gray-800 bg-gray-900 text-gray-300' : 'hover:bg-gray-200 bg-white text-gray-800'}`
          }
          `}
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
    setSelectedJob({ ...job, job_home_id: job.id });
  };

  const handleCreateJobCardClick = (serviceName = null) => {
    if (selectedJob && selectedJob.service === serviceName) {
      console.log('A job is already selected. Please deselect it to create a new job.');
      return;
    }
    setSelectedJob({ service: serviceName });
    setIsDropdownOpen(false);

    axios.post("http://127.0.0.1:8000/api/job-homes", {
      job_type: serviceName,
      customer_id: 1,
      job_status: `Pending - ${serviceName}`
    })
      .then(response => {
        console.log('JobHome created:', response.data.job_home);
      })
      .catch(error => {
        console.error('Error creating JobHome:', error.response?.data || error.message);
      });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  if (selectedJob) {
    return <JobHome job={selectedJob} onGoBack={() => setSelectedJob(null)} />;
  }

  if (itemsLoading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} p-6 min-h-screen flex justify-center items-center`}>
        <LoadingItems isDarkMode={isDarkMode} />
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
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} space-y-8 p-4 md:p-6 min-h-screen`}>
      <div className={`${isDarkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl p-4 md:p-6 shadow-xl mx-auto`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold">Job Management</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-base md:text-lg`}>
              Filter and manage your service jobs efficiently.
            </p>
          </div>
          {(userRole === 'Administrator' || userRole === 'Tecnical_Head' || userRole === 'Manager') && (
            <div className="relative inline-block text-left create-job-dropdown-container w-full sm:w-auto">
              <button
                type="button"
                className={`
                  w-full justify-center sm:w-auto
                  ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'}
                  px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md flex items-center
                `}
                onClick={handleDropdownToggle}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                <IoIosAddCircle className="inline-block mr-2 text-lg" />
                <span>Create Job Card</span>
                <MdArrowDropDown className={`ml-1 text-xl transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              {isDropdownOpen && (
                <div
                  className={`
                    ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}
                    absolute right-0 mt-2 w-full sm:w-56 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10
                  `}
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
                          className={`
                            ${isDarkMode ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}
                            block w-full text-left px-4 py-2 text-sm transition-colors duration-200
                          `}
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
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`}>
        {services.length === 0 ? (
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} col-span-full text-center`}>No services found. Add some items to display here.</p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`
                service-card cursor-pointer rounded-lg p-4 shadow-md border-2
                ${selectedService === service.name
                ? isDarkMode
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-blue-500 border-blue-500 text-white'
                : isDarkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                  : 'bg-white border-gray-300 hover:border-blue-500'
              }
                transition-all duration-300 flex items-center space-x-3
              `}
              onClick={() => setSelectedService(service.name)}
              aria-label={`Filter by ${service.name}`}
            >
              <div className={`
                ${selectedService === service.name
                  ? 'text-white'
                  : isDarkMode
                    ? 'text-blue-500'
                    : 'text-blue-500'
                } transition-colors duration-300
              `}>
                {service.icon}
              </div>
              <div>
                <p className="font-semibold text-base sm:text-lg">{service.name}</p>
                <p className={`text-sm ${selectedService === service.name ? 'text-white' : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                  {service.jobs} Jobs
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`status-filter ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 md:p-6 rounded-xl shadow-lg`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-2 sm:mb-0">
            <FiFilter className="text-blue-500 text-2xl" /> Filter by Status
          </h2>
          <button
            className={`
              text-blue-500 border border-blue-500 text-sm font-medium py-2 px-4 rounded-full shadow-sm
              hover:bg-blue-600 hover:text-white hover:border-transparent
              transition-all duration-300 w-full sm:w-auto
            `}
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="status-cards grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {statuses.map((status) => {
            const CurrentStatusIcon = StatusIcons[status.status];
            const iconColorClass = StatusIconColors[status.status];

            return (
              <button
                key={status.status}
                className={`
                  status-card flex flex-col items-center justify-center p-4 rounded-lg shadow-md transition-all duration-300 transform border-2
                  ${selectedStatus === status.status
                  ? isDarkMode
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-blue-500 text-white border-blue-500'
                  : isDarkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-500'
                    : 'bg-white text-gray-800 hover:bg-gray-200 border-gray-300'
                }
                `}
                onClick={() => setSelectedStatus(status.status)}
                aria-label={`Filter by ${status.text}`}
              >
                {CurrentStatusIcon && (
                  <CurrentStatusIcon className={`text-3xl ${selectedStatus === status.status ? 'text-white' : iconColorClass}`} />
                )}
                <span className={`text-xs sm:text-sm mt-2 text-center`}>
                  {status.text} - {status.jobs} jobs
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <h2 className={`${isDarkMode ? 'text-white' : 'text-black'} text-xl md:text-2xl font-semibold mb-4 mt-8`}>
        Filtered Jobs List ({filteredJobs.length} Jobs)
      </h2>

      {displayedJobs.length > 0 ? (
        <div className={`job-list space-y-4`}>
          {displayedJobs.map(job => {
            const trimmedStatus = job.status ? job.status.trim() : "";
            const CurrentStatusIcon = StatusIcons[trimmedStatus];
            const iconColorClass = StatusIconColors[trimmedStatus];

            return (
              <div
                key={job.id}
                className={`
                  job-card p-4 md:p-5 rounded-md shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between
                  transition-all duration-300 cursor-pointer group border-2
                  ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-700 hover:border-blue-500' : 'bg-white text-black hover:bg-gray-200 border-gray-200 hover:border-blue-500'}
                `}
                onClick={() => handleJobClick(job)}
                tabIndex="0"
                role="button"
              >
                <div className="flex flex-col mb-2 sm:mb-0">
                  <p className="text-lg font-bold">{job.title}</p>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{job.company}</span>
                </div>
                <div className="flex items-center gap-4 text-sm sm:text-base">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap`}>📅 {job.date}</span>
                  {CurrentStatusIcon && (
                    <CurrentStatusIcon className={`text-3xl ${iconColorClass}`} />
                  )}
                </div>
              </div>
            );
          })}
          {filteredJobs.length > jobsPerPage && (
            <div className={`flex items-center justify-center space-x-2 mt-4`}>
              <button
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === 1
                    ? 'cursor-not-allowed text-gray-400 bg-gray-600'
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-blue-500 text-gray-300'
                      : 'bg-gray-200 hover:bg-blue-500 text-gray-800'
                }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                Prev
              </button>
              <div className="flex space-x-2">
                {renderPageButtons()}
              </div>
              <button
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  currentPage === totalPages
                    ? 'cursor-not-allowed text-gray-400 bg-gray-600'
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-blue-500 text-gray-300'
                      : 'bg-gray-200 hover:bg-blue-500 text-gray-800'
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
        <p className="text-center text-gray-500 py-8">No jobs found that match the selected filters.</p>
      )}
    </div>
  );
};

export default Home;