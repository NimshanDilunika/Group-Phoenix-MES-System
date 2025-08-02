import React, { useEffect, useRef } from "react";

const ConfirmationModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  isDarkMode,
}) => {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null); // Ref for the confirm button for initial focus

  // Effect to manage focus when the modal opens
  useEffect(() => {
    if (show) {
      // Set initial focus to the confirm button for better UX
      confirmButtonRef.current?.focus();

      // Trap focus within the modal
      const handleKeyDown = (event) => {
        if (event.key === "Tab") {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) { // Shift + Tab
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else { // Tab
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [show]);

  // If the modal is not shown, return null to prevent rendering
  if (!show) return null;

  return (
    // Overlay for the modal, covering the entire screen
    <div
      className="fixed inset-0 bg-blue-200/5 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
      aria-modal="true"
      // Allow clicking outside the modal to cancel, but prevent event propagation from modal content
      onClick={onCancel}
    >
      {/* Modal content container */}
      <div
        ref={modalRef} // Attach ref for focus trapping
        className={`relative p-8 rounded-xl shadow-2xl max-w-sm w-full mx-auto transform transition-all duration-300 ease-out scale-100 ${
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Modal title */}
        <h3
          id="modal-title"
          className={`text-2xl font-extrabold mb-4 text-center ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </h3>

        {/* Modal message */}
        <p
          id="modal-description"
          className={`mb-8 text-center ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onCancel}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg border-2 font-semibold text-lg transition-all duration-200 ease-in-out
              ${isDarkMode
                ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
              }`}
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef} // Attach ref to the confirm button
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-red-600 text-white font-semibold text-lg shadow-md hover:bg-red-700 transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
