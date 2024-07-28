import { queries } from "@testing-library/react"
import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"

export default () => {
    const Navigate = useNavigate()
    const { playhistoryid } = useParams()
    const [rankQueTab, setRankQueTab] = useState(true) //true = ranking page,false = answer page
    const [data, setData] = useState()
    const [searchName, setsearchName] = useState()
    let correctQues = 0, incorrectQues = 0, totalQues = 0, attemptedQues = 0, totalMarks = 0, totalTime = 0
    useEffect(() => {
        fetch(`http://localhost:4000/playhistory/result/${playhistoryid}`, { credentials: 'include' }).then((res) => {
            if (res.status === 401) {
                Navigate('/')
            }
            return res.json();
        }).then((res) => {setData(res); console.log(res,18);})
    }, [])

    if (data) {
        // let filterTableData = data.allstudents.filter((student) => `${student.student.firstname} ${student.student.lastname}`.toLowerCase().includes(searchName.toLowerCase()));


        correctQues = 0
        data.currentstudentplayhistory.queandans.forEach(ques => {
            if (ques.iscorrect) {
                correctQues += 1
                totalMarks += ques.marks
            }
            if (ques.isattempted)
                attemptedQues += 1
        });
        totalTime = (data.currentstudentplayhistory.quizcompletiontime.min * 60) + data.currentstudentplayhistory.quizcompletiontime.sec
        totalQues = data.currentstudentplayhistory.queandans.length
        incorrectQues = totalQues - correctQues
    }

    return data && <div className="w-full p-5">

        <div className="w-full h-72 bg-white rounded shadow-md p-5">
            <div>
                <div className="flex mb-3 gap-3">
                    <div className="w-1 h-8 bg-teal-900 rounded-full"></div>
                    <h1 className="font-extrabold text-2xl"> {`${data.currentstudent.firstname} ${data.currentstudent.lastname}`}</h1>
                </div>
                <div className="_Performance_Stats flex gap-4 flex-wrap" >
                    <div className="w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col hover:border-3 hover:shadow-md hover:rotate-[-5deg] hover:scale-105">
                        <h1 className="font-bold text-2xl">{totalQues <= 9 && totalQues > 0 ? `0${totalQues}` : totalQues}</h1>
                        <h1>Total Ques</h1>
                    </div>
                    <div className="w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col hover:border-3 hover:shadow-md hover:rotate-[-5deg] hover:scale-105">
                        <h1 className="font-bold text-2xl">{correctQues <= 9 && correctQues > 0 ? `0${correctQues}` : correctQues}</h1>
                        <h1>Correct Ques</h1>
                    </div>
                    <div className="w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col hover:border-3 hover:shadow-md hover:rotate-[-5deg] hover:scale-105">
                        <h1 className="font-bold text-2xl">{incorrectQues <= 9 && incorrectQues >= 0 ? `0${incorrectQues}` : incorrectQues}</h1>
                        <h1>Incorrect Ques</h1>
                    </div>
                    <div className=" w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col">
                        <h1 className="font-bold text-2xl">{attemptedQues <= 9 && attemptedQues >= 0 ? `0${attemptedQues}` : attemptedQues}</h1>
                        <h1 className="text-center">Attempted Ques</h1>
                    </div>
                    <div className="w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col hover:border-3 hover:shadow-md hover:rotate-[-5deg] hover:scale-105">
                        <h1 className="font-bold text-2xl">{(totalTime / attemptedQues).toFixed(2)} s</h1>
                        <h1>Time/ques</h1>
                    </div>
                    <div className="w-36 h-20 rounded-lg border-2 flex items-center justify-center flex-col hover:border-3 hover:shadow-md hover:rotate-[-5deg] hover:scale-105">
                        <h1 className="text-3xl font-bold">{totalMarks <= 9 && totalMarks >= 0 ? `0${totalMarks}` : totalMarks}</h1>
                        <h1>Total marks</h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <h1>Accuracy</h1>
                <div className="relative w-2/3 h-6 rounded-full bg-gray-200">
                    <div
                        className="absolute top-0 left-0 h-full bg-teal-500 rounded flex items-center justify-center text-sm font-bold text-white"
                        style={{ width: `${(correctQues / totalQues) * 100}%` }}
                    >{`${((correctQues / totalQues) * 100).toFixed(2)}%`}</div>
                    <div
                        className="absolute top-0 right-0 h-full bg-red-500 rounded flex items-center justify-center text-sm font-bold text-white"
                        style={{ width: `${((incorrectQues / totalQues) * 100)}%` }}
                    >{ ((incorrectQues / totalQues) * 100).toFixed(2)}%</div>

                </div>
            </div>
            <div className="min-w-full flex justify-end mt-3 gap-x-4">
                <button className="bg-teal-700 px-4 py-1.5 text-white rounded-md hover:bg-teal-600" onClick={()=>Navigate('/home')}>Back To Home</button>
                <button className="bg-teal-700 px-4 py-1.5 text-white rounded-md hover:bg-teal-600" onClick={()=>Navigate(`/home/playquiz/${data.quiz._id}`)}>Try Again</button>
            </div>
        </div>


        {/* table and question */}
        <div className="mt-5 bg-white rounded">
            {/* tabs */}
            <div className="flex gap-x-3 p-3">
                <h1 className={`px-5 py-1.5 rounded-full cursor-pointer   ${rankQueTab && "bg-teal-100 font-bold"}`} onClick={() => setRankQueTab(true)}>Ranking</h1>
                <h1 className={`px-5 py-1.5 rounded-full cursor-pointer   ${!rankQueTab && "bg-teal-100 font-bold"}`} onClick={() => setRankQueTab(false)}>Quiz Answers</h1>
            </div>

            {/* student list who attend same quiz */}
            {rankQueTab && <div class="overflow-x-auto px-4">
                {/* user serach bar */}
                {/* <div className="_search_bar flex flex-row  gap-x-2 h-14 items-center w-1/3">
                    <input
                        type="text"
                        class="h-9 bg-gray-100 w-full pr-8 pl-5 border  outline-none rounded my-4 focus:outline-none"
                        placeholder="Search student name"
                        onChange={(e) => setsearchName(e.target.value)}
                    />
                    <button className="bg-teal-700 text-white h-9 w-64 rounded-md hover:shadow-md hover:bg-teal-700 hover:font-semibold">
                        Search student
                    </button>
                </div> */}
                {/* table */}
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
                        </tr>
                    </thead>
                    <tbody>

                        {
                            data.allstudents && data.allstudents.map((stu, index) => {
                                return <tr class="bg-white border-b hover:bg-gray-50">
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {index + 1}
                                    </th>
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {stu.student.email}
                                    </th>
                                    <td class="px-6 py-4">
                                        {`${stu.student.firstname} ${stu.student.lastname}`}
                                    </td>
                                    <td class="px-6 py-4">
                                        {stu.totalmarks}
                                    </td>
                                    <td class="px-6 py-4">
                                        {`${stu.quizcompletiontime.min}m ${stu.quizcompletiontime.sec}s`}
                                    </td>
                                    <td class="px-6 py-4">
                                        {stu.queandans.reduce((count, que) => {
                                            if (que.isattempted)
                                                return count + 1;
                                            else
                                                return count;
                                        }, 0)}
                                    </td>
                                    <td class="px-6 py-4">
                                        {stu.queandans.reduce((count, que) => {
                                            if (que.iscorrect)
                                                return count + 1;
                                            else
                                                return count;
                                        }, 0)}
                                    </td>
                                </tr>
                            })
                        }


                    </tbody>
                </table>
            </div>}

            {/* your quiz answer and correct answer */}
            {!rankQueTab && <div className="w-full p-5">
                <div className="flex flex-col gap-y-10">
                    <div className="flex gap-x-4">
                        <div className="flex items-center gap-x-1">
                            <div className="w-4 h-4 rounded-full border bg-green-700"></div>
                            <h1 className="font-medium">Correct Answers</h1>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <div className="w-4 h-4 rounded-full border bg-red-500"></div>
                            <h1 className="font-medium">Incorrect Answers</h1>
                        </div>
                    </div>
                    {
                        data.currentstudentplayhistory.queandans.map((ques, qIndex) => {
                            return <div className="flex justify-between items-start">
                                <div className={`w-[5px] self-stretch rounded-full ${ques.iscorrect ? "bg-green-700" : "bg-red-500"}`}></div>
                                <div className="font-bold w-full p-3">
                                    <div className="flex justify-between items-start">
                                        <h1>{`${qIndex + 1}. ${data.quiz.questions[qIndex].question}`}</h1>
                                        <h1 className="min-w-fit text-sm border border-gray-300 py-0.5 px-1 rounded ">
                                            {`${data.quiz.questions[qIndex].marks} marks`}
                                        </h1>
                                    </div>
                                    {data.quiz.questions[qIndex].image && <div className="max-h-40 min-h-20 w-60 border-2 my-2">
                                        <img className="max-h-full max-w-full rounded-md" src={`http://localhost:4000/${data.quiz.questions[qIndex].image}`} />
                                    </div>}
                                    {
                                        data.quiz.questions[qIndex].options.map(option => {
                                            return <div className="px-2 py-1 text-sm flex items-center gap-x-2">
                                                <div className={`w-4 h-4 rounded-full border border-gray-400 
                                                    ${(ques.isattempted && !ques.iscorrect && ques.optionid === option._id) && "bg-red-500 border-none"}
                                                    ${option.isTrue && "bg-green-700 border-none"}`}></div>
                                                {option.option}
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>}

        </div>
    </div>
}