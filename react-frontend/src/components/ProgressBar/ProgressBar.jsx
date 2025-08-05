import React from 'react';
import { FaHourglassStart, FaTools, FaCheckCircle, FaUserCheck, FaAward, FaClipboardList } from 'react-icons/fa'; // Import FaClipboardList

/**
 * Renders a professional-looking progress bar for job statuses.
 * @param {object} props - The component props.
 * @param {string} props.currentStatus - The current status of the job (e.g., "Pending", "Todo", "In Process", "Ended", "Completed").
 * @param {boolean} props.isDarkMode - Indicates if dark mode is active, affecting text and background colors.
 */
const ProgressBar = ({ currentStatus, isDarkMode }) => {
  const statuses = [
    { name: "Pending", icon: FaHourglassStart, progress: 0 },
    { name: "Todo", icon: FaClipboardList, progress: 25 }, // Added FaClipboardList icon and adjusted progress
    { name: "In Process", icon: FaTools, progress: 50 },   // Adjusted progress
    { name: "Ended", icon: FaCheckCircle, progress: 75 },     // Adjusted progress
    { name: "Completed", icon: FaAward, progress: 100 },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.name === currentStatus);
  const currentProgressPercentage = statuses[currentStatusIndex]?.progress || 0;

  return (
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto px-2 sm:px-4">
      <div className="relative flex justify-between items-center w-full mb-3 sm:mb-4">
        {/* The main progress line (track) */}
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 sm:h-2 rounded-full w-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {/* The filled part of the progress line */}
          <div
            className={`h-full rounded-full bg-blue-500 transition-all duration-700 ease-in-out`}
            style={{ width: `${currentProgressPercentage}%` }}
          ></div>
        </div>

        {/* Individual Status Circles and Labels */}
        {statuses.map((status, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;

          // Check if status.icon exists before trying to render it
          const IconComponent = status.icon;

          return (
            <div key={status.name} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition-all duration-500 ease-in-out transform
                  ${isActive ? 'bg-blue-500 scale-105 sm:scale-110 shadow-md sm:shadow-lg' : (isDarkMode ? 'bg-gray-600' : 'bg-gray-400')}
                  ${isCurrent ? 'border-2 sm:border-4 border-blue-300' : ''}`}
                title={status.name}
              >
                {IconComponent && <IconComponent className="text-sm sm:text-base md:text-xl" />} {/* Render the icon only if it exists */}
              </div>
              <p className={`mt-1.5 sm:mt-2 text-center text-[0.6rem] xs:text-xs sm:text-sm font-medium whitespace-nowrap
                ${isActive ? (isDarkMode ? 'text-blue-300' : 'text-blue-700') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')}`}>
                {status.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
