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


    // Data for Pie Chart
    const pieChartData = {
      labels: ["Pass", "Fail"],
      datasets: [
        {
          data: [
            ((stuData.reduce((sum,result)=>(result.totalmarks/totalmarks)*100 >= 33?sum+1:sum,0)/stuData.length)*100), 
            ((stuData.reduce((sum,result)=>(result.totalmarks/totalmarks)*100 < 33?sum+1:sum,0)/stuData.length)*100)
          ], // Example data for pass/fail ratio
          backgroundColor: ["#22C55E", "#EF4444"], // Green and Red colors
        },
      ],
    };
  
    const pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom", // Moves legend to the bottom
        },
      },

    };
  
    return (
        <div className="container">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-600 mb-4">Pass vs Fail</h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    );
  };

  