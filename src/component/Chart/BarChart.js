import { useEffect, useState } from 'react'

import { Bar, Pie } from "react-chartjs-2"; // Import chart components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default ({ stuData,totalmarks }) => {

  const [studentData,setStudentData] = useState(stuData)
  // for storing student makes in Percentage
  const [studentPercentage,setStudentPercentage] = useState([])
  useEffect(()=>{
    const stuPercentage = stuData.map((stuResult)=>{
      return (stuResult.totalmarks/totalmarks)*100
    })
    setStudentPercentage(stuPercentage)
  },[])

    // Data for Bar Chart
    const barChartData = studentPercentage && {
      labels: ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"],
      datasets: [
        {
          label: "Number of Students",
          data: studentPercentage.reduce((acc, num) => {
            const index = Math.min(Math.floor(num / 10), 9); // Ensure numbers 100 go to index 9
            acc[index] += 1; // Increment the count for the corresponding range
            return acc;
          }, new Array(10).fill(0)),
          backgroundColor: "#4F46E5", // Indigo color
        },
      ],
    };
  
    const barChartOptions = {
      responsive: true,
      plugins: {
        legend: { display: false }, // Hides the legend
      },
    };
  
    return (
      <div className="container mx-auto">
  
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Scores Distribution</h2>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        
      </div>
    );
  };

  