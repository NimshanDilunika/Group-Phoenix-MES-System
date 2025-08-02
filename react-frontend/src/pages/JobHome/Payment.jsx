import React, { useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const PaymentPage = () => {
  const [fullPayment, setFullPayment] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [restPayment, setRestPayment] = useState(0);
  const [payments, setPayments] = useState([]);
  const [currentPayment, setCurrentPayment] = useState("");
  const { isDarkMode } = useContext(ThemeContext);

  const handleInitialSubmit = () => {
    const rest = parseFloat(fullPayment || 0) - parseFloat(advancePayment || 0);
    setRestPayment(rest);
    setPayments(advancePayment ? [parseFloat(advancePayment)] : []);
  };

  const handlePaymentSubmit = async () => {
    const value = parseFloat(currentPayment);
    if (isNaN(value) || value <= 0) return;

    try {
      // Call backend API to add payment here
      // Example:
      // await axios.post(`/api/payments/${jobId}`, { amount: value });

      setPayments([...payments, value]);
      const newRest = restPayment - value;
      setRestPayment(newRest > 0 ? newRest : 0);
      setCurrentPayment("");
    } catch (error) {
      console.error("Failed to submit payment", error);
      // Optionally show error to user
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div
        className={`p-8 rounded-xl shadow-lg w-full max-w-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Payment Form
        </h1>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Full Payment</label>
          <input
            type="number"
            className="w-full p-3 border rounded"
            value={fullPayment}
            onChange={(e) => setFullPayment(e.target.value)}
            placeholder="Enter full payment amount"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Advanced Payment</label>
          <input
            type="number"
            className="w-full p-3 border rounded"
            value={advancePayment}
            onChange={(e) => setAdvancePayment(e.target.value)}
            placeholder="Enter advanced payment amount"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
          onClick={handleInitialSubmit}
        >
          Confirm & Calculate Rest
        </button>

        {fullPayment && (
          <div
            className={`mt-6 p-4 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <p className="font-semibold mb-2">
              Rest of the Payment:{" "}
              <span className="text-red-600">Rs. {restPayment}</span>
            </p>

            {payments.map((amt, index) => (
              <div key={index} className="mb-2 text-sm">
                Payment {index + 1}: Rs. {amt}
              </div>
            ))}

            {restPayment > 0 && (
              <div className="mt-4">
                <label className="block font-semibold mb-1">
                  Payment {payments.length + 1}
                </label>
                <input
                  type="number"
                  value={currentPayment}
                  onChange={(e) => setCurrentPayment(e.target.value)}
                  className="w-full p-3 border rounded mb-2"
                  placeholder="Enter payment amount"
                />
                <button
                  onClick={handlePaymentSubmit}
                  className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
                >
                  Submit Payment
                </button>
              </div>
            )}

            {restPayment <= 0 && (
              <p className="text-green-600 font-bold mt-4">
                ✅ All payments completed.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;