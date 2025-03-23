import React, { useEffect, useState } from "react";
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

// Register necessary components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const GroupedBarChart = ({ stuData, quizData }) => {
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    const newArr = quizData.questions.map((question, index) => {
      return {
        question: `Q${index + 1}`,
        attempts: stuData.reduce(
          (sum, result) => (result.queandans[index].isattempted ? sum + 1 : sum),
          0
        ),
        correct: stuData.reduce(
          (sum, result) => (result.queandans[index].iscorrect ? sum + 1 : sum),
          0
        ),
      };
    });
    setQuestionData(newArr);
  }, [stuData, quizData]); // Ensure the effect runs only when stuData or quizData changes

  // Prepare data for grouped bar chart
  const chartData = {
    labels: questionData.map((data) => data.question), // Questions (Q1, Q2, Q3, Q4)
    datasets: [
      {
        label: "Attempts",
        data: questionData.map((data) => data.attempts),
        backgroundColor: "#4F46E5", // Blue for attempts
        borderColor: "#4F46E5",
        borderWidth: 1,
        barThickness: 20,
      },
      {
        label: "Correct Answers",
        data: questionData.map((data) => data.correct),
        backgroundColor: "#10B981", // Green for correct answers
        borderColor: "#10B981",
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  // Chart options with optimized animation settings
  const chartOptions = {
    responsive: true,
    animation: {
      duration: 500, // Fast animation duration
      easing: 'easeInOutQuad', // Smooth easing function
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Attempts vs Correct Answers per Question",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Questions",
        },
        stacked: false,
      },
      y: {
        title: {
          display: true,
          text: "Number of Attempts / Correct Answers",
        },
      },
    },
  };

  return (
    <div className="container mx-auto mt-5 bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">
          Grouped Bar Chart: Attempts vs Correct Answers
        </h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GroupedBarChart;
