import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default ({ stuData }) => {
  // Sample data representing quiz performance
  const data = {
    labels: stuData.map((result)=>result.studentDetail.firstname+" "+result.studentDetail.lastname), // Students
    datasets: [
      {
        label: "Correct Answers",
        data: stuData.map((result)=>result.queandans.reduce((acc,question)=>(question.isattempted && question.iscorrect),0)), // Correct answers count per student
        backgroundColor: "#10B981", // Green color
        stack: "stack1", // Stack grouping
      },
      {
        label: "Attempted",
        data: stuData.map((result)=>result.queandans.reduce((acc,question)=>(question.isattempted),0)), // Total attempted questions per student
        backgroundColor: "#4F46E5", // Indigo color
        stack: "stack1", // Stack grouping
      },
      {
        label: "Skipped",
        data: stuData.map((result)=>result.queandans.reduce((acc,question)=>(!question.isattempted),0)), // Skipped questions per student
        backgroundColor: "#EF4444", // Red color
        stack: "stack1", // Stack grouping
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Students",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Questions",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto mt-5 bg-gray-100">

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">Questions Attempted, Skipped, and Correctly Answered</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
