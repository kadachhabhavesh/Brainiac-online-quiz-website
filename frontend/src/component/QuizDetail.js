import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default () => {

    const { quizid } = useParams();
    const [quizData, setQuizData] = useState(null);


    useEffect(() => {
        fetch(`http://localhost:4000/playhistory/quizdetail/${quizid}`, { credentials: 'include' })
            .then(res => res.json())
            .then(res => { setQuizData(res); console.log(res); })
    }, [])
    return quizData && <div className="w-full h-screen p-3">
        <div className="min-w-full min-h-40 bg-white rounded mb-4 p-3 flex gap-x-3">
            <div className="flex gap-x-4">
                <div className="min-w-32 max-w-32 min-h-24 max-h-24 border flex justify-center items-center">
                    <img src={`http://localhost:4000/${quizData.quizinfo.image}`} />
                </div>
                <div className="flex flex-col">
                    <h1 className={`text-sm font-bold ${quizData.quizinfo.difficultylevel === 'hard' ? "text-orange-500" : quizData.quizinfo.difficultylevel === 'medium' ? "text-yellow-500" : "text-green-500"} `}>{quizData.quizinfo.difficultylevel}</h1>
                    <h1 className="font-bold">{quizData.quizinfo.name}</h1>
                    <h1 className="font-semibold text-sm">
                        {quizData.quizinfo.description}
                    </h1>
                    <div className="flex gap-x-10 text-sm mt-1 text-gray-500">
                        <div className="flex flex-col gap-x-4">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.plays} plays</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.grade} grade</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.questions.length} questions</h1>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.subject}</h1>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>{quizData.quizinfo.duration} min</h1>
                            </div>
                            {(quizData.quizinfo.password != 'null' && quizData.quizinfo.password != null) && <div className="flex items-center gap-1.5">
                                <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                <h1>password : {quizData.quizinfo.password}</h1>
                            </div>}
                        </div>
                        <div className="flex flex-col bg-teal-200 h-fit px-3 py-px rounded text-black">
                            <h1>invite code</h1>
                            <h1 className="font-semibold tracking-widest text-2xl">
                                {quizData.quizinfo.code}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="bg-white rounded p-2">
            <h1 className="font-bold py-2">Students</h1>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-100 ">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Ranking
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            marks
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Complete Time
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Attempted Question
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Correct Ans
                        </th>
                        <th scope="col" class="px-6 py-3">
                            accuracy
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {

                        quizData.allResults.map((student, index) => {
                            return <tr class="bg-white border-b hover:bg-gray-50">
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {index + 1}
                                </th>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {student.studentDetail.email}
                                </th>
                                <td class="px-6 py-4">
                                    {student.studentDetail.firstname + " " + student.studentDetail.lastname}
                                </td>
                                <td class="px-6 py-4">
                                    {student.totalmarks}
                                </td>
                                <td class="px-6 py-4">
                                    {`${student.quizcompletiontime.min != 0 ? student.quizcompletiontime.min + "m" : ""} ${student.quizcompletiontime.sec}s`}
                                </td>
                                <td class="px-6 py-4">
                                    {student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0)}
                                </td>
                                <td class="px-6 py-4">
                                    {student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0)}
                                </td>
                                <td class="px-6 py-4">
                                    { ((student.queandans.reduce((total, ques) => ques.iscorrect ? total = total + 1 : total = total + 0, 0)/student.queandans.reduce((total, ques) => ques.isattempted ? total = total + 1 : total = total + 0, 0))*100).toFixed(2)+"%" }
                                </td>
                            </tr>
                        })

                    }

                </tbody>
            </table>
        </div>
    </div>
}