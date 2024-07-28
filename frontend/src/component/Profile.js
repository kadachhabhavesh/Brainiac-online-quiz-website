import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import PlayList from "./PlayList";
// import CanvasJSReact from '@canvasjs/charts';

// const CanvasJSChart = CanvasJSReact.CanvasJSChart;


export default () => {
    const { userid } = useParams()
    const navigate = useNavigate()
    const [student, setStudent] = useState()
    const [tab, setTab] = useState(0)
    const [currentQuiz, setCurrentQuiz] = useState(0)
    const [confirmQuizDeleteDialog, setConfirmQuizDeleteDialog] = useState({type:"",show:false})
    const [deleteQuizId, setDeleteQuizId] = useState(-1)
    let totalTime = 0, totalCorrectMarks = 0, totalMarks = 0, loaddata;

    const [currentPlayList, setCurrentPlayList] = useState(0)
    const [pldelId, setPldelId] = useState(-1)
    const [subjects, setSubjects] = useState([])
    const [createPlayListDialogShow, setcreatePlayListDialogShow] = useState(false)
    const [editPlayList, setEditPlayList] = useState({})
    const [quizziz, setQuizziz] = useState([])
    const [playListDetails, setPlayListDetails] = useState({
        name: null,
        subject: null,
        image: null,
        quizziz: []
    })
    const [editPlId, setEditPlId] = useState(-1)
    const [errorMsg, setErrorMsg] = useState({ msg: null, iserr: true })

    const deleteQuiz = () => {
        console.log(deleteQuizId,35);
        deleteQuizId !== -1 && fetch(`http://localhost:4000/quiz/${deleteQuizId}`, { method: 'DELETE', credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                setConfirmQuizDeleteDialog({type:"",show:false})
                loadProfileData()
                setDeleteQuizId(null)
            })
            .catch((res) => console.log(res));
    }

    const loadProfileData = () => {
        fetch(`http://localhost:4000/user/profile/${userid}`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                return res.json()
            })
            .then((res) => {
                setStudent(res);
                console.log(res);
            })
            .catch((res) => console.log(res));
    }

    const deletePlayList = (delId) => {
        console.log("delete" + pldelId);
        fetch(`http://localhost:4000/playList/${pldelId}`, { method: "DELETE", credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                loadProfileData()
                setConfirmQuizDeleteDialog({type:"",show:false})
                setCurrentPlayList(0)
            })
            .catch((res) => console.log(res));
    }
    
    const createEditPlayList = () => {
        console.log(playListDetails, 53);
        // validate
        if (!playListDetails.name || !playListDetails.subject || !playListDetails.image) {
            setErrorMsg({ msg: "Fill playList detail", iserr: true })
            setTimeout(() => {
                setErrorMsg({ msg: null, iserr: true })
            }, 3000)
        }
        else if (playListDetails.quizziz.length <= 0) {
            setErrorMsg({ msg: "select at least one quiz", iserr: true })
            setTimeout(() => {
                setErrorMsg({ msg: null, iserr: true })
            }, 3000)
        } else {
            const fromData = new FormData()
            fromData.append("name", playListDetails.name)
            fromData.append("subject", playListDetails.subject)
            fromData.append("image", playListDetails.image)
            for (let quizIndex in playListDetails.quizziz) {
                fromData.append(quizIndex, playListDetails.quizziz[quizIndex])
            }
            fetch(editPlId === -1 ? `http://localhost:4000/playList` : `http://localhost:4000/playlist/${editPlId}`, { method: editPlId === -1 ? "POST" : "PUT", credentials: "include", body: fromData })
                .then((res) => {
                    if (res.status === 401)
                        navigate("/")
                    loadProfileData()
                    setcreatePlayListDialogShow(false)
                    setEditPlId(-1)
                    setPlayListDetails({
                        name: null,
                        subject: null,
                        image: null,
                        quizziz: []
                    })
                    return res.json()

                })
                .then((res) => {
                    console.log(res);
                })
                .catch((res) => console.log(res));
        }
    }

    const handleImageChange = (e) => {
        setPlayListDetails({ ...playListDetails, image: e.target.files[0] });
        console.log(playListDetails, 14)
    }

    const handleNameAndSubjectChange = (e) => {
        setPlayListDetails({ ...playListDetails, [e.target.name]: e.target.value })
    }

    const handleQuizSelection = (e) => {
        const newPlayListDetails = { ...playListDetails };
        if (e.target.checked) {
            newPlayListDetails.quizziz = [...playListDetails.quizziz, e.target.value];
        } else {
            newPlayListDetails.quizziz = playListDetails.quizziz.filter(quiz => quiz !== e.target.value);
        }
        setPlayListDetails(newPlayListDetails);
    }

    // get quizziz used to create playList
    const getQuizCreatedByTeacherAndSubjects = () => {
        fetch(`http://localhost:4000/quiz/teacherquiz`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                return res.json()
            })
            .then((res) => {
                setQuizziz(res);
            })
            .catch((res) => console.log(res));

        // get all subjects
        fetch(`http://localhost:4000/subject`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                return res.json()
            })
            .then((res) => {
                setSubjects(res);
            })
            .catch((res) => console.log(res));
    }

    const getSpecificPlForEdit = (plId) => {
        //get playlist by id for update
        fetch(`http://localhost:4000/playList/${plId}`, { credentials: "include" })
            .then((res) => {
                if (res.status === 401)
                    navigate("/")
                return res.json()
            })
            .then((res) => {
                setPlayListDetails(res);
            })
            .catch((res) => console.log(res));
    }

    useEffect(() => {
        loadProfileData()
    }, []);

    if (student) {
        for (let result of student.results) {
            totalTime += result.quizcompletiontime.min * 60 + result.quizcompletiontime.sec
            totalCorrectMarks += result.totalmarks
            result.quizinfo.questions.forEach(que => {
                totalMarks += que.marks
            });
        }

    }


    return student && <div className="w-full p-4 flex flex-col gap-y-2" >


        {/* error msg */}
        {errorMsg.msg && (
            <div className="z-20 absolute top-4 left-1/2 transform-translate-x-1/2">
                <div
                    className={`py-1.5 px-6 border rounded flex gap-x-4 font-black  items-center ${errorMsg.iserr
                        ? " border-red-400 text-red-400 bg-red-200"
                        : " border-green-400 text-green-400 bg-green-200"
                        } `}
                >
                    <h1>{errorMsg.msg}</h1>
                    <svg
                        onClick={() => setErrorMsg({ ...errorMsg, ["msg"]: null })}
                        className="h-4 cursor-pointer"
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <line
                            className={`stroke-current ${errorMsg.iserr ? "text-red-700" : "text-green-700"}`}
                            x1="10"
                            y1="10"
                            x2="90"
                            y2="90"
                            stroke="black"
                            stroke-width="10"
                            stroke-linecap="round"
                        />
                        <line
                            className={`stroke-current ${errorMsg.iserr ? "text-red-700" : "text-green-700"}`}
                            x1="10"
                            y1="90"
                            x2="90"
                            y2="10"
                            stroke="black"
                            stroke-width="10"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
            </div>
        )}


        <div className="bg-white w-full min-h-48 rounded p-4">
            <div className="flex gap-x-4">
                <div className="h-14 w-14 bg-teal-500 rounded-full flex justify-center items-center font-demibold text-white text-2xl" >KB</div>
                <div className="flex flex-col gap">
                    {/* student */}
                    {student.userinfo.usertype === "student" && (
                        <h1 className="text-xs leading-3 bg-teal-950 w-min px-2 pt-[1px] pb-[2px] rounded-full text-white">
                            student
                        </h1>
                    )}
                    {/* teacher */}
                    {student.userinfo.usertype === "teacher" && (
                        <h1 className="text-xs leading-3 bg-orange-500 w-min px-2 pt-[1px] pb-[2px] rounded-full text-white">
                            teacher
                        </h1>
                    )}
                    <h1 className="font-bold text-lg">{`${student.userinfo.firstname} ${student.userinfo.lastname}`}</h1>
                    <h1 className="font-medium text-sm">{student.userinfo.email}</h1>
                </div>

            </div>
            {totalMarks > 0 && <div className="flex justify-between items-baseline">
                {student.userinfo.usertype === "student" && <><div className="flex flex-col gap-2 mt-4 w-2/3">
                    <h1>Accuracy</h1>
                    <div className="relative w-full h-6 rounded-full bg-gray-200">
                        <div
                            className="h-full bg-teal-500 rounded-l-lg flex items-center justify-center text-sm font-bold text-white"
                            style={{ width: `${(totalCorrectMarks / totalMarks) * 100}%` }}
                        >{`${((totalCorrectMarks / totalMarks) * 100).toFixed(2)}%`}</div>
                        <div
                            className="absolute top-0 right-0 h-full bg-red-500 rounded-r-lg"
                            style={{ width: `${(100 - (totalCorrectMarks / totalMarks) * 100)}%` }}
                        ></div>

                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="w-24 h-20 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-semibold">{student.results.length}</h1>
                        <h1>Quizzes</h1>
                    </div>
                    <div className="w-24 h-20 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-semibold">{totalCorrectMarks + "/" + totalMarks}</h1>
                        <h1>Marks</h1>
                    </div>
                    <div className="w-24 h-20 flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-semibold">{`${(totalTime / 60).toFixed(0)}m ${(totalTime % 60)}s`}</h1>
                        <h1>Time</h1>
                    </div>
                </div></>}

                {student.userinfo.usertype === "teacher" && <div className="my-3 flex gap-x-4">
                    <div className="flex flex-col justify-center items-center border-2 rounded-lg py-1 px-5 hover:shadow-lg hover:border-none hover:-rotate-6">
                        <h1 className="text-2xl font-bold">{student && student.createdquiz.length}</h1>
                        <h1 className="text-sm" >Total Quiz</h1>
                    </div>
                    <div className="flex flex-col justify-center items-center border-2 rounded-lg py-1 px-5 hover:shadow-lg hover:border-none hover:-rotate-6">
                        <h1 className="text-2xl font-bold">{ student && student.userinfo.totalplays }</h1>
                        <h1 className="text-sm" >Total Plays</h1>
                    </div>
                </div>}

                {/* <Chart />    */}
            </div>}


        </div>

        {/* tabs */}
        <div className="flex gap-x-3 p-3 bg-white rounded">
            <h1 className={`px-5 py-1.5 rounded-full cursor-pointer   ${tab === 0 && "bg-teal-100 font-bold"}`} onClick={() => setTab(0)}>All Results</h1>
            {student.userinfo.usertype === "teacher" && <h1 className={`px-5 py-1.5 rounded-full cursor-pointer   ${tab === 1 && "bg-teal-100 font-bold"}`} onClick={() => setTab(1)}>Created Quiz</h1>}
            {student.userinfo.usertype === "teacher" && <h1 className={`px-5 py-1.5 rounded-full cursor-pointer   ${tab === 2 && "bg-teal-100 font-bold"}`} onClick={() => setTab(2)}>Created playList</h1>}
        </div>

        {/* tab views */}
        {<div className="w-full rounded min-h-[580px]">
            {student.results.length <= 0 && tab === 0 && <h1 className="text-center p-4 font-bold text-gray-600">No Results Found</h1>}
            {student.results.length > 0 && tab === 0 && <div className="flex h-[calc(100vh-150px)] gap-x-2">
                {/* result list */}
                <div className="w-4/12 h-full rounded flex flex-col gap-y-2" >
                    <h1 className="bg-white h-[7%] font-semibold rounded flex items-center px-4">7 Results</h1>
                    <div className="w-full max-h-[93%] flex flex-col gap-y-2 overflow-y-scroll no-scrollbar ">
                        {
                            student.results.map((result, index) => <div className="w-full h-24 bg-white rounded p-2 flex gap-x-2 hover:bg-gray-100 hover:border" onClick={() => setCurrentQuiz(index)}>
                                <div className="h-full min-w-20 max-w-20 flex items-center">
                                    <img className="max-h-full max-w-full rounded-md" src={`http://localhost:4000/${result.quizinfo.image}`} />
                                </div>
                                <div>

                                    <span class={`inline-flex items-center rounded-md px-1 py-px text-xs font-bold ${result.quizinfo.difficultylevel === "easy" ? "bg-green-300 text-green-600" : result.quizinfo.difficultylevel === "medium" ? "bg-yellow-300 text-yellow-600" : "bg-red-300 text-red-600"}`}> {result.quizinfo.difficultylevel} </span>
                                    <h1 className="max-h-6 font-semibold text-ellipsis overflow-hidden">
                                        { result.quizinfo.name }
                                    </h1>
                                    <div className="flex gap-x-2 items-center text-sm font-semibold text-gray-600">
                                        <h1 className="">{result.queandans.length} questions</h1>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                        <h2>{result.quizinfo.plays} plays</h2>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                        <h2>{`${result.quizcompletiontime.min > 0 ? result.quizcompletiontime.min + "m" : ""} ${result.quizcompletiontime.sec + "s  "}`}</h2>
                                    </div>

                                </div>
                            </div>)
                        }
                    </div>
                </div>
                {/* specific quiz */}
                <div className="bg-white w-9/12 h-full rounded p-3 overflow-y-scroll flex flex-col gap-y-2">
                    <div className="w-full h-40 bg-gray-200 rounded-t p-2 flex flex-col gap-y-2">
                        <div>
                            <h1 className="text-lg font-medium">{student.results[currentQuiz].quizinfo.name         }</h1>
                            <h1 className=" text-sm">{student.results[currentQuiz].quizinfo.description}</h1>
                        </div>
                        <div className="border-2 border-gray-400 w-fit px-5 py-1 rounded flex items-center   gap-x-4">
                            <h1>Marks</h1>
                            <div className="flex items-end gap-x-1">
                                <h1 className="text-2xl">{student.results[currentQuiz].totalmarks}</h1>
                                <div className="bg-gray-950 w-px h-7 rounded-full rotate-[30deg]"></div>
                                <h1>{student.results[currentQuiz].quizinfo.questions.reduce((count, que) => count + que.marks, 0)}</h1>
                            </div>
                        </div>
                    </div>


                    <div className="w-full">
                        <div className="w-full">
                            <div className="flex flex-col gap-y-4">
                                <div className="flex gap-x-4">
                                    <div className="flex items-center gap-x-1">
                                        <div className="w-4 h-4 rounded-full border bg-green-700"></div>
                                        <h1 className="font-medium">Correct Answers</h1>
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <div className="w-4 h-4 rounded-full border bg-red-500"></div>
                                        <h1 className="font-medium">Incorrect Answers</h1>
                                    </div>
                                    <div className="flex items-center gap-x-1">
                                        <div className="w-4 h-4 rounded-full border bg-blue-400"></div>
                                        <h1 className="font-medium">Not attempted</h1>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-y-4 justify-between items-start">
                                    <div className={`w-[5px] self-stretch rounded-full bh-green-500`}></div>
                                    {
                                        student.results[currentQuiz].quizinfo.questions.map((question, qIndex) => <div className={`font-bold w-full border-2 rounded p-2 ${!student.results[currentQuiz].queandans[qIndex].isattempted && "bg-blue-100"}`}>
                                            <div className="flex justify-between items-start">
                                                <h1>{question.question}</h1>
                                                <h1 className="min-w-fit text-sm border border-gray-300 py-0.5 px-1 rounded ">
                                                    {`${question.marks} marks`}
                                                </h1>
                                            </div>
                                            {question.image && <div className="max-h-40 min-h-20 w-60 border-2 my-2">
                                                <img className="max-h-full max-w-full rounded-md" src={`http://localhost:4000/${question.image}`} />
                                            </div>}

                                            {
                                                question.options.map((option, oIndex) => <div className=" py-1 text-sm flex items-center gap-x-2">
                                                    <div className={`w-4 h-4 rounded-full border border-gray-400 
                                                        ${student.results[currentQuiz].queandans[qIndex] && (student.results[currentQuiz].queandans[qIndex].optionid == option._id && !student.results[currentQuiz].queandans[qIndex].iscorrect) && "bg-red-500"}
                                                        ${option.isTrue && "bg-green-600"}
                                                        `}></div>
                                                    {option.option}
                                                </div>)
                                            }



                                        </div>)


                                    }

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>}
 
            {(tab === 1 && student.userinfo.usertype === "teacher" && student.createdquiz.length <= 0) && <h1 className="text-center p-4 font-bold text-gray-600">No Quiz Found</h1>}
            {(tab === 1 && student.userinfo.usertype === "teacher" && student.createdquiz.length > 0) && <div className="flex flex-col gap-y-2">

                {
                    student.createdquiz.map((quiz) => <div className="w-full max-h-40 bg-white flex gap-x-20 p-3 rounded hover:bg-zinc-200 hover:cursor-pointer justify-between">
                        <div className="flex gap-x-2" onClick={()=>navigate(`/home/quizdetails/${quiz._id}`)}>
                            <div className="max-w-24 max-h-24 min-h-24 min-w-24 border flex items-center">
                                <img className="max-h-full max-w-full" src={`http://localhost:4000/${quiz.image}`} />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <h1 className="font-semibold">{quiz.name}</h1>
                                <h1 className="text-sm"> {quiz.description} </h1>
                                <div className="flex gap-x-2 items-center text-sm font-semibold text-gray-600">
                                    <h1 className="">{quiz.questions.length} questions</h1>
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                    <h2>45 plays</h2>
                                    <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                    <h2> {quiz.grade} grade</h2>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-x-4">
                            <svg onClick={() => {
                                console.log(quiz);
                                setDeleteQuizId(quiz._id)
                                setConfirmQuizDeleteDialog({type:"q",show:true})
                            }} className="h-7 hover:bg-white rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                                <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                            </svg>
                            <svg onClick={() => navigate(`/home/editquiz/${quiz._id}`)} className="h-7 hover:bg-white rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                            </svg>
                        </div>
                    </div>)
                }

            </div>}


            {student.playlist.length <= 0 && tab === 2 && <h1 className="text-center my-3 font-bold text-gray-500">You have not created any play lists yet.</h1>}
            {student.playlist.length > 0 && tab === 2 && <div className="flex h-[calc(100vh-150px)] gap-x-2">
                <div className='w-[calc(40%-10px)] h-[90vh] rounded flex flex-col gap-y-2'>
                    <h1 className='h-10 bg-white px-5 rounded border font-semibold flex items-center' >PlayLists</h1>
                    <div className='h-[calc(95vh-40px)] flex flex-col gap-y-2 overflow-y-scroll no-scrollbar'>

                        {student.playlist && student.playlist.map((pl, PLindex) => <div
                            className={`bg-white min-h-24 rounded hover:shadow-xl p-2 flex justify-between ${currentPlayList === PLindex && "border-2 border-gray-400 shadow-xl"}`} onClick={() => setCurrentPlayList(PLindex)}>
                            <div className='flex gap-x-2'>
                                <div className='h-20 w-24 rounded border flex items-center justify-center'>
                                    <img className="max-h-full max-w-full" src={`http://localhost:4000/${pl.image}`} />
                                </div>
                                <div className=''>
                                    <h1 className='font-bold text-lg'>{pl.name}</h1>
                                    <div className='flex gap-x-1.5   items-center'>
                                        <h1 className=''>{pl.qN} Quiz</h1>
                                        <div className='w-1 h-1 bg-gray-500 rounded-full' ></div>
                                        <h1 className=''>{pl.subject}</h1>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-y-3 flex-col ">
                                <svg className="h-7 hover:bg-gray-200 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30" onClick={() => {
                                    setPldelId(pl._id)
                                    setConfirmQuizDeleteDialog({type:"pl",show:true})
                                }}>
                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                </svg>
                                <svg onClick={() => {
                                    setEditPlId(pl._id)
                                    getSpecificPlForEdit(pl._id)
                                    setcreatePlayListDialogShow(true)
                                    getQuizCreatedByTeacherAndSubjects()
                                }} className="h-7 hover:bg-gray-200 rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                                </svg>
                            </div>

                        </div>)}

                    </div>
                </div>
                <div className='w-[calc(60%-10px)] h-[90vh] bg-white rounded border px-3 overflow-y-scroll no-scrollbar flex flex-col gap-y-2'>
                    <h1 className='sticky bg-white top-0 py-2 px-2 font-semibold'>Quizziz</h1>

                    {student.playlist && student.playlist.length > 0 && student.playlist[currentPlayList] && student.playlist[currentPlayList].quizziz.map(quiz => <div className="w-full h-24 bg-white rounded flex gap-x-2 p-2 hover:bg-gray-100 hover:border border-2 " onClick={() => navigate(`/home/playquiz/${quiz._id}`)}>
                        <div className="h-full max-w-24 min-w-20 flex items-center border">
                            <img className="max-h-full max-w-full" src={`http://localhost:4000/${quiz.image}`} />
                        </div>
                        <div>
                            <span class={`inline-flex items-center rounded-md px-1 py-px text-xs font-bold  ${quiz.difficultylevel == "easy"
                                ? "text-green-700 bg-green-200"
                                : quiz.difficultylevel == "medium"
                                    ? "text-yellow-500 bg-yellow-100"
                                    : "text-red-500 bg-red-200"
                                }`}> {quiz.difficultylevel} </span>
                            <h1 className="max-h-6 font-semibold text-ellipsis overflow-hidden">{quiz.name}
                            </h1>
                            <div className="flex gap-x-2 items-center text-sm font-semibold text-gray-600">
                                {/* <h1 className="">{quiz.questions.length} questions</h1> */}
                                <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                <h2>{quiz.plays} plays</h2>
                                <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                <h2>{`${quiz.duration}m`}</h2>
                            </div>

                        </div>
                    </div>)}


                </div>
            </div>}




        </div>}
        {student.results.length <= 0 && <h1 className="text-center p-4 font-bold text-lg text-gray-600">No quizzes played yet</h1>}
        {confirmQuizDeleteDialog.show && confirmQuizDeleteDialog.type=="q" && <div className="w-96 h-28 bg-red-300 rounded mx-auto shadow-lg p-4 absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col justify-between" >
            <div className="">
                <h1 className="text-xl font-bold text-red-700">Are Sure You Want To Delete Quiz?</h1>
                {/* <svg className="relative top-2 h-5 stroke-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
        </svg> */}
            </div>
            <div className="self-end flex gap-x-4 px-3">
                <button className="rounded font-bold cursor-pointer" onClick={() => deleteQuiz()}>Yes</button>
                <button className="rounded font-bold cursor-pointer" onClick={() => setConfirmQuizDeleteDialog({type:"",show:false})}>No</button>
            </div>
        </div>}




        {/* delete quiz dialog */}
        {confirmQuizDeleteDialog.show && confirmQuizDeleteDialog.type=="pl" && <div className="w-96 h-28 bg-red-300 rounded mx-auto shadow-lg p-4 absolute top-20 left-1/2 transform -translate-x-1/2 flex flex-col justify-between" >
            <div className="">
                <h1 className="text-xl font-bold text-red-700">Are Sure You Want To Delete Quiz?</h1>
                {/* <svg className="relative top-2 h-5 stroke-red-600" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50">
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
        </svg> */}
            </div>
            <div className="self-end flex gap-x-4 px-3">
                <button className="rounded font-bold cursor-pointer" onClick={() => deletePlayList(pldelId)}>Yes</button>
                <button className="rounded font-bold cursor-pointer" onClick={() => setConfirmQuizDeleteDialog({type:"",show:false})}>No</button>
            </div>
        </div>}


        {/* create playList dialog */}
        {createPlayListDialogShow &&
            <div className='w-8/12 bg-white z-10 absolute top-3  rounded left-1/2 transform -translate-x-1/2 p-2 shadow-2xl'>
                <div className='w-full h-full border-2 border-black p-4 flex flex-col content-between gap-y-2'>
                    <div className='flex gap-x-4 h-full'>
                        <div className='flex gap-x-3 flex-col w-1/2 gap-y-2'>

                            <div className='w-full h-40'>
                                {((playListDetails && !playListDetails.image)) && <label for="dropzone-file" class="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer rounded-xl">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-500">
                                        <path
                                            stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                    </svg>
                                    <h2 class="mt-1 tracking-wide text-gray-700">Cover Image</h2>
                                    <p class="mt-2 text-xs tracking-wide text-gray-500">
                                        Upload or darg & drop your file SVG, PNG, JPG or GIF.{" "}
                                    </p>
                                    <input
                                        onChange={(e) => handleImageChange(e)} name="image" id="dropzone-file" type="file" class="hidden"
                                    />
                                </label>}
                                {playListDetails.image && <div className='max-w-full max-h-40 border rounded flex items-center justify-center'>
                                    <svg className="h-7 absolute top-7 left-7 hover:bg-gray-200 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30" onClick={() => { setPlayListDetails({ ...playListDetails, image: null }) }}>
                                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                    </svg>
                                    <img
                                        className='max-h-40 max-w-full object-cover'
                                        src={(typeof (playListDetails.image) === 'object') ? URL.createObjectURL(playListDetails.image) : `http://localhost:4000/${playListDetails.image}`}

                                    />
                                </div>}
                            </div>
                            <div className='w-full'>
                                <label for="username" class="block text-sm font-bold text-gray-500">PlayList Name*</label>
                                <input
                                    name="name"
                                    maxLength={35}
                                    value={playListDetails.name}
                                    onChange={(e) => handleNameAndSubjectChange(e)}
                                    type="text"
                                    placeholder="PLayList Name (30)"
                                    class="w-full mb-2 placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                                />
                            </div>
                            <div className='w-full'>
                                <label for="username" class="block text-sm font-bold text-gray-500">PlayList Subject*</label>
                                <select
                                    name="subject"
                                    value={playListDetails.subject}
                                    onChange={(e) => {
                                        handleNameAndSubjectChange(e);
                                    }}
                                    className="py-2.5 px-4 w-full rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                                >
                                    <option selected disabled hidden>Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject.subject} value={subject.subject}>
                                            {subject.subject}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='w-1/2 max-h-96 overflow-y-scroll no-scrollbar flex flex-col gap-2'>
                            <h1 className='font-semibold'>Choose quiz that you want add to play list</h1>
                            {quizziz.map((quiz, quizIndex) => <label htmlFor={quiz._id} className="flex items-center">
                                <input type="checkbox" id={quiz._id} value={quiz._id} className="hidden peer" onChange={(e) => handleQuizSelection(e)} checked={playListDetails.quizziz.includes(quiz._id)} />
                                <div className="w-full h-20 border-2 rounded p-1.5 flex gap-x-2 peer-checked:border-teal-700 peer-hover:bg-gray-200">
                                    <div className="w-24 h-16 border rounded flex items-center justify-center ">
                                        <img className="max-h-full max-w-full" src={`http://localhost:4000/${quiz.image}`} />
                                    </div>
                                    <div>
                                        <h1 className='font-semibold'>{quiz.name}</h1>
                                        <div className="flex gap-x-2 items-center text-sm font-semibold text-gray-600">
                                            <h1 className="">{quiz.questions.length} questions</h1>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                            <h2>{quiz.plays} plays</h2>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full" ></div>
                                            <h2>{`${quiz.duration}m`}</h2>
                                        </div>
                                    </div>
                                </div>
                            </label>)}

                        </div>
                    </div>
                    <div className='flex gap-x-2 justify-end'>
                        <button className='px-3 py-1 bg-teal-600 rounded text-white' onClick={() => {
                            setcreatePlayListDialogShow(false)
                            setEditPlId(-1)
                            setPlayListDetails({
                                name: null,
                                subject: null,
                                image: null,
                                quizziz: []
                            })
                        }}>Cancel</button>
                        <button className='px-3 py-1 bg-teal-600 rounded text-white' pl onClick={() => createEditPlayList()}>{editPlId === -1 ? "Create PlayList" : "Update PlayList"}</button>
                    </div>

                </div>
            </div>}

    </div>
}


















// const Chart = () => {
//     const options = {
//         animationEnabled: true,
//         title: {
//             text: "Customer Satisfaction"
//         },
//         subtitles: [{
//             text: "71% Positive",
//             verticalAlign: "center",
//             fontSize: 24,
//             dockInsidePlotArea: true
//         }],
//         data: [{
//             type: "doughnut",
//             showInLegend: true,
//             indexLabel: "{name}: {y}",
//             yValueFormatString: "#,###'%'",
//             dataPoints: [
//                 { name: "Unsatisfied", y: 5 },
//                 { name: "Very Unsatisfied", y: 31 },
//                 { name: "Very Satisfied", y: 40 },
//                 { name: "Satisfied", y: 17 },
//                 { name: "Neutral", y: 7 }
//             ]
//         }]
//     };

//     return (
//         <div>
//             <CanvasJSChart options={options} />
//         </div>
//     );
// }
