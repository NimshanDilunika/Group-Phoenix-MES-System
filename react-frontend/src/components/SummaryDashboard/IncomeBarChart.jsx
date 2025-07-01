import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", income: 4000 },
  { month: "Feb", income: 4500 },
  { month: "Mar", income: 3800 },
  { month: "Apr", income: 5000 },
  { month: "May", income: 5200 },
  { month: "Jun", income: 4800 },
  { month: "Jul", income: 5300 },
  { month: "Aug", income: 5500 },
  { month: "Sep", income: 4700 },
  { month: "Oct", income: 4900 },
  { month: "Nov", income: 5100 },
  { month: "Dec", income: 6000 },
];

const IncomeBarChart = () => {
  return (
    <div className="flex flex-col items-center  p-6 shadow-lg rounded-2xl w-full max-w-2xl">
      <h2 className="text-xl font-semibold text-center mb-4">Monthly Income Summary</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#4F46E5" radius={[5, 5, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeBarChart;
