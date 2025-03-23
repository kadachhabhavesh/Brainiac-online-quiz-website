import BarChart from "./BarChart";
import PieChart from "./PieChart";
import GroupedBarChart from "./GroupedBarChart";
import StackBarChart from "./StackBarChart";
import ScatterPlot from "./ScatterPlot";
import { useEffect, useState } from "react";

export default ({ quizData }) => {

    const [data,setData] = useState(quizData)

    return <div className="bg-white rounded p-2">
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <div class="bg-white px-4 py-2 rounded-lg shadow flex gap-4 items-center">
            <div className="h-full w-20 bg-gray-400">
                <img src={require("../../assets/icons/student.png")} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-600">Total Students</h2>
                <p class="text-2xl font-bold text-gray-900">{quizData.allResults.length}</p>
            </div>
        </div>
        <div class="bg-white px-4 py-2 rounded-lg shadow flex gap-4 items-center">
            <div className="h-full w-20 bg-gray-400">
                <img src={require("../../assets/icons/Average.png")} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-600">Average Score</h2>
                <p class="text-2xl font-bold text-gray-900">{
                    quizData.allResults.reduce((sum,result)=>sum+result.totalmarks,0)/quizData.allResults.length
                }</p>
            </div>
        </div>
        <div class="bg-white px-4 py-2 rounded-lg shadow flex gap-4 items-center">
            <div className="h-full w-20 bg-gray-400">
                <img src={require("../../assets/icons/Result Sheet.png")} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-600">Pass Rate</h2>
                <p class="text-2xl font-bold text-green-500">{
                    ((quizData.allResults.reduce((sum,result)=>(result.totalmarks/quizData.quizinfo.questions.reduce((totalmarks,question)=>totalmarks+question.marks,0))*100 >= 33?sum+1:sum,0)/quizData.allResults.length)*100).toFixed(2)+`%`    
                }</p>
            </div>
        </div>
        <div class="bg-white px-4 py-2 rounded-lg shadow flex gap-4 items-center">
            <div className="h-full w-20 bg-gray-400">
                <img src={require("../../assets/icons/fail.png")} />
            </div>
            <div>
                <h2 class="text-lg font-semibold text-gray-600">Fail Rate</h2>
                <p class="text-2xl font-bold text-red-500">{
                    ((quizData.allResults.reduce((sum,result)=>(result.totalmarks/quizData.quizinfo.questions.reduce((totalmarks,question)=>totalmarks+question.marks,0))*100 < 33?sum+1:sum,0)/quizData.allResults.length)*100).toFixed(2)+`%`    
                }</p>
            </div>
        </div>
    </div>

    {/* charts */}
    <div className="w-full min-h-96 border-2 bg-gray-100 rounded-lg p-5">
        <div className="flex gap-6">
            <div className="w-2/3" ><BarChart stuData={data.allResults} totalmarks={quizData.quizinfo.questions.reduce((totalmarks,question)=>totalmarks+question.marks,0)}/></div>
            <div className="w-1/3" ><PieChart stuData={data.allResults} totalmarks={quizData.quizinfo.questions.reduce((totalmarks,question)=>totalmarks+question.marks,0)} /></div>
        </div>
        <StackBarChart stuData={data.allResults} />
        <ScatterPlot stuData={data.allResults} />
        <GroupedBarChart stuData={data.allResults} quizData={data.quizinfo}/>
    </div>
</div>
}