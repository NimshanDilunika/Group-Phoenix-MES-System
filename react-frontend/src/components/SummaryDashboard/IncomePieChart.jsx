import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Product Sales", value: 400 },
  { name: "Service Revenue", value: 300 },
  { name: "Subscriptions", value: 200 },
  { name: "Other Income", value: 100 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const IncomePieChart = () => {
  return (
    <div className="flex flex-col items-center p-6 shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Daily Income Summary</h2>
      <PieChart width={700} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default IncomePieChart;
