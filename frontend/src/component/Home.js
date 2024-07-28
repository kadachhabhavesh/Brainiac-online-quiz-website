import logo from "../assets/images/logo.png";
import exploreIcon from "../assets/icons/explore.png";
import PlaylistsIcon from "../assets/icons/playlists.png";
import ProfileIcon from "../assets/icons/profile.png";
import LogoutIcon from "../assets/icons/logout.png";
import reportIcon from "../assets/icons/report.png";
import likeIcon from "../assets/icons/like.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, createContext, useMemo } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function Home() {
  const UserContext = createContext()
  const [baseurl, setBaseurl] = useState(window.location.pathname);
  const [user, setUser] = useState({});
  const [quizCode, setQuizCode] = useState()
  const [showCodeDialog, setShowCodeDialog] = useState(false)
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    setQuizCode(e.target.value.toUpperCase())
  }

  const openQuiz = () => {
    fetch(`http://localhost:4000/quiz/quizbycode/${quizCode}`, {
      credentials: 'include',
    })
      .then(res => {
        console.log(res.status);
        if (res.status === 401)
          navigate("/")
        else if (res.status === 501){
          withReactContent(Swal).fire({
            title: "Quiz Not Found",
            text: "Your Code is Invalid",
            icon: "information"
          });
          return null
        }
        return res.json()
      })
      .then(res => {
        setShowCodeDialog(false)
        setQuizCode("")
        console.log(res);
          if (res) {
            navigate(`/home/playquiz/${res._id}`)
          }
      })
  }

  useEffect(() => {
    fetch("http://localhost:4000/user/getuserbyjwt", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setUser(res);
        console.log(res);
      })
      .catch((res) => console.log(res));
  }, []);

  const userContextValue = useMemo(() => ({ user }), [user]);

  return (
    <>
      <div className="_home h-screen w-full flex">
        <div className="sidebar bg-white w-52 px-1">
          <img src={logo} className="h-12 mx-auto" />
          <div className="_profile my-6 mx-4 cursor-pointer">
            <h1 className="font-bold text-sm hover:underline">
              {user && `${user.firstname} ${user.lastname}`}
            </h1>
            {/* student */}
            {user.usertype === "student" && (
              <h1 className="text-xs leading-3 bg-teal-950 w-min px-2 pt-[1px] pb-[2px] rounded-full text-white">
                student
              </h1>
            )}
            {/* teacher */}
            {user.usertype === "teacher" && (
              <h1 className="text-xs leading-3 bg-orange-500 w-min px-2 pt-[1px] pb-[2px] rounded-full text-white">
                teacher
              </h1>
            )}
          </div>
          {user.usertype === "teacher" && <div className="_create_quiz_btn my-8 mx-4" onClick={() => setBaseurl("/home/createquiz")}>
            <Link
              to="/home/createquiz"
              className="relative px-5 py-2 font-medium text-white group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-orange-500 group-hover:bg-teal-950 group-hover:skew-x-12"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-teal-950 group-hover:bg-orange-500 group-hover:-skew-x-12"></span>
              <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-orange-600 -rotate-12"></span>
              <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-orange-400 -rotate-12"></span>
              <span className="relative">Create Quiz</span>
            </Link>
          </div>}
          <div className="_menu flex flex-col mb-5">
            <div
              className={`_menu_item ${baseurl === "/home" ? "bg-teal-100 font-semibold" : "bg-none"
                } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
              onClick={() => {
                navigate("/home");
                setBaseurl("/home");
              }}
            >
              <img src={exploreIcon} className="h-6" />
              <h1 className=" ">Explore</h1>
            </div>
            <div
              className={`_menu_item ${baseurl === "/home/playlist" ? "bg-teal-100 font-bold" : "bg-none"
                } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
              onClick={() => {
                navigate(`/home/playlist`)
                setBaseurl(`/home/playlist`)
              }}
            >
              <img src={PlaylistsIcon} className="h-6" />
              <h1 className=" ">Playlists</h1>
            </div>
            <div
              className={`_menu_item ${baseurl === "/profile" ? "bg-teal-100 font-semibold" : "bg-none"
                } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
              onClick={() => {
                navigate(`/home/profile/${user._id}`)
                setBaseurl(`/home/profile/${user._id}`)
              }}
            >
              <img src={ProfileIcon} className="h-6" />
              <h1 className="">Profile</h1>
            </div>
            <div
              className={`_menu_item ${baseurl === "/logout" ? "bg-teal-100 font-semibold" : "bg-none"
                } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
            >
              <img src={LogoutIcon} className="h-6" />
              <h1 className=" " onClick={() => {
                document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                navigate("/")
              }}>Logout</h1>
            </div>
          </div>
          <button
            className="mx-4 px-6 py-2 border-2 hover:bg-teal-950 hover:text-white rounded-md hover:border-none"
            onClick={() => setShowCodeDialog(true)}
          >
            Enter Code
          </button>
        </div>
        <div className="_main w-full overflow-y-scroll bg-slate-200 flex-col">
          {baseurl !== "/home/createquiz" || (baseurl !== "/home/createquiz" && baseurl !== "/home/createquiz") && <div className="_search_bar z-10 bg-white flex flex-row px-4  gap-x-5 h-14 items-center sticky top-0">
            <input
              type="text"
              class="h-10 bg-gray-200 w-full pr-8 pl-5 border-none outline-none rounded my-4 focus:shadow-md focus:outline-none"
              placeholder="Search for quiz"
            />
            <button className="bg-teal-950 text-white h-10 w-40 rounded-md hover:shadow-md hover:bg-teal-700 hover:font-semibold">
              Search
            </button>
          </div>}
          <div>
            {/* <UserContext.Provider value={user}> */}
            <Outlet />
            {/* </UserContext.Provider> */}
          </div>
        </div>

        {/* Quiz Code */}
        {showCodeDialog && <div className=" absolute z-30 w-screen h-screen bg-gray-500 bg-opacity-70 flex justify-center items-center rounded-md">
          <div className="w-96 h-52 bg-white rounded flex flex-col justify-around items-center px-4 py-5">
            <h1 className="font-semibold">Search Quiz By Code</h1>
            <div>
              <input value={quizCode} onChange={(e) => handleCodeChange(e)} className="border-2 w-72 px-3 py-2 h-fit outline-none rounded hover:outline-teal-600 text-center tracking-[20px] font-bold uppercase" type="text" maxLength="8" />
            </div>

            <div className="flex gap-2">
              <button className="py-1 px-5 bg-teal-700 rounded font-semibold text-white hover:bg-teal-600" onClick={openQuiz}>Search Quiz</button>
              <button className="py-1 px-5 bg-orange-700 rounded font-semibold text-white hover:bg-orange-600" onClick={() => setShowCodeDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>}
      </div>


    </>
  );
}
