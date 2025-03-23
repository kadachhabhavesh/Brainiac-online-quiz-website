import React, { useState } from "react";
import { Chart as ChartJS, Tooltip, Legend, Title, LinearScale, CategoryScale, Heatmap } from "chart.js";
import { Scatter } from "react-chartjs-2"; // Using scatter plot for heatmap simulation

// Register necessary chart.js modules
ChartJS.register(Tooltip, Legend, Title, LinearScale, CategoryScale);

export default () => {

  
  const data = [
    [0, 0, 3], [0, 1, 5], [0, 2, 1], [0, 3, 4],
    [1, 0, 2], [1, 1, 3], [1, 2, 0], [1, 3, 6],
    [2, 0, 5], [2, 1, 2], [2, 2, 4], [2, 3, 3],
    [3, 0, 0], [3, 1, 4], [3, 2, 2], [3, 3, 1]
  ];

  // Heatmap Data for Quiz Questions
  const heatmapData = {
    datasets: [
      {
        label: "Frequency of Correct Answers",
        data: data, // Data in the form [x, y, value]
        backgroundColor: (context) => {
          const value = context.raw[2];
          const alpha = value > 5 ? 1 : 0.4;
          const color = `rgba(255, 99, 132, ${alpha})`;
          return color; // Color intensity based on value
        },
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const heatmapOptions = {
    responsive: true,
    scales: {
      x: {
        type: "category",
        labels: ["Q1", "Q2", "Q3", "Q4"], // Quiz questions
      },
      y: {
        type: "category",
        labels: ["Student 1", "Student 2", "Student 3", "Student 4"], // Students
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="container mx-auto mt-5 bg-gray-100">

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">Student Performance on Quiz Questions</h2>
        <Scatter data={heatmapData} options={heatmapOptions} />
      </div>
    </div>
  );
};
