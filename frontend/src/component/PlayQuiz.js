import { type } from "@testing-library/user-event/dist/type";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export default function PlayQuiz() {
  const [startQuiz, setStartQuiz] = useState(false)
  const [timer, setTimer] = useState({ min: 5, sec: 10 })
  const [quizData, setQuizData] = useState()
  const [quizAns, setQuizAns] = useState([])
  const { quizid } = useParams()
  const navigate = useNavigate()
  let currentDate = new Date(), quizStartDate;

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        let { min, sec } = prevTime;
        if (sec === 0) {
          if (min === 0) {
            handleQuizSubmit()
            clearInterval(interval)
          } else {
            min--;
            sec = 59;
          }
        } else {
          sec--;
        }
        return { min, sec };
      });
    }, 1000);
  }

  const handleAnsChange = (questionId, optionId, qIndex, oIndex) => {
    const isCorrect = quizData.questions[qIndex].options[oIndex].isTrue
    const newQuizAns = [...quizAns];
    newQuizAns[qIndex] = { ...quizAns[qIndex], questionid: questionId, optionid: optionId, iscorrect: isCorrect, marks: quizData.questions[qIndex].marks }
    setQuizAns(newQuizAns)
  }

  const handleQuizSubmit = () => {
    // check question attempted or not
    const newQuizAns = quizData.questions.map((question, qIndex) => {
      // const ans = quizAns.find(a => a.questionid === question._id);
      const ans = quizAns[qIndex];
      console.log(ans.length);
      if (Object.keys(ans).length !== 0) {
        return { ...ans, isattempted: true };
      } else {
        return {
          questionid: question._id,
          optionid: null,
          iscorrect: false,
          marks: question.marks,
          isattempted: false,
        };
      }
    });

    const currenttime = new Date()
    const quizcompletiontime = { min: timer.sec === 0 ? quizData.duration - timer.min : quizData.duration - timer.min - 1, sec: 60 - timer.sec }
    // Use a callback to get the updated data

    const quizWithAns = {
      quizid: quizData._id,
      queandans: newQuizAns,
      starttime: {
        year: currenttime.getFullYear(),
        month: currenttime.getMonth() + 1,
        day: currenttime.getDate(),
        hour: currenttime.getHours(),
        minute: currenttime.getMinutes(),
      },
      quizcompletiontime: quizcompletiontime
    };
    console.log(quizWithAns);


    fetch(`http://localhost:4000/playhistory`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizWithAns)
    })
      .then((res) => {
        if (res.status === 401) {
          navigate('/')
        }
        return res.json()
      })
      .then((res) => {
        navigate(`/home/quizresult/${res._id}`)
      })
      .catch((err) => console.log(err));

  }

  useEffect(() => {
    if (quizData) {
      setTimer({ min: quizData.duration, sec: 0 })
      setQuizAns(quizData.questions.map(() => ({})))
    } else {
      setTimer({ min: 0, sec: 0 })
    }
  }, [quizData])

  useEffect(() => {
    fetch(`http://localhost:4000/quiz/${quizid}`, {
      credentials: "include"
    })
      .then((res) => {
        if (res.status === 401) {
          navigate('/')
        }
        return res.json()
      })
      .then((res) => {
        console.log(res);
        setQuizData(res);
      })
      .catch((err) => console.log(err));
  }, [])



  const checkPassword = (password) => {
    if (password === "null") {
      startTimer()
      setStartQuiz(true)
    } else {
      Swal.fire({
        title: "Enter quiz password",
        input: "password",
        inputAttributes: {
          autocapitalize: "on",
        },
        showCancelButton: true,
        confirmButtonText: "Start Qiuz",
        showLoaderOnConfirm: true,
        inputPlaceholder: "Quiz Password",
        preConfirm: async (pass) => {
          if (pass === password) {
            startTimer()
            setStartQuiz(true)
          } else {
            Swal.fire("Wrong Password");
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      })
    }
  }


  if (quizData) {
    const { year, month, day, hour, minute } = quizData.starttime
    quizStartDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  }

  return quizData && <div className="_main w-full bg-slate-200 p-5 flex gap-x-4" >
    <div className="flex flex-col gap-y-5 w-8/12" >
      <div className="w-full bg-white p-4 flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-5">
            <div className="_image h-28 min-w-32 max-w-32 border-2 flex justify-center items-center">
              <img className="max-h-full max-w-full" src={`http://localhost:4000/${quizData.image}`} alt="Quiz" />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div className="flex gap-x-2">
                  <h1 className={`text-sm font-bold ${quizData.difficultylevel === 'hard' ? "text-orange-500" : quizData.difficultylevel === 'medium' ? "text-yellow-500" : "text-green-500"} `}>{quizData.difficultylevel}</h1>
                  {(quizData.password != "null" && quizData.password != null)  && <h1 className="text-sm font-semibold text-orange-500">private quiz</h1>}
                </div>
                {currentDate < quizStartDate && <h1 className="text-orange-500 font-semibold">{`start time ${quizData.starttime.day}-${quizData.starttime.month}-${quizData.starttime.year}  ${quizData.starttime.hour < 9 ? "0" + quizData.starttime.hour : quizData.starttime.hour}:${quizData.starttime.minute < 9 ? "0" + quizData.starttime.minute : quizData.starttime.minute}`}</h1>}
              </div>
              <h1 className="font-bold">{quizData.name}</h1>
              <h1 className="font-semibold text-sm">
                {quizData.description}
              </h1>
              <div className="flex gap-x-5 text-sm mt-1 text-gray-500">
                <div className="flex flex-col gap-x-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    <h1>{quizData.plays} plays</h1>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    <h1>{quizData.grade} grade</h1>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    <h1>{quizData.questions.length} questions</h1>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    <h1>{quizData.subject}</h1>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                    <h1>{quizData.duration} min</h1>
                  </div>
                </div>
                <div className="flex flex-col bg-teal-200 h-fit px-3 py-px rounded text-black">
                  <h1>invite code</h1>
                  <h1 className="font-semibold tracking-widest text-2xl">
                    {quizData.code}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          {/* <div className=" _time h-fit mx-5 min-w-fit">
            <h1>12 : 12</h1>
          </div> */}
        </div>
        <div className="flex justify-between items-end">
          <div className="_creater flex gap-x-2 items-center">
            <div className="bg-teal-400 w-8 h-8 flex justify-center items-center rounded-full text-white text-sm">
              {quizData.creator.firstname.charAt(0).toUpperCase() + quizData.creator.lastname.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs">{quizData.creator.firstname + " " + quizData.creator.lastname}</h1>
            </div>
          </div>
          <div className="_btns">
            {!startQuiz && currentDate > quizStartDate && <h1
              className="py-1.5 px-6 bg-teal-700 text-white rounded font-bold cursor-pointer hover:bg-teal-500"
              onClick={() => {
                checkPassword(quizData.password)
              }}
            >
              Start Quiz
            </h1>}
            {startQuiz && <h1
              className="py-1.5 px-6 bg-teal-700 text-white rounded font-bold cursor-pointer hover:bg-teal-500"
              onClick={() => handleQuizSubmit()}
            >
              Submit Quiz
            </h1>}
          </div>
        </div>
      </div>

      {startQuiz && <div className="pb-10">
        <h1 className="font-bold my-3">{quizData.questions.length} Questions</h1>
        <div className="_questions flex flex-col gap-y-3">
          {
            quizData.questions.map((question, qindex) => <div className="bg-white w-full p-3">
              <div className="flex justify-between items-start">
                <h1>{`${qindex + 1} ${question.question}`}</h1>
                <h1 className="min-w-fit text-sm border border-gray-300 py-0.5 px-1 rounded ">
                  {`${question.marks} marks`}
                </h1>
              </div>
              {question.image && <div className="max-h-40 w-60 border-2">
                <img className="max-h-full max-w-full" src={`http://localhost:4000/${question.image}`} />
              </div>}
              <div className="_options flex flex-col">
                {
                  question.options.map((option, oIndex) => <label for={option._id} className="px-2 py-1 text-sm flex items-center gap-x-2">
                    <input id={option._id} className="peer hidden" type="radio" name={question._id} value={option._id} onChange={(e) => handleAnsChange(question._id, option._id, qindex, oIndex)} />
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-400 peer-checked:border-none peer-checked:bg-teal-500"></div>
                    {option.option}
                  </label>)
                }
              </div>
            </div>)
          }
        </div>
        <h1
          className="py-1.5 px-6 w-fit bg-teal-700 text-white rounded font-bold cursor-pointer hover:bg-teal-500 mt-5"
          onClick={() => handleQuizSubmit()}
        >
          Submit Quiz
        </h1>
      </div>}

    </div>
    <div className="w-3/12">
      <div className="_timer bg-white w-full p-3 h-fit flex flex-col items-center sticky top-5 gap-y-2" >
        <div className={`flex gap-x-2 text-4xl font-bold ${timer.min < 5 && "text-red-600"} `}>
          <div className="flex flex-col items-center justify-center w-11" >
            <h1 className="text-xs text-gray-400" >minute</h1>
            <h1>{timer.min >= 0 && timer.min <= 9 ? "0" + timer.min : timer.min}</h1>
          </div>
          <h1 className="self-end mb-1" >:</h1>
          <div className="flex flex-col items-center justify-center w-11" >
            <h1 className="text-xs text-gray-400" >second</h1>
            <h1>{timer.sec >= 0 && timer.sec <= 9 ? "0" + timer.sec : timer.sec}</h1>
          </div>
        </div>
        <h1 className="text-md">Time Remain</h1>
      </div>
    </div>
  </div>
    ;
}