import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";

// Register necessary chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const QuizAnalytics = () => {
  // Bar Chart Data
  const barChartData = {
    labels: ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
    datasets: [
      {
        label: "Number of Students",
        data: [2, 4, 5, 7, 8, 10, 7, 5, 2, 0],
        backgroundColor: "#4F46E5", // Tailwind indigo-600
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [88, 12],
        backgroundColor: ["#22C55E", "#EF4444"], // Tailwind green-500 and red-500
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Quiz Analytics</h1>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600">Total Students</h2>
            <p className="text-2xl font-bold text-gray-900">50</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600">Average Score</h2>
            <p className="text-2xl font-bold text-gray-900">72%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600">Pass Rate</h2>
            <p className="text-2xl font-bold text-green-500">88%</p>
          </div>
        </div>

        {/* Graph Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Scores Distribution</h2>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Pass vs Fail</h2>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
