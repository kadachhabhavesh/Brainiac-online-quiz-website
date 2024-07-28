import { useEffect, useState, createContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";


export default () => {
    const [baseurl, setBaseurl] = useState(window.location.pathname);
    const navigate = useNavigate()
    return <>
        <div className="_home h-screen w-full flex">
            <div className="sidebar bg-white w-52 px-1">
                <img src={logo} className="h-12 mx-auto" />
                <div className="_profile my-6 mx-4 cursor-pointer">
                    <h1 className="font-bold text-sm hover:underline">
                        {/* {user && `${user.firstname} ${user.lastname}`} */}
                        kadachha Bhavesh
                    </h1>

                    <h1 className="text-xs leading-3 bg-teal-950 w-min px-2 pt-[1px] pb-[2px] rounded-full text-white">
                        Admin
                    </h1>
                </div>
                <div className="_menu flex flex-col mb-5">
                    <div
                        className={`_menu_item ${baseurl === "/admin" ? "bg-teal-100 font-bold" : "bg-none"
                            } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
                        onClick={() => {
                            navigate("/admin");
                            setBaseurl("/admin");
                        }}
                    >
                        {/* <img src={exploreIcon} className="h-6" /> */}
                        <h1 className=" ">Users</h1>
                    </div>
                    <div
                        className={`_menu_item ${baseurl === "/admin/quiz" ? "bg-teal-100 font-bold" : "bg-none"
                            } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
                        onClick={() => {
                            navigate("/admin/quiz");
                            setBaseurl("/admin/quiz");
                        }}
                    >
                        {/* <img src={exploreIcon} className="h-6" /> */}
                        <h1 className=" ">Quizziz</h1>
                    </div>
                    <div
                        className={`_menu_item ${baseurl === "/admin/playlist" ? "bg-teal-100 font-bold" : "bg-none"
                            } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
                        onClick={() => {
                            navigate("/admin/playlist");
                            setBaseurl("/admin/playlist");
                        }}
                    >
                        {/* <img src={exploreIcon} className="h-6" /> */}
                        <h1 className=" ">PlayLists</h1>
                    </div>
                    <div
                        className={`_menu_item ${baseurl === "/admin/subject" ? "bg-teal-100 font-bold" : "bg-none"
                            } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
                        onClick={() => {
                            navigate("/admin/subject");
                            setBaseurl("/admin/subject");
                        }}
                    >
                        {/* <img src={exploreIcon} className="h-6" /> */}
                        <h1 className=" ">Subjects</h1>
                    </div>
                    <div
                        className={`_menu_item ${baseurl === "/logout" ? "bg-teal-100 font-semibold" : "bg-none"
                            } flex flex-row px-4 py-2 hover:bg-teal-100 gap-x-3 rounded-md hover:font-bold cursor-pointer`}
                    >
                        <h1 className=" " onClick={() => {
                            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            navigate("/")
                        }}>Logout</h1>
                    </div>
                </div>
                {/* <Link
                    className="mx-4 px-6 py-2 border-2 hover:bg-teal-950 hover:text-white rounded-md hover:border-none"
                    to=""
                >
                    Enter Code
                </Link> */}
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
                <div className="px-3">
                    {/* <UserContext.Provider value={user}> */}
                    <Outlet />
                    {/* </UserContext.Provider> */}
                </div>
            </div>
        </div>
    </>
}