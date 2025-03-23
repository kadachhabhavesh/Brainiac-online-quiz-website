import { useNavigate } from "react-router-dom";
import bg from "../assets/images/image.png";
import { useEffect, useState } from "react";
import defaultImage from "../assets/images/defualt_quiz.jpeg";


  
export default function Explore() {
    const [subjects, setSubjects] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [loading,setLoading] = useState(true);
    const navigate = useNavigate();
    const currentDate = new Date()
    // let quiz = null;
    useEffect(() => {
      setLoading(true);
      Promise.all([
          fetch("http://localhost:4000/subject", { credentials: "include" }),
          fetch("http://localhost:4000/quiz", { credentials: "include" })
      ])
          .then(async ([subjectRes, quizRes]) => {
              if (subjectRes.status === 401 || quizRes.status === 401) {
                  navigate('/');
                  return;
              }
              const subjects = await subjectRes.json();
              const quizzes = await quizRes.json();
              setSubjects(subjects);
              setQuizzes(quizzes);
          })
          .catch(err => console.log(err))
          .finally(() => setLoading(false));
  }, []);
  


    return (
       <div className="_main">
         
         {loading ?       
         <section class="text-gray-700 body-font">
            <div class="container mx-auto p-4">
              <div className="flex gap-2 items-center mb-2">
                <div className="bg-gray-400 w-2 h-12 animate-pulse rounded-lg"></div>
                <div className="flex flex-col w-full">
                  <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                  <h2 class="bg-gray-400 animate-pulse h-2 w-1/6 mb-2 rounded-lg"></h2>
                </div>
              </div>

              <div class="flex flex-wrap gap-4">
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="container mx-auto p-4">
              <div className="flex gap-2 items-center mb-2">
                <div className="bg-gray-400 w-2 h-12 animate-pulse rounded-lg"></div>
                <div className="flex flex-col w-full">
                  <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                  <h2 class="bg-gray-400 animate-pulse h-2 w-1/6 mb-2 rounded-lg"></h2>
                </div>
              </div>

              <div class="flex flex-wrap gap-4">
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
                <div class="w-60 h-80 shadow-lg rounded-lg">
                  <div class="h-full border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div class="lg:h-32 bg-gray-400 md:h-36 w-full object-cover object-center"></div>
                    <div class="p-6">
                      <h2 class="bg-gray-400 animate-pulse h-4 w-1/4 mb-2 rounded-lg"></h2>
                      <h1 class="w-1/2 mb-4 h-6 animate-pulse bg-gray-500 rounded-lg"></h1>
                      <p class="leading-relaxed mb-3 w-full h-3 animate-pulse bg-gray-400  rounded-lg"></p>
                      <p class="leading-relaxed mb-3 w-2/3 h-3 animate-pulse bg-gray-400 rounded-lg "></p>
                      <p class="leading-relaxed mb-3 w-1/2 h-3 animate-pulse bg-gray-400 rounded-lg"></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          : 
         (<div className="w-full p-5">
            {subjects.map((subject) => {
              // Check if there are any quizzes for this subject that have started
              const hasStartedQuizzes = quizzes.some(
                (q) =>
                  q.subject === subject.subject &&
                  currentDate > new Date(
                    q.starttime.year,
                    q.starttime.month - 1, // Adjust month to be 0-indexed
                    q.starttime.day,
                    q.starttime.hour,
                    q.starttime.minute
                  )
              );
    
              return (
                hasStartedQuizzes && (
                  <div key={subject._id} className="mb-8">
                    <div className="h-9 flex gap-x-2 mb-4">
                      <div className="w-1 bg-orange-600 rounded-2xl"></div>
                      <div className="text-xl font-bold leading-8">
                        {subject.subject}
                      </div>
                    </div>
                    <div className="flex gap-x-4 pb-4 overflow-x-scroll scroll-smooth no-scrollbar">
                      {quizzes
                        .filter(
                          (quiz) =>
                            quiz.subject === subject.subject &&
                            new Date(
                              quiz.starttime.year,
                              quiz.starttime.month - 1, // Adjust month to be 0-indexed
                              quiz.starttime.day,
                              quiz.starttime.hour,
                              quiz.starttime.minute
                            ) < currentDate
                        )
                        .map((quiz) => (
                          <div
                            key={quiz._id}
                            className="_quiz_card min-w-60 max-w-60 h-64 rounded-lg border-2 border-gray-300 hover:border-none hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
                            onClick={() => navigate(`/home/playquiz/${quiz._id}`)}
                          >
                            <div className="max-w-full h-[45%] rounded-t-md">
                              <img
                                className="h-full w-full rounded-t-lg object-cover"
                                src={`http://localhost:4000/${quiz.image}`}
                                alt={quiz.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }}
                              />
                            </div>
                            <div className="h-[55%] bg-white rounded-b-md p-2 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span
                                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                                      quiz.difficultylevel === "easy"
                                        ? "text-green-700 bg-green-100"
                                        : quiz.difficultylevel === "medium"
                                        ? "text-yellow-700 bg-yellow-100"
                                        : "text-red-700 bg-red-100"
                                    }`}
                                  >
                                    {quiz.difficultylevel}
                                  </span>
                                </div>
                                <h1 className="font-semibold text-sm line-clamp-2 mb-1">
                                  {quiz.name}
                                </h1>
                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                  {quiz.description}
                                </p>
                              </div>
                              <div className="flex flex-row text-xs text-gray-500 gap-x-1 items-center">
                                <span>{quiz.questions.length} Questions</span>
                                <div className="h-1 w-1 bg-gray-500 rounded-full"></div>
                                <span>{quiz.plays} plays</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )
              );
            })}
          </div>)}
          
        </div>)
     
}