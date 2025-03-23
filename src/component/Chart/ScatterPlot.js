import React from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ScatterController, // Add the ScatterController
  PointElement, // Add the PointElement
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Register the necessary components for the scatter plot
ChartJS.register(Title, Tooltip, Legend, ScatterController, PointElement, CategoryScale, LinearScale);

const ScatterPlot = ({ stuData } ) => {
  const data = {
    datasets: [
      {
        label: 'Student Performance',
        data: stuData.map(result=>{
          return { x:result.quizcompletiontime.sec,y:result.totalmarks,studentName: result.studentDetail.firstname+" "+result.studentDetail.lastname}
        }),
        backgroundColor: '#10B981',
        borderColor: '#4F46E5',
        borderWidth: 1,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          // Custom tooltip content
          label: (context) => {
            const { x, y } = context.raw; // Access x and y values
            const studentName = context.raw.studentName; // Access custom property
            return `${studentName}: Time - ${x} mins, Marks - ${y}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time Taken (Minutes)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Marks',
        },
      },
    },
  };

  return (
    <div className="container mx-auto mt-5 bg-gray-100">

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">Scatter Plot: Time vs Marks</h2>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default ScatterPlot;
