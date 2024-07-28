import { useContext, useEffect, useState } from "react";
import Questions from "./Questions";
import { useNavigate } from "react-router-dom";
import { QuizIdContext } from "./CreateQuiz";



export default function Quiz(props) {
  const navigate = useNavigate()
  const delquizid = useContext(QuizIdContext)
  const [errorMsg, setErrorMsg] = useState({ msg: null, iserr: true });
  const [quizdetails, setQuizdetails] = useState(props.quizdetails);
  const [showPassword, setShowPassword] = useState(false);
  const [subjects, setSubjects] = useState([])
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const grade = [
    "KG",
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "11th",
    "12th",
    "Diploma",
    "University",
  ];

  const handleChange = (e) => {
    setQuizdetails({ ...quizdetails, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    setQuizdetails({ ...quizdetails, ["image"]: e.target.files[0] });
  };
  const handleDateChange = (e) => {
    const newQuizdetails = { ...quizdetails }
    if (e.target.name === "hour")
      newQuizdetails.starttime.hour = parseInt(e.target.value)
    else if (e.target.name === "minute")
      newQuizdetails.starttime.minute = parseInt(e.target.value)
    else{
      const [year,month,day] = e.target.value.split("-")
      newQuizdetails.starttime.year = parseInt(year)
      newQuizdetails.starttime.month = parseInt(month)
      newQuizdetails.starttime.day = parseInt(day)
    }
    console.log(newQuizdetails.starttime);

    setQuizdetails(newQuizdetails);
  };
  const handleCheckboxChange = (e) => {
    setQuizdetails({
      ...quizdetails,
      [e.target.name]: e.target.checked ? true : false,
    });
  };
  const validate = () => {
    console.log(quizdetails);
    if (
      !quizdetails.name ||
      !quizdetails.description ||
      !quizdetails.image ||
      !quizdetails.grade ||
      !quizdetails.duration ||
      !quizdetails.subject ||
      !quizdetails.starttime.year ||
      !quizdetails.starttime.month ||
      !quizdetails.starttime.day ||
      !quizdetails.starttime.hour ||
      !quizdetails.starttime.minute ||
      (quizdetails.private && !quizdetails.password)
    ) {
      setErrorMsg({ msg: "Fill Quiz Details", iserr: true });
      return false;
    }
    setErrorMsg({ msg: "Quiz Details Saved", iserr: true });
    props.setquizDetailsValidate(true)
    return true;
  };

  // setQuizdetails for quiz update
  useEffect(() => {
    setQuizdetails(props.quizdetails)
  }, [props.quizdetails])

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
  return (
    <div>
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
      <div className="p-5">
        <div>
          <label for="username" class="block text-sm font-bold text-gray-500">
            Quiz Name*
          </label>

          <input
            name="name"
            value={quizdetails.name}
            onChange={(e) => handleChange(e)}
            type="text"
            placeholder="Quiz Name (150)"
            class="block mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
          />
        </div>
        <div className="mt-5">
          <label
            for="Description"
            class="block text-sm font-bold text-gray-500"
          >
            Description*
          </label>

          <textarea
            name="description"
            value={quizdetails.description}
            onChange={(e) => handleChange(e)}
            placeholder="Quiz description (400)"
            class="block  mt-2 w-full placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-4 h-32 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40 Class resize-none"
          ></textarea>
        </div>

        <div className="flex gap-x-4 mt-5">
          <div className="ml-0 max-w-fit min-w-fit">
            <label for="file" class="block text-sm font-bold text-gray-500">
              Image*
            </label>

            {quizdetails.image ? (
              <div className="w-72 h-[135px] border border-dashed rounded">
                <img
                  className="w-full h-full rounded"
                  src={ typeof(delquizid) == "undefined" ? URL.createObjectURL(quizdetails.image) :`http://localhost:4000/${quizdetails.image}`}
                  // src={ URL.createObjectURL(quizdetails.image) }
                />
              </div>
            ) : (
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

                <h2 class="mt-1 tracking-wide text-gray-700">Cover Image</h2>

                <p class="mt-2 text-xs tracking-wide text-gray-500">
                  Upload or darg & drop your file SVG, PNG, JPG or GIF.{" "}
                </p>
                <input
                  onChange={(e) => handleImageChange(e)}
                  name="image"
                  id="dropzone-file"
                  type="file"
                  class="hidden"
                />
              </label>
            )}
          </div>
          <div className="w-full flex flex-col gap-x-8 gap-y-2">
            <div className="">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Grade*
              </label>

              <select
                name="grade"
                value={quizdetails.grade}
                onChange={(e) => handleChange(e)}
                className="py-2.5 px-4 w-full mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              >
                <option selected disabled hidden>
                  Grade
                </option>
                {grade.map((g) => (
                  <option value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Difficulty level
              </label>

              <select
                name="difficultylevel"
                value={quizdetails.difficultylevel}
                onChange={(e) => {
                  handleChange(e);
                }}
                className={`${quizdetails.difficultylevel === "hard"
                  ? "text-red-500"
                  : quizdetails.difficultylevel === "medium"
                    ? "text-yellow-400"
                    : "text-green-500"
                  } font-bold py-2.5 px-4 w-full mt-2 rounded-lg border-2 border-gray-300 bg-white focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40`}
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
            </div>
          </div>
          <div className="flex flex-col gap-x-4">
            <div className="">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Quiz Launch Date And Time*
              </label>
              <div className="flex items-center gap-x-1">
                <label for="quizdate">
                  <input
                    name="date"
                    id="quizdate"
                    type="date"
                    onChange={(e) => handleDateChange(e)}
                    value={delquizid ? `${quizdetails.starttime.year}-${quizdetails.starttime.month<10?"0"+quizdetails.starttime.month:quizdetails.starttime.month}-${quizdetails.starttime.day<10?"0"+quizdetails.starttime.day:quizdetails.starttime.day}` :quizdetails.starttime.date}
                    className="mt-2 px-5 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                  />
                </label>
                <select
                  name="hour"
                  onChange={(e) => handleDateChange(e)}
                  value={quizdetails.starttime.hour}
                  className="py-2.5 px-4 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                >
                  <option selected disabled hidden>Hour</option>

                  {hours.map((i) => (
                    <option value={i}>{i <= 9 ? "0" + i.toString() : i}</option>
                  ))}
                </select>
                <h1 className="text-2xl">:</h1>
                <select
                  name="minute"
                  onChange={(e) => handleDateChange(e)}
                  value={quizdetails.starttime.minute}
                  className="py-2.5 px-4 mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                >
                  <option selected disabled hidden>minutes</option>
                  {minutes.map((i) => (
                    <option value={i}>{i <= 9 ? "0" + i.toString() : i}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-2">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Quiz Duration In Minute*
              </label>

              <select
                name="duration"
                value={quizdetails.duration}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="py-2.5 px-4 w-full mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
              >
                <option selected disabled hidden>Quiz Duration</option>
                {minutes.map((minute) => (
                  <option value={minute + 1}>{minute + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-x-4 mt-5 items-end">
          <div className="w-48">
            <label for="file" class="block text-sm font-bold text-gray-500">
              Subject*
            </label>

            <select
              name="subject"
              value={quizdetails.subject}
              onChange={(e) => {
                handleChange(e);
              }}
              className="py-2.5 px-4 w-full mt-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
            >
              <option selected disabled hidden>Subject</option>
              {subjects.map((subject) => (
                <option key={subject.subject} value={subject.subject}>
                  {subject.subject}
                </option>
              ))}
            </select>

          </div>
          <div className=" py-2.5 px-4 w-fit h-fit flex gap-x-4 rounded-lg border-2 border-gray-300">
            <label for="file" class="block text-sm font-bold text-gray-500">
              Show Result
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
              <input
                name="showresult"
                onChange={(e) => {
                  handleCheckboxChange(e);
                }}
                checked={quizdetails.showresult ? true : false}
                type="checkbox"
                value=""
                class="hidden peer"
              />
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-opacity-50 peer-focus:ring-teal-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-900"></div>
            </label>
          </div>
          <div className=" py-2.5 px-4 w-fit h-fit flex gap-x-4 rounded-lg border-2 border-gray-300">
            <label for="file" class="block text-sm font-bold text-gray-500">
              Private Quiz
            </label>
            <label class="inline-flex items-center me-5 cursor-pointer">
              <input
                name="private"
                onChange={(e) => {
                  handleCheckboxChange(e);
                }}
                checked={quizdetails.private ? true : false}
                type="checkbox"
                value=""
                class="hidden peer"
              />
              <div class="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-opacity-50 peer-focus:ring-teal-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-900"></div>
            </label>
          </div>
          {quizdetails.private && (
            <div className="mt-2">
              <label for="file" class="block text-sm font-bold text-gray-500">
                Password*
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={quizdetails.password}
                  onChange={(e) => handleChange(e)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Quiz Password"
                  class="block mt-2 w-72 h-fit placeholder-gray-400/70 rounded-lg border-2 border-gray-300 bg-white px-5 py-2.5 text-gray-700 focus:border-teal-900 focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-40"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-min bg-white sticky bottom-0 p-2 flex justify-end ">
        <button
          className="py-2.5 px-6 bg-teal-800 text-white hover:font-bold hover:bg-teal-700 rounded-lg"
          onClick={() => {
            if (validate()) {
              props.changetab(1);
              props.saveQuizDetails(quizdetails);
            }
          }}
        >
          Save & Next
        </button>
      </div>
    </div>
  );
}
