import React, { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { motion, AnimatePresence } from "framer-motion";

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const generateCalendarDays = (date) => {
  const startOfMonth = dayjs(date).startOf("month");
  const endOfMonth = dayjs(date).endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const calendarDays = [];
  let day = startDate;

  while (day.isSameOrBefore(endDate, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  return calendarDays;
};

export const Calendar = ({ value, onChange, onClose }) => {
  const [currentDate, setCurrentDate] = useState(dayjs(value || undefined));
  const [days, setDays] = useState([]);
  const calendarRef = useRef(null); // Create a ref for the calendar container

  useEffect(() => {
    setDays(generateCalendarDays(currentDate));
  }, [currentDate]);

  useEffect(() => {
    if (value) setCurrentDate(dayjs(value));
  }, [value]);

  // Effect to handle clicks outside the calendar
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the calendar exists and the click is outside of it
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose?.(); // Call onClose if it's provided
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]); // Re-run effect if onClose changes

  const goToNextMonth = () => setCurrentDate((prev) => prev.add(1, "month"));
  const goToPrevMonth = () => setCurrentDate((prev) => prev.subtract(1, "month"));

  const handleDayClick = (day) => {
    // Only allow selection of current or future dates
    if (day.isBefore(dayjs().startOf("day"))) return;
    onChange(day.format("YYYY-MM-DD"));
    onClose?.();
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div
      ref={calendarRef} // Attach the ref here
      className="p-6 bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-full bg-white text-gray-800 dark:bg-gray-700 dark:text-white shadow hover:scale-110 transition"
        >
          &lt;
        </button>
        <h2 className="text-2xl font-extrabold text-purple-800 dark:text-cyan-300 font-mono">
          {currentDate.format("MMMM YYYY")}
        </h2>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full bg-white text-gray-800 dark:bg-gray-700 dark:text-white shadow hover:scale-110 transition"
        >
          &gt;
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-center text-gray-600 dark:text-gray-400 mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.format("YYYY-MM")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 gap-2"
        >
          {days.map((day) => {
            const isCurrentMonth = day.month() === currentDate.month();
            const isSelected = value && day.isSame(dayjs(value), "day");
            const isToday = day.isToday();
            const isPast = day.isBefore(dayjs().startOf("day"));

            const baseClasses =
              "p-2 w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all";

            let dayClasses = baseClasses;

            if (!isCurrentMonth) {
              dayClasses += " text-gray-300 dark:text-gray-600";
            } else if (isPast) {
              dayClasses += " text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed";
            } else if (isSelected) {
              dayClasses +=
               " text-white bg-blue-700 shadow-lg hover:scale-105 transition-all dark:bg-indigo-600 dark:hover:bg-indigo-700";
            } else if (isToday) {
              dayClasses +=
                " border-2 border-pink-500 text-pink-700 dark:border-fuchsia-400 dark:text-fuchsia-300 dark:bg-gradient-to-br dark:from-gray-900 dark:to-fuchsia-950 hover:scale-105";
            } else {
              dayClasses +=
                " bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-purple-100 dark:hover:bg-indigo-900 hover:text-purple-600 dark:hover:text-indigo-400 hover:scale-105 cursor-pointer shadow-sm";
            }

            return (
              <div
                key={day.toString()}
                className={dayClasses}
                onClick={() => !isPast && isCurrentMonth && handleDayClick(day)}
              >
                {day.date()}
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};