import { useNavigate } from "react-router-dom";
import bg from "../assets/images/image.png";
import { useEffect, useState } from "react";
export default function Explore() {
    const [subjects, setSubjects] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const currentDate = new Date()
    // let quiz = null;
    useEffect(() => {
        // fetch subjects
        fetch("http://localhost:4000/subject", {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) {
                    navigate('/')
                }
                return res.json()
            })
            .then((res) => {
                console.log(res);
                setSubjects(res);
            })
            .catch((err) => console.log(err));
        // fetch quizzes
        fetch("http://localhost:4000/quiz", {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) {
                    navigate('/')
                }
                return res.json()
            })
            .then((res) => {
                console.log(res,37);
                setQuizzes(res);
            })
            .catch((err) => console.log(err));
    }, []);


    return (<div className="_main">
        <div className="w-full p-5">
            {subjects.map((subject) => {
                return (
                    quizzes.some((q) => (q.subject  == subject.subject) && (currentDate > new Date( q.starttime.year, q.starttime.month,q.starttime.day,q.starttime.hour,q.starttime.minute, 0, 0))  ) && (
                        <div class="">
                            <div className="h-9 flex gap-x-2 mb-4">
                                <div className="w-1 bg-orange-600 rounded-2xl"></div>
                                <div className="text-xl font-bold leading-8 ">
                                    {subject.subject}
                                </div>
                            </div>
                            <div className=" flex gap-x-4 pb-4 overflow-x-scroll scroll-smooth no-scrollbar">
                                {quizzes.map((quiz) => {
                                    const { year, month, day, hour, minute } = quiz.starttime
                                    let date = new Date(year, month-1, day, hour, minute, 0, 0);

                                    return date < currentDate && (
                                        subject.subject == quiz.subject && (
                                            <div
                                                className="_quiz_card min-w-60 max-w-60 h-64 rounded-lg border-2 border-gray-300 hover:border-none hover:shadow-lg hover:scale-[1.01]"
                                                onClick={() => navigate(`/home/playquiz/${quiz._id}`)}
                                            >
                                                <div className="max-w-full h-[45%] rounded-t-md">
                                                    <img
                                                        className="h-full w-full rounded-t-lg"
                                                        src={`http://localhost:4000/${quiz.image}`}
                                                    />
                                                </div>
                                                <div className="h-[55%] bg-white rounded-b-md p-2">
                                                    <div className="flex justify-between">
                                                        <span
                                                            class={`inline-flex items-center rounded-md px-px py-px text-xs font-bold ${quiz.difficultylevel == "easy"
                                                                ? "text-green-700"
                                                                : quiz.difficultylevel == "medium"
                                                                    ? "text-yellow-500"
                                                                    : "text-red-500"
                                                                }`}
                                                        >
                                                            {quiz.difficultylevel}
                                                        </span>
                                                        {/* <svg className="_like h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="black" stroke-width="1" fill="none" />
                                                            </svg> */}
                                                    </div>

                                                    <h1 className="max-h-12 w-full font-semibold text-ellipsis overflow-hidden">
                                                        {quiz.name}
                                                    </h1>
                                                    <h1 className="max-h-12 w-full  text-xs truncate">
                                                        {quiz.description}
                                                    </h1>
                                                    <div className="flex flex-row text-xs text-gray-500 gap-x-1 items-center">
                                                        <h1>{quiz.questions.length} Questions</h1>
                                                        <div className="h-[4px] w-[4px] bg-gray-500 rounded-full"></div>
                                                        <h1>{quiz.plays} plays</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    );
                                })}
                            </div>
                        </div>
                    )
                );
            })}
        </div>
    </div>
    );
}
