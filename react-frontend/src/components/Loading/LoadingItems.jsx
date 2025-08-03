import React from "react";

const LoadingItems = ({ isDarkMode }) => {
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";

  return (
    <section
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6"
      style={{ minHeight: 150 }}
    >
      <svg
        className="h-16 w-16 text-blue-600 mb-6 animate-spin origin-center"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ transformOrigin: "center" }}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>

      <p
        className={`${textColor} text-lg font-semibold tracking-wide select-none`}
      >
        Loading, please wait…
      </p>
    </section>
  );
};

export default LoadingItems;
