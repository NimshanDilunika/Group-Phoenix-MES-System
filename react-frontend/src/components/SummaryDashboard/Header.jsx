import React from "react";
import { format } from "date-fns";

const Header = () => {
  const currentDate = format(new Date(), "MMMM dd, yyyy");

  return (
    <div className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg gap-x-8">
      {/* Left: Title & Date */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">📊 Financial & Job Summary</h2>
        <p className="text-gray-500">{currentDate}</p>
      </div>
      
      {/* Right: Export Button */}
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition">
        Export Report
      </button>
    </div>
  );
};

export default Header;
