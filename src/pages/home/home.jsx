import React, { useState } from "react";
import { FiFilter, FiWind } from "react-icons/fi";
import { FaRegClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { BsBatteryCharging, BsBrightnessHigh } from "react-icons/bs";
import { FaRegFlag } from "react-icons/fa6";
import { LuListTodo } from "react-icons/lu";
import { IoIosAddCircle } from "react-icons/io";
import { PiClockClockwiseFill } from "react-icons/pi";

const Home = () => {
  const services = [
    { icon: <BsBatteryCharging className="text-blue-500 text-2xl" />, name: "Generator Services", jobs: 8 },
    { icon: <BsBrightnessHigh className="text-blue-500 text-2xl" />, name: "Solar Systems", jobs: 8 },
    { icon: <FiWind className="text-blue-500 text-2xl" />, name: "Air Conditioning", jobs: 8 }
  ];

  const statuses = [
    { icon: <PiClockClockwiseFill className="text-[30px] text-blue-500" />, text: "Pending - 3 Jobs", status: "Pending" },
    { icon: <LuListTodo className="text-[30px] text-blue-500" />, text: "Todo - 3 Jobs", status: "Todo" },
    { icon: <FaRegClock className="text-[30px] text-orange-400" />, text: "In Process - 3 Jobs", status: "In Process" },
    { icon: <FaRegFlag className="text-[30px] text-yellow-400" />, text: "Ended - 3 Jobs", status: "Ended" },
    { icon: <FaCheckCircle className="text-[30px] text-green-400" />, text: "Completed - 3 Jobs", status: "Completed" },
    { icon: <FaTimesCircle className="text-[30px] text-red-400" />, text: "Cancelled - 3 Jobs", status: "Cancelled" }
  ];

  // Sample Job Data
  const jobs = [
    { id: 1, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "In Process", service: "Generator Services" },
    { id: 31, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Todo", service: "Generator Services" },
    { id: 32, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Ended", service: "Generator Services" },
    { id: 33, title: "Generator Installation", company: "ABC Company", date: "05 March 2024", status: "Completed", service: "Generator Services" },
    { id: 2, title: "Solar Panel Setup", company: "XYZ Corp", date: "10 March 2024", status: "Completed", service: "Solar Systems" },
    { id: 3, title: "AC Maintenance", company: "HomeCare", date: "15 March 2024", status: "Todo", service: "Air Conditioning" },
    { id: 4, title: "Generator Repair", company: "ABC Company", date: "20 March 2024", status: "Pending", service: "Generator Services" },
    { id: 5, title: "Solar Installation", company: "SolarTech", date: "25 March 2024", status: "Cancelled", service: "Solar Systems" },
    { id: 6, title: "AC Installation", company: "HomeCare", date: "30 March 2024", status: "In Process", service: "Air Conditioning", description: "Initial job registration" },
    { id: 7, title: "HVAC System Setup", company: "ThermoTech", date: "01 April 2024", status: "In Process", service: "HVAC" },
    { id: 8, title: "Solar Battery Backup", company: "Renew Power", date: "12 April 2024", status: "Pending", service: "Solar Systems" },
    { id: 9, title: "Pool Heater Installation", company: "Aqua Solutions", date: "18 April 2024", status: "Completed", service: "Pool Services" },
    { id: 10, title: "Wind Turbine Setup", company: "EcoPower", date: "23 April 2024", status: "In Process", service: "Wind Energy" },
    { id: 11, title: "Roof Insulation", company: "HomeCare", date: "28 April 2024", status: "Todo", service: "Home Improvement" },
    { id: 12, title: "Generator Maintenance", company: "ABC Company", date: "05 May 2024", status: "Cancelled", service: "Generator Services" },
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
    { id: 30, title: "Solar Water Pump Installation", company: "SolarTech", date: "24 August 2024", status: "Completed", service: "Solar Systems" }
  ];
  

  // State for selected filters
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Filter jobs based on selected service and status
  const filteredJobs = jobs.filter(job => {
    const matchesService = selectedService ? job.service === selectedService : true;
    const matchesStatus = selectedStatus ? job.status === selectedStatus : true;
    return matchesService && matchesStatus;
  });

  return (
    <div className="bg-gray-800 space-y-8 p-6 min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-900 rounded-xl p-6 shadow-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Job Management</h1>
            <p className="text-gray-400 text-lg">Filter and manage your service jobs efficiently.</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-500 transition-all duration-300 shadow-md">
            <IoIosAddCircle className="inline-block mr-2 text-lg" />
            Create Job Card
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer">
        {services.map((service, index) => (
          <div key={index} className="service-card bg-gray-800 text-white rounded-lg p-4 shadow-md border-2 border-gray-700 hover:border-blue-500 transition-all duration-300 flex items-center space-x-3" onClick={() => setSelectedService(service.name)}>
            {service.icon}
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-gray-400">{service.jobs} Jobs</p>
            </div>
          </div>
        ))}
      </div>

      <div className="status-filter bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <FiFilter className="text-blue-500" /> Filter by Status
      </h2>

      {/* Clear Filters Button aligned to the right */}
      <div className="flex justify-between items-center text-gray-200">
        <span></span> {/* Empty span to keep space */}
        <button
          className="bg-transparent text-blue-500 hover:text-white hover:bg-blue-600 border border-blue-500 hover:border-transparent text-sm font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300"
          onClick={() => {
          setSelectedStatus(null);
          setSelectedService(null);
        }}
        >
        Clear Filters
      </button>

  </div>

  <div className="status-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
    {statuses.map((status, index) => (
      <div
        key={index}
        className="status-card grid place-items-center bg-gray-700 text-white p-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 hover:scale-105 transform"
        onClick={() => setSelectedStatus(status.status)}
      >
        {status.icon}
        <span className="text-gray-400 mt-2">{status.text}</span>
      </div>
    ))}
  </div>
</div>



      {/* Filtered Jobs List Section */}
      <h2 className="text-xl font-semibold text-white mb-4 mt-13">Filtered Jobs List</h2>
      {filteredJobs.length > 0 ? (
        <div className="job-list space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="job-card bg-gray-700 text-white p-5 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-700 transition-all duration-300 cursor-pointer group">
              {/* Left Section - Job Details */}
              <div className="flex flex-col">
                <p className="text-lg font-semibold">{job.title}</p>
                <span className="text-sm text-gray-400">{job.company}</span>
              </div>

              {/* Right Section - Date & Job Status */}
              <div className="flex flex-wrap items-center gap-6">
                <span className="text-gray-400 whitespace-nowrap">📅 {job.date}</span>
                <span className={` 
                  ${job.status === 'Completed' ? ' text-white' : 
                  job.status === 'In Process' ? ' text-white' :
                  job.status === 'Pending' ? ' text-white' :
                  job.status === 'Cancelled' ? ' text-white' : ' text-yellow-400'} `}>
                  
                  {job.status === 'Pending' && <PiClockClockwiseFill className="text-[20px] text-blue-500" />}
                  {job.status === 'Todo' && <LuListTodo className="text-[20px] text-blue-500" />}
                  {job.status === 'In Process' && <FaRegClock className="text-[20px] text-orange-400" />}
                  {job.status === 'Ended' && <FaRegFlag className="text-[20px] text-yellow-400" />}
                  {job.status === 'Completed' && <FaCheckCircle className="text-[20px] text-green-400" />}
                  {job.status === 'Cancelled' && <FaTimesCircle className="text-[20px] text-red-400" />}
                  
                </span>


              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No jobs found for the selected filters.</p>
      )}
    </div>
  );
};

export default Home;