import { useState, useContext, useEffect } from "react";
import { QuizIdContext } from "./CreateQuiz";
import { useNavigate } from "react-router-dom";



export default function Questions(props) {
  const navigate = useNavigate()
  const editQuizid = useContext(QuizIdContext)
  const [questions, setQuestions] = useState(props.questions);
  const [errorMsg, setErrorMsg] = useState({ msg: null, iserr: true });
  const [generetWithAIdialog, setGeneretWithAIdialog] = useState(false);
  const [AIGenerting, SetAIGenerting] = useState(false);

  const [dataForAI, setDataForAI] = useState([])
  const [subjects, setSubjects] = useState([])
  useEffect(() => {
    fetch(`http://localhost:4000/subject`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401)
          navigate("/")
        return res.json()
      })
      .then((res) => {
        setSubjects(res);
        console.log(res);
      })
      .catch((res) => console.log(res));
  }, []);
  const handleChange = (e) => {
    setDataForAI({ ...dataForAI, [e.target.name]: e.target.value });
  };

  const generateQuestions = async () => {
    const apiUrl = "https://api.aimlapi.com/chat/completions"; // Replace with your API endpoint
    const apiKey = "a970d1ecc1af4a1a9b5a1366e6bf1e31";
    const model = "mistralai/Mixtral-8x7B-Instruct-v0.1";

    const requestBody = {
      model,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant who knows everything.",
        },
        {
          role: "user",
          content: `Generate 3 multiple-choice questions (MCQs) on the topic of ${dataForAI.topic} in ${dataForAI.subject}. The questions should be easy difficulty and cover different aspects of the topic. Each question should have one correct answer and 4 answer options. Include a brief explanation for each correct answer. The output should be in JSON format with the following structure:
          {
            "questions": [
              {
                "question": "question text",
                "marks": mark,
                "explanation": "answer explanation",
                "options": [
                  { "option": "option text", "isTrue": true/false }
                ]
              }
            ]
          }`,
        },
      ],
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }).then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      // const message = responseData.choices[0].message.content;
      return res.json()
    })
      .then(res => {
        const { questions } = JSON.parse(res.choices[0].message.content);
        setQuestions(questions)
        console.log(questions);
        SetAIGenerting(false)
        // setQuestions([...JSON.parse(res.choices[0].message.content.questions)])
      })
      .catch(error => {
        SetAIGenerting(false)
        console.error("Error fetching response from API:", error);
      })


  }


  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex].option = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCurrectAnsRadio = (qIndex, oIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.forEach((option, index) => {
      option.isTrue = index === oIndex;
    });
    setQuestions(newQuestions);
  };

  const handleExplanationChange = (qIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].explanation = e.target.value;
    setQuestions(newQuestions);
  };

  const handlemarksChange = (qIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].marks = parseInt(e.target.value);
    setQuestions(newQuestions);
  };

  const handleImageChange = (qIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].image = e.target.files[0];
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
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
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ option: "", isTrue: false });
    setQuestions(newQuestions);
  };

  const deleteQuestion = (qIndex) => {
    const newQuestions = questions.filter((ques, index) => index !== qIndex);
    setQuestions(newQuestions);
  };
  const deleteOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (option, index) => index !== oIndex
    );
    setQuestions(newQuestions);
  };
  const deleteImage = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].image = null;
    setQuestions(newQuestions);
  };

  const validate = () => {
    props.saveQuestions(questions);
    for (let question of questions) {
      // check question
      if (!question.question) {
        setErrorMsg({ msg: "please Fill All Data", iserr: true });
        return false;
      }
      // check options
      for (let option of question.options) {
        if (!option.option) {
          setErrorMsg({ msg: "please Fill All Data", iserr: true });
          return false;
        }
      }
      // check correct ans selected or not
      if (!question.options.some((option) => option.isTrue)) {
        setErrorMsg({ msg: "select Answer", iserr: true });
        return false;
      }
    }
    setErrorMsg({ msg: "quiz created", iserr: false });
    return true;
  };

  return (
    <>
      {errorMsg.msg && (
        <div className="z-20 absolute top-4 left-1/2 transform-translate-x-1/2">
          <div
            className={`py-1.5 px-6 border rounded flex gap-x-4 font-black items-center ${errorMsg.iserr
              ? " border-red-400 text-red-400 bg-red-200"
              : " border-green-400 text-green-500 bg-green-200"
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



      {/* generet question With */}
      {!generetWithAIdialog && typeof(editQuizid)==="undefined" && <button onClick={() =>setGeneretWithAIdialog(true) } className="mx-5 my-3 py-2 w-48 bg-gradient-to-r from-orange-500 to-teal-900 font-semibold text-white rounded-lg hover:shadow-lg shadow-black hover:bg-opacity-90 flex items-center justify-center">
        Generate With AI
      </button>}

      {generetWithAIdialog && <div className="w-full h-32 my-2 px-5">
        <div className="w-full h-full rounded-md">
          <div className="flex gap-x-4 items-end">
            <div>
              <label for="username" class="block text-sm font-bold text-gray-500">
                Subject
              </label>
              <select
                name="subject"
                // value={dataForAI.subject}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="py-2.5 px-4 w-52 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              >
                <option selected disabled hidden>Subject</option>
                {subjects.map((subject) => (
                  <option key={subject.subject} value={subject.subject}>
                    {subject.subject}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label for="username" class="block text-sm font-bold text-gray-500">
                Difficulty level
              </label>
              <select
                name="difficultylevel"
                // value={dataForAI.difficultylevel}
                onChange={(e) => {
                  handleChange(e);
                }}
                className={`${dataForAI.difficultylevel === "hard"
                  ? "text-red-500"
                  : dataForAI.difficultylevel === "medium"
                    ? "text-yellow-400"
                    : "text-green-500"
                  } font-bold py-2.5 px-4 w-52 mt-2 rounded-lg border-2 border-gray-300 bg-white focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40`}
              >
                <option value="easy" className="text-green-500 font-bold">
                  Easy
                </option>
                <option value="medium" className="text-yellow-400 font-bold">
                  Medium
                </option>
                <option value="hard" className="text-red-500 font-bold">
                  Hard
                </option>
              </select>
            </div> */}
            <div>
              <label for="username" class="block text-sm font-bold text-gray-500">
                Topic from given subject
              </label>
              <input
                name="topic"
                value={dataForAI.name}
                onChange={(e) => handleChange(e)}
                type="text"
                placeholder="Quiz Name (150)"
                class="block mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              />
            </div>
            {/* <div>
              <label for="username" class="block text-sm font-bold text-gray-500">
                Question count
              </label>
              <select
                name="quescount"
                // value={dataForAI.subject}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="py-2.5 px-4 w-44 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              >
                <option selected value={1}>1</option>
                {subjects.map((subject, index) => (
                  <option value={index + 2}>{index + 2}</option>
                ))}
              </select>
            </div> */}
            {/* <div>
              <label for="username" class="block text-sm font-bold text-gray-500">
                Option per question
              </label>
              <select
                name="optioncount"
                // value={dataForAI.subject}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="py-2.5 px-4 w-44 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              >
                <option selected value={1}>1</option>
                {subjects.map((subject, index) => (
                  <option value={index + 2}>{index + 2}</option>
                ))}
              </select>
            </div> */}
            <button onClick={()=>{
              SetAIGenerting(true)
              generateQuestions();
            }} className="mx-5 py-2 text-lg px-10 bg-gradient-to-r from-orange-500 to-teal-900 font-semibold text-white rounded-lg hover:shadow-lg hover:font-bold shadow-black">
              {!AIGenerting && "Generate"}
              {AIGenerting && <div class='flex space-x-2 justify-center items-center my-1'>
                <span class='sr-only'>Loading...</span>
                <div class='h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                <div class='h-3 w-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                <div class='h-3 w-3 bg-white rounded-full animate-bounce'></div>
              </div>}
            </button>
          </div>
        </div>
      </div>}




      {questions.map((ques, qIndex) => (
        <div className="px-5 min-h-fit ">
          {/* question and image */}
          <div className=" flex gap-x-4">
            <div className="_question w-2/3">
              <label
                for="Description"
                class="block text-sm font-bold text-gray-500"
              >
                {qIndex + 1}. Question*
              </label>
              <textarea
                value={ques.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                placeholder="Type Question Here (150)"
                class="block  mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40 resize-none"
              ></textarea>
            </div>
            <div className="_question_image mt-5 ml-0 w-1/3">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Image
              </label>

              {ques.image && (
                <div className="w-2/3 h-36 rounded-lg border-2">
                  <img
                    // src={URL.createObjectURL(ques.image)}
                    src={typeof (editQuizid) == "undefined" ? URL.createObjectURL(ques.image) : `http://localhost:4000/${ques.image}`}
                    className="w-72 h-full rounded-lg"
                  />
                  <svg
                    className="w-fit h-5 relative -top-32 left-72 cursor-pointer stroke-red-500 fill-red-500"
                    onClick={() => deleteImage(qIndex)}
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                  >
                    <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z"></path>
                  </svg>
                </div>
              )}
              {ques.image == null && (
                <label
                  for="dropzone-file"
                  class="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer rounded-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-8 h-8 text-gray-500"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>

                  <h2 class="mt-1 font-medium tracking-wide text-gray-700">
                    Cover Image
                  </h2>

                  <p class="mt-2 text-xs tracking-wide text-gray-500">
                    Upload or darg & drop your file SVG, PNG, JPG or GIF.{" "}
                  </p>
                  <input
                    id="dropzone-file"
                    type="file"
                    class="hidden"
                    onChange={(e) => handleImageChange(qIndex, e)}
                  />
                </label>
              )}
            </div>
          </div>
          {/* marks */}
          <div className="mt-6 w-1/2">
            <label for="file" class="block text-sm font-bold text-gray-500">
              Marks
            </label>

            <select
              onChange={(e) => {
                handlemarksChange(qIndex, e);
              }}
              value={ques.marks}
              className="py-2.5 px-4 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
            >
              {[1, 2, 3, 4, 5].map((g) => (
                <option value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className="flex">
            {/* Options */}
            <div className="w-2/3">
              {ques.options.map((options, oIndex) => (
                <div className="_options mt-4 flex gap-5 flex-wrap">
                  <div className="w-full">
                    {/* <label for="option" class="block text-sm font-bold text-gray-500">Option {oIndex + 1}*</label> */}
                    <div className="flex gap-x-2 items-center">
                      <input
                        checked={options.isTrue}
                        onChange={(e) => handleCurrectAnsRadio(qIndex, oIndex)}
                        type="radio"
                        name={`ques${qIndex + 1}option`}
                        value={oIndex}
                        className="w-6 h-6 text-teal-900 bg-gray-100 border-gray-300 focus:ring-teal-500 accent-teal-700"
                      />
                      <input
                        type="text"
                        value={options.option}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                        placeholder={`Option ${oIndex + 1}`}
                        class="block mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                      />
                      <svg
                        onClick={() => deleteOption(qIndex, oIndex)}
                        className="h-9 w-9 stroke-red-700 fill-red-700 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="100"
                        height="100"
                        viewBox="0 0 100 100"
                      >
                        <path d="M 46 13 C 44.35503 13 43 14.35503 43 16 L 43 18 L 32.265625 18 C 30.510922 18 28.879517 18.922811 27.976562 20.427734 L 26.433594 23 L 23 23 C 20.802666 23 19 24.802666 19 27 C 19 29.197334 20.802666 31 23 31 L 24.074219 31 L 27.648438 77.458984 C 27.88773 80.575775 30.504529 83 33.630859 83 L 66.369141 83 C 69.495471 83 72.11227 80.575775 72.351562 77.458984 L 75.925781 31 L 77 31 C 79.197334 31 81 29.197334 81 27 C 81 24.802666 79.197334 23 77 23 L 73.566406 23 L 72.023438 20.427734 C 71.120481 18.922811 69.489078 18 67.734375 18 L 57 18 L 57 16 C 57 14.35503 55.64497 13 54 13 L 46 13 z M 46 15 L 54 15 C 54.56503 15 55 15.43497 55 16 L 55 18 L 45 18 L 45 16 C 45 15.43497 45.43497 15 46 15 z M 32.265625 20 L 43.832031 20 A 1.0001 1.0001 0 0 0 44.158203 20 L 55.832031 20 A 1.0001 1.0001 0 0 0 56.158203 20 L 67.734375 20 C 68.789672 20 69.763595 20.551955 70.306641 21.457031 L 71.833984 24 L 68.5 24 A 0.50005 0.50005 0 1 0 68.5 25 L 73.5 25 L 77 25 C 78.116666 25 79 25.883334 79 27 C 79 28.116666 78.116666 29 77 29 L 23 29 C 21.883334 29 21 28.116666 21 27 C 21 25.883334 21.883334 25 23 25 L 27 25 L 61.5 25 A 0.50005 0.50005 0 1 0 61.5 24 L 28.166016 24 L 29.693359 21.457031 C 30.236405 20.551955 31.210328 20 32.265625 20 z M 64.5 24 A 0.50005 0.50005 0 1 0 64.5 25 L 66.5 25 A 0.50005 0.50005 0 1 0 66.5 24 L 64.5 24 z M 26.078125 31 L 73.921875 31 L 70.357422 77.306641 C 70.196715 79.39985 68.46881 81 66.369141 81 L 33.630859 81 C 31.53119 81 29.803285 79.39985 29.642578 77.306641 L 26.078125 31 z M 38 35 C 36.348906 35 35 36.348906 35 38 L 35 73 C 35 74.651094 36.348906 76 38 76 C 39.651094 76 41 74.651094 41 73 L 41 38 C 41 36.348906 39.651094 35 38 35 z M 50 35 C 48.348906 35 47 36.348906 47 38 L 47 73 C 47 74.651094 48.348906 76 50 76 C 51.651094 76 53 74.651094 53 73 L 53 69.5 A 0.50005 0.50005 0 1 0 52 69.5 L 52 73 C 52 74.110906 51.110906 75 50 75 C 48.889094 75 48 74.110906 48 73 L 48 38 C 48 36.889094 48.889094 36 50 36 C 51.110906 36 52 36.889094 52 38 L 52 63.5 A 0.50005 0.50005 0 1 0 53 63.5 L 53 38 C 53 36.348906 51.651094 35 50 35 z M 62 35 C 60.348906 35 59 36.348906 59 38 L 59 39.5 A 0.50005 0.50005 0 1 0 60 39.5 L 60 38 C 60 36.889094 60.889094 36 62 36 C 63.110906 36 64 36.889094 64 38 L 64 73 C 64 74.110906 63.110906 75 62 75 C 60.889094 75 60 74.110906 60 73 L 60 47.5 A 0.50005 0.50005 0 1 0 59 47.5 L 59 73 C 59 74.651094 60.348906 76 62 76 C 63.651094 76 65 74.651094 65 73 L 65 38 C 65 36.348906 63.651094 35 62 35 z M 38 36 C 39.110906 36 40 36.889094 40 38 L 40 73 C 40 74.110906 39.110906 75 38 75 C 36.889094 75 36 74.110906 36 73 L 36 38 C 36 36.889094 36.889094 36 38 36 z M 59.492188 41.992188 A 0.50005 0.50005 0 0 0 59 42.5 L 59 44.5 A 0.50005 0.50005 0 1 0 60 44.5 L 60 42.5 A 0.50005 0.50005 0 0 0 59.492188 41.992188 z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 w-1/3 px-3">
              <div className="flex gap-x-2 items-center">
                {/* <input type="checkbox" className="h-4 w-4 accent-teal-700" /> */}
                <label
                  for="Description"
                  class="block text-sm font-bold text-gray-500"
                >
                  Provide an explanation while displaying the correct answer
                </label>
              </div>
              <textarea
                onChange={(e) => handleExplanationChange(qIndex, e)}
                value={ques.explanation!="null" ? ques.explanation : ""}
                placeholder="Explanation (150)"
                class="block mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-4 h-40 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40 resize-none"
              ></textarea>
            </div>
          </div>

          {/* add question */}
          <div className="flex items-center mt-5">
            <div
              className="w-32 flex gap-x-3 items-center cursor-pointer"
              onClick={() => addOption(qIndex)}
            >
              <svg
                className="h-5 w-5 stroke-teal-700 fill-teal-700"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
                ></path>
              </svg>
              <h1 className="font-bold text-teal-700">Add Option</h1>
            </div>
            <button
              className="py-1.5 px-6 bg-red-700 text-white hover:font-bold hover:bg-red-600 rounded-lg"
              onClick={() => {
                deleteQuestion(qIndex);
              }}
            >
              Delete Question
            </button>
          </div>
          <div className="w-full h-0.5 my-4 border-t-2 border-dashed border-gray-300"></div>
        </div>
      ))}


      {/* buttons like add question ,save question and create quiz*/}
      <div className="w-full h-min bg-white sticky bottom-0 p-2 flex justify-between">
        <div
          className="flex gap-x-3 items-center mx-5 cursor-pointer hover:bg-gray-200 px-5 rounded-full"
          onClick={() => {
            addQuestion();
          }}
        >
          <svg
            className="h-5 w-5 stroke-orange-500 fill-orange-500"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="100"
            height="100"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M 11 2 L 11 11 L 2 11 L 2 13 L 11 13 L 11 22 L 13 22 L 13 13 L 22 13 L 22 11 L 13 11 L 13 2 Z"
            ></path>
          </svg>
          <h1 className="font-bold text-orange-500">Add Question</h1>
        </div>
        <div className="flex gap-x-4">
          <button
            className="py-2 px-6 bg-teal-800 text-white hover:font-bold hover:bg-teal-700 rounded-lg"
            onClick={() => {
              props.saveQuestions(questions);
              setErrorMsg({ msg: "Data Saved", iserr: false });
            }}
          >
            Save Questions
          </button>
          <button
            disabled={questions.length<=0}
            className={`py-2 px-6 bg-teal-800 text-white hover:font-bold hover:bg-teal-700 rounded-lg ${questions.length<=0 && "pointer-events-none bg-gray-400"}`}
            onClick={() => {
              if (validate()) {
                props.createQuiz();
              }
            }}
          >
            {typeof (editQuizid) == "undefined" ? "Create Quiz" : "Update Quiz"}
          </button>
        </div>
      </div>
    </>
  );
}
