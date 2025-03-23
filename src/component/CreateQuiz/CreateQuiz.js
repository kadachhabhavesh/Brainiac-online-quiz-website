import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Quiz from "./Quiz";
import Questions from "./Questions";

export const QuizIdContext = createContext()

export default function CreateQuiz() {
  const navigate = useNavigate()
  const { quizid } = useParams()
  const [currentTab, setCurrentTab] = useState(0);
  const [quizDetailsValidate, setquizDetailsValidate] = useState(false);
  const [questions, setQuestions] = useState([
    {
      question: null,
      image: null,
      options: [
        { option: "", isTrue: false },
        { option: "", isTrue: false },
        { option: "", isTrue: false },
      ],
      explanation: null,
      marks: 1,
    },
  ]);
  const [quizDetails, setQuizDetails] = useState({
    name: null,
    description: null,
    image: null,
    grade: null,
    difficultylevel: "easy",
    starttime: {},
    duration: null,
    subject: null,
    showresult: true,
    private: false,
    password: null,
  });




  useEffect(() => {
    if(typeof(quizid)!=="undefined"){
      quizid && fetch(`http://localhost:4000/quiz/${quizid}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((res) => {
        setQuestions(res.questions)
        delete res.questions
        setQuizDetails(res)
      })
    }
  }, [])
  // for add quiz
  useEffect(()=>{
    if(typeof(quizid)==="undefined"){
      console.log("add");
    }
  },[])




  const createQuiz = (ques) => {
    const quiz = { ...quizDetails, ["questions"]: questions };
    let formData = new FormData();

    // Helper function to flatten the object
    const flattenObject = (obj, parent = "", res = {}) => {
      for (let key in obj) {
        const propName = parent ? `${parent}[${key}]` : key;
        if (obj[key] instanceof File) {
          res[propName] = obj[key];
        } else if (Array.isArray(obj[key])) {
          obj[key].forEach((item, index) => {
            flattenObject(item, `${propName}[${index}]`, res);
          });
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], propName, res);
        } else {
          res[propName] = obj[key];
        }
      }
      return res;
    };

    // Function to convert the nested object to FormData
    const objectToFormData = (obj) => {
      const formData = new FormData();
      const flattenedObject = flattenObject(obj);
      for (let key in flattenedObject) {
        formData.append(key, flattenedObject[key]);
      }
      return formData;
    };
    fetch(typeof(quizid) == "undefined" ? "http://localhost:4000/quiz" : `http://localhost:4000/quiz/${quizid}`, {
      method: typeof(quizid) == "undefined" ? "POST" : "PUT",
      body: objectToFormData(quiz),
      credentials: 'include'
    })
      .then((res) => {
        if (res.statua === 400) {
          console.log("server Error");
        }
        return res.json()
      })
      .then((res) => {
        if(window.location.pathname.toString().split("/")[1] == "admin")
          navigate(`/admin/playquiz/${res.quiz._id}`)
        else
          navigate(`/home/playquiz/${res.quiz._id}`)
      })
      .catch((error) => console.error("Error:", error));
  };

  return ((quizid !== -1 && quizDetails && questions) &&
    <>
      <div className="flex items-center justify-center">
        <div className="_main_div bg-white h-[98vh] w-full shadow-lg mt-1">
          <div className="w-full h-14 rounded-t-xl px-6 pt-2 flex items-center bg-gray-100">
            {/* tab 1 */}
            <div
              className={`${currentTab == 0 ? "bg-white font-bold" : "bg-none"
                }  h-full w-28 rounded-t-lg flex items-center justify-center font-bold -tracking-tighter cursor-pointer`}
              onClick={() => setCurrentTab(0)}
            >
              Quiz
            </div>
            {/* tab 2 */}
            {quizDetailsValidate && (
              <div
                className={`${currentTab == 1 ? "bg-white font-bold" : "bg-none"
                  } h-full w-36 rounded-t-lg flex items-center justify-center font-bold -tracking-tighter cursor-pointer`}
                onClick={() => setCurrentTab(1)}
              >
                Questions
              </div>
            )}
          </div>

          <div className="w-full h-[92%] rounded-b-xl overflow-y-scroll no-scrollbar mt-3">
            <QuizIdContext.Provider value={quizid}>
              {currentTab == 0 ? (
                <Quiz
                  changetab={setCurrentTab}
                  saveQuizDetails={setQuizDetails}
                  quizdetails={quizDetails}
                  setquizDetailsValidate={setquizDetailsValidate}
                />
              ) : (
                <Questions
                  changetab={setCurrentTab}
                  saveQuestions={setQuestions}
                  questions={questions}
                  createQuiz={createQuiz}
                />
              )}
            </QuizIdContext.Provider>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col w-1/3 h-fit absolute top-0 right-0">
            <div className="z-30 w-full h-36 border  text-green-700 overflow-y-scroll no-scrollbar" >
                {JSON.stringify(quizDetails)}
            </div>
            <div className="z-30 w-full h-96 border text-red-700 overflow-y-scroll no-scrollbar" >
                {JSON.stringify(questions)}
            </div>
        </div> */}
    </>
  );
}
