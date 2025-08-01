import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
//console.log("Jobs Data in JobStatusPieChart:", jobs);


const JobStatusPieChart = ({ jobs }) => {
  if (!Array.isArray(jobs)) {
    console.error("Expected jobs to be an array but received", jobs);
    return null;
  }
  // Count occurrences of each job status
  const statusCounts = jobs.reduce((acc, job) => {
    const status = job.status?.trim();
    if(status){
      acc[job.status] = (acc[job.status] || 0) + 1;
    }
    return acc;
  }, {});

  // Convert statusCounts to array format for recharts
  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Define colors for the chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666"];

  return (
    <div className="flex flex-col items-center p-6 shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Job Status Summary</h2>
      <PieChart width={600} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
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

export default JobStatusPieChart;
