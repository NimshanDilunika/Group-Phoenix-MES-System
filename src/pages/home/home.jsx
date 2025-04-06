import React, { useState, useContext } from "react";
import { FiFilter, FiWind } from "react-icons/fi";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BsBatteryCharging, BsBrightnessHigh } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import { PiClockClockwiseFill } from "react-icons/pi";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import JobHome from "../JobHome/JobHome"; // Assuming JobHome is in a separate file
import Summary from '../summary/summary';
import '../../components/SummaryDashboard/JobStatusPieChart';
import JobStatusPieChart from "../../components/SummaryDashboard/JobStatusPieChart";

const Home = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [selectedJob, setSelectedJob] = useState(null); // State to hold the selected job for JobHome

  // Sample Job Data
  const jobs = [
    { id: 61, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 31, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 32, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 33, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 2, title: "Solar Panel Setup", company: "XYZ Corp", date: "10 March 2024", status: "Todo", service: "Generator Services" },
    { id: 3, title: "AC Maintenance", company: "HomeCare", date: "15 March 2024", status: "Todo", service: "Generator Services" },
    { id: 4, title: "Generator Repair", company: "ABC Company", date: "20 March 2024", status: "Todo", service: "Generator Services" },
    { id: 5, title: "Solar Installation", company: "SolarTech", date: "25 March 2024", status: "Cancelled", service: "Solar Systems" },
    { id: 6, title: "AC Installation", company: "HomeCare", date: "30 March 2024", status: "In Process", service: "Air Conditioning", description: "Initial job registration" },
    { id: 7, title: "HVAC System Setup", company: "ThermoTech", date: "01 April 2024", status: "In Process", service: "HVAC" },
    { id: 8, title: "Solar Battery Backup", company: "Renew Power", date: "12 April 2024", status: "Pending", service: "Solar Systems" },
    { id: 9, title: "Pool Heater Installation", company: "Aqua Solutions", date: "18 April 2024", status: "Completed", service: "Pool Services" },
    { id: 10, title: "Wind Turbine Setup", company: "EcoPower", date: "23 April 2024", status: "In Process", service: "Wind Energy" },
    { id: 11, title: "Roof Insulation", company: "HomeCare", date: "28 April 2024", status: "Todo", service: "Home Improvement" },
    { id: 12, title: "Generator Maintenance", company: "ABC Company", date: "05 May 2024", status: "Todo", service: "Generator Services" },
    { id: 13, title: "Solar Panel Replacement", company: "SolarTech", date: "11 May 2024", status: "Pending", service: "Solar Systems" },
    { id: 14, title: "Air Duct Cleaning", company: "CleanAir", date: "20 May 2024", status: "Completed", service: "Air Conditioning" },
    { id: 15, title: "Electrical Panel Upgrade", company: "ABC Company", date: "25 May 2024", status: "In Process", service: "Electrical Services" },
    { id: 16, title: "Solar Energy Storage Installation", company: "Renew Power", date: "02 June 2024", status: "In Process", service: "Solar Systems" },
    { id: 17, title: "Water Heater Replacement", company: "Plumbing Pros", date: "07 June 2024", status: "Pending", service: "Plumbing Services" },
    { id: 18, title: "New AC Unit Installation", company: "HomeCare", date: "14 June 2024", status: "Completed", service: "Air Conditioning" },
    { id: 19, title: "Wind Turbine Maintenance", company: "EcoPower", date: "19 June 2024", status: "Cancelled", service: "Wind Energy" },
    { id: 20, title: "Solar Water Heater Installation", company: "SolarTech", date: "22 June 2024", status: "In Process", service: "Solar Systems" },
    { id: 21, title: "Smart Thermostat Installation", company: "Smart Home", date: "25 June 2024", status: "Todo", service: "Home Automation" },
    { id: 22, title: "Home Solar Panel Setup", company: "Green Energy", date: "01 July 2024", status: "In Process", service: "Solar Systems" },
    { id: 23, title: "Water Filtration System Setup", company: "Pure Water", date: "08 July 2024", status: "Pending", service: "Plumbing Services" },
    { id: 24, title: "Lighting Control System", company: "Smart Home", date: "15 July 2024", status: "Completed", service: "Home Automation" },
    { id: 25, title: "Fireplace Installation", company: "HomeCare", date: "22 July 2024", status: "Pending", service: "Home Improvement" },
    { id: 26, title: "Electric Vehicle Charger Installation", company: "EV Solutions", date: "29 July 2024", status: "In Process", service: "Electric Services" },
    { id: 27, title: "Solar Panel Testing", company: "SolarTech", date: "03 August 2024", status: "Completed", service: "Solar Systems" },
    { id: 28, title: "Electric Water Heater Setup", company: "Plumbing Pros", date: "10 August 2024", status: "In Process", service: "Plumbing Services" },
    { id: 29, title: "Home Battery Backup", company: "Renew Power", date: "17 August 2024", status: "Pending", service: "Home Energy" },
    { id: 30, title: "Solar Water Pump Installation", company: "SolarTech", date: "24 August 2024", status: "Completed", service: "Solar Systems" },
    { id: 34, title: "Smart Home Setup", company: "Tech Solutions", date: "30 August 2024", status: "In Process", service: "Home Automation" },
    { id: 35, title: "HVAC Repair", company: "ThermoTech", date: "05 September 2024", status: "Pending", service: "HVAC" },
    { id: 36, title: "Solar System Upgrade", company: "SolarTech", date: "10 September 2024", status: "Completed", service: "Solar Systems" },
    { id: 37, title: "Water Pump Repair", company: "Plumbing Pros", date: "15 September 2024", status: "Cancelled", service: "Plumbing Services" },
    { id: 38, title: "Generator Tune-up", company: "ABC Company", date: "20 September 2024", status: "Todo", service: "Generator Services" },
    { id: 39, title: "AC Filter Replacement", company: "CleanAir", date: "25 September 2024", status: "In Process", service: "Air Conditioning" },
    { id: 40, title: "Electrical Wiring Check", company: "EV Solutions", date: "30 September 2024", status: "Pending", service: "Electrical Services" },
    { id: 41, title: "Solar Panel Cleaning", company: "SolarTech", date: "05 October 2024", status: "Completed", service: "Solar Systems" },
    { id: 42, title: "Water Heater Installation", company: "Plumbing Pros", date: "10 October 2024", status: "In Process", service: "Plumbing Services" },
    { id: 43, title: "Home Energy Audit", company: "Renew Power", date: "15 October 2024", status: "Pending", service: "Home Energy" },
    { id: 44, title: "Smart Lighting Setup", company: "Smart Home", date: "20 October 2024", status: "Todo", service: "Generator Services" },
    { id: 45, title: "Fire Alarm Installation", company: "HomeCare", date: "25 October 2024", status: "Completed", service: "Home Improvement" },
    { id: 46, title: "EV Charger Repair", company: "EV Solutions", date: "30 October 2024", status: "Cancelled", service: "Electric Services" },
    { id: 47, title: "Solar Inverter Repair", company: "SolarTech", date: "05 November 2024", status: "In Process", service: "Solar Systems" },
    { id: 48, title: "Water Softener Setup", company: "Pure Water", date: "10 November 2024", status: "Pending", service: "Plumbing Services" },
    { id: 49, title: "Home Battery Maintenance", company: "Renew Power", date: "15 November 2024", status: "Completed", service: "Home Energy" },
    { id: 50, title: "Smart Lock Installation", company: "Smart Home", date: "20 November 2024", status: "Todo", service: "Generator Services" },
    { id: 51, title: "Chimney Cleaning", company: "HomeCare", date: "25 November 2024", status: "In Process", service: "Home Improvement" },
    { id: 52, title: "Electrical Panel Repair", company: "EV Solutions", date: "30 November 2024", status: "Pending", service: "Electric Services" },
    { id: 53, title: "Solar Panel Inspection", company: "SolarTech", date: "05 December 2024", status: "Completed", service: "Solar Systems" },
    { id: 54, title: "Drain Cleaning", company: "Plumbing Pros", date: "10 December 2024", status: "Cancelled", service: "Plumbing Services" },
    { id: 55, title: "Generator Overhaul", company: "ABC Company", date: "15 December 2024", status: "Todo", service: "Generator Services" },
    { id: 56, title: "AC Compressor Repair", company: "CleanAir", date: "20 December 2024", status: "Pending", service: "Air Conditioning" },
    { id: 57, title: "Smart Thermostat Repair", company: "Smart Home", date: "25 December 2024", status: "Completed", service: "Home Automation" },
    { id: 58, title: "Roof Repair", company: "HomeCare", date: "30 December 2024", status: "Todo", service: "Home Improvement" },
    { id: 59, title: "EV Charging Station Setup", company: "EV Solutions", date: "04 January 2025", status: "In Process", service: "Electric Services" },
    { id: 60, title: "Solar System Maintenance", company: "SolarTech", date: "09 January 2025", status: "Pending", service: "Solar Systems" }
  ];


  // Count jobs by service
  const countJobsByService = jobs.reduce((acc, job) => {
    if (acc[job.service]) {
      acc[job.service]++;
    } else {
      acc[job.service] = 1;
    }
    return acc;
  }, {});

  // Count jobs by status
  const countJobsBystatus = jobs.reduce((acc, job) => {
    if (acc[job.status]) {
      acc[job.status]++;
    } else {
      acc[job.status] = 1;
    }
    return acc;
  }, {});

  const jobCountsByServiceAndStatus = jobs.reduce((acc, job) => {
    if (!acc[job.service]) {
      acc[job.service] = {};
    }
    if (!acc[job.service][job.status]) {
      acc[job.service][job.status] = 0;
    }
    acc[job.service][job.status]++;
    return acc;
  }, {});

  const services = [
    { icon: <BsBatteryCharging className="text-2xl" />, name: "Generator Services", jobs: countJobsByService["Generator Services"] || 0 },
    { icon: <BsBrightnessHigh className="text-2xl" />, name: "Solar Systems", jobs: countJobsByService["Solar Systems"] || 0 },
    { icon: <FiWind className="text-2xl" />, name: "Air Conditioning", jobs: countJobsByService["Air Conditioning"] || 0 }
  ];

  const statuses = [
    { icon: <PiClockClockwiseFill className="text-[30px] text-blue-500" />, text: "Pending", status: "Pending", jobs: countJobsBystatus["Pending"] || 0 },
    { icon: <LuListTodo className="text-[30px] text-blue-500" />, text: "Todo", status: "Todo", jobs: countJobsBystatus["Todo"] || 0 },
    { icon: <FaRegClock className="text-[30px] text-orange-400" />, text: "In Process", status: "In Process", jobs: countJobsBystatus["In Process"] || 0 },
    { icon: <FaRegFlag className="text-[30px] text-yellow-400" />, text: "Ended", status: "Ended", jobs: countJobsBystatus["Ended"] || 0 },
    { icon: <FaCheckCircle className="text-[30px] text-green-400" />, text: "Completed", status: "Completed", jobs: countJobsBystatus["Completed"] || 0 },
    { icon: <FaTimesCircle className="text-[30px] text-red-400" />, text: "Cancelled", status: "Cancelled", jobs: countJobsBystatus["Cancelled"] || 0 }
  ];

  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const filteredJobs = jobs.filter(job => {
    const matchesService = selectedService ? job.service === selectedService : true;
    const matchesStatus = selectedStatus ? job.status === selectedStatus : true;
    return matchesService && matchesStatus;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const displayedJobs = filteredJobs.slice(startIndex, endIndex);

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
    setSelectedJob(job);
  };

  if (selectedJob) {
    return <JobHome job={selectedJob} onGoBack={() => setSelectedJob(null)} />;
  }

  return (
    
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} space-y-8 p-6 min-h-screen`}>
      {/*<JobStatusPieChart jobs={jobs}/>*/}
      {/* Header Section */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-xl p-6 shadow-xl mx-auto`}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold">Job Management</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Filter and manage your service jobs efficiently.</p>
          </div>
          <button className={`${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-400'} px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-md`}>
            <IoIosAddCircle className="inline-block mr-2 text-lg" />
            Create Job Card
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {services.map((service, index) => (
          <div
            key={index}
            className={`service-card ${selectedService === service.name ? 'bg-blue-500 border-blue-500' : isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}
              ${isDarkMode ? 'text-white' : (selectedService === service.name ? 'text-white' : 'text-black')} rounded-lg p-4 shadow-md border-2 hover:border-blue-500 transition-all duration-300 flex items-center space-x-3`}
            onClick={() => setSelectedService(service.name)}
          >
            <div className={`${selectedService === service.name ? 'text-gray-300' : isDarkMode ? 'text-blue-500' : 'text-blue-500'} transition-colors duration-300`}>
              {service.icon}
            </div>
            <div>
              <p className="font-medium">{service.name}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray' : 'text-gray'}`}>{service.jobs} Jobs</p>
            </div>
          </div>
        ))}
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
          {statuses.map((status, index) => (
            <div
              key={index}
              className={`
                status-card grid place-items-center
                ${isDarkMode
                  ? (selectedStatus === status.status
                    ? ''
                    : 'bg-gray text-white hover:bg-gray-600 border-gray-500')
                  : 'bg-white text-gray-800 hover:bg-gray-200'}
                p-6 rounded-lg shadow-lg transition-all duration-300 transform
                ${selectedStatus === status.status
                  ? 'border-blue-500'
                  : 'border-gray-300'}
                border-2 hover:border-blue-600 flex items-center space-x-3`}
              onClick={() => setSelectedStatus(status.status)}
            >
              {status.icon}
              <span className="text-sm text-gray-400 mt-2">{status.text} - {status.jobs} jobs</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filtered Jobs List */}

      <h2 className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-6 rounded-lg shadow-lg text-xl font-semibold mb-4 mt-13`}>
        Filtered Jobs List ({filteredJobs.length} Jobs)
      </h2>

      {displayedJobs.length > 0 ? (
        <div className={`job-list space-y-4 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
          {displayedJobs.map(job => (
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
                <span className={`
                  ${job.status === 'Completed' ? ' text-white' :
                    job.status === 'In Process' ? ' text-white' :
                      job.status === 'Pending' ? ' text-white' :
                        job.status === 'Cancelled' ? ' text-white' : ' text-yellow-400'} `}>
                  {job.status === 'Pending' && <PiClockClockwiseFill className="text-[20px] text-blue-500" />}
                  {job.status === 'Todo' && <LuListTodo className="text-[30px] text-blue-500" />}
                  {job.status === 'In Process' && <FaRegClock className="text-[30px] text-orange-400" />}
                  {job.status === 'Ended' && <FaRegFlag className="text-[30px] text-yellow-400" />}
                  {job.status === 'Completed' && <FaCheckCircle className="text-[30px] text-green-400" />}
                  {job.status === 'Cancelled' && <FaTimesCircle className="text-[30px] text-red-400" />}
                </span>
              </div>
            </div>
          ))}
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
