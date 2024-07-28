import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useState } from "react";
export default () => {
    const [userDetails, setUserDetails] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState({msg:null,iserr:true});

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
    }
    
    const handleFormSubmition = (e) => {
        if (!userDetails.firstname || !userDetails.lastname || !userDetails.email || !userDetails.usertype || !userDetails.password || !userDetails.confirmpassword) {
            setErrorMsg({...errorMsg,["msg"]:"Please Fill Data"})
            return;
        }
        const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexp.test(String(userDetails.email).toLowerCase())){
            setErrorMsg({["msg"]:"Enter valid email",["iserr"]:true})
            return;
        }
        if(userDetails.password.length<8 || userDetails.confirmpassword.length<8){
            setErrorMsg({["msg"]:"password is greater than 8 latters",["iserr"]:true})
            return;
        }
        if(userDetails.password !== userDetails.confirmpassword){
            setErrorMsg({["msg"]:"password and confirm password must be some",["iserr"]:true})
            return;
        }
        fetch("http://localhost:4000/user/signup",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify(userDetails),
            credentials: 'include'
        })
        .then((res)=>{
            if(res.status===400){
                setErrorMsg({["msg"]:"Email already exists",["iserr"]:true});
            }else{
                setErrorMsg({["msg"]:"Account successfuly created",["iserr"]:false});
            } 
            console.log(res);
        })
        .catch((err)=>{
            setErrorMsg({["msg"]:"server error",["iserr"]:true})
            console.log(err);
        })
        
    }

    return (
        <div class="h-screen bg-gray-200 flex items-center justify-center">
            {errorMsg.msg && <div className="absolute top-2 flex justify-center items-center w-full">
                <div className={`min-w-96 rounded py-1 px-3 flex justify-between items-center ${ errorMsg.iserr?" border-red-700 text-red-700 bg-red-300":" border-green-700 text-green-700 bg-green-300" }`}>
                <h1 className="font-bold">{ errorMsg.msg }</h1>
                <svg
                            onClick={() => setErrorMsg({ ...errorMsg, ["msg"]: null })}
                            className="h-4 cursor-pointer"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <line
                                className="stroke-current text-red-700"
                                x1="10"
                                y1="10"
                                x2="90"
                                y2="90"
                                stroke="black"
                                stroke-width="10"
                                stroke-linecap="round"
                            />
                            <line
                            className="stroke-current text-red-700"
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
            </div>}
            <div class="max-w-sm h-fit bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
                <img className="w-36 mx-auto my-3" src={logo} />
                <div class="p-6">
                    {/* <h2 class="text-2xl font-bold text-gray-800 mb-8">Create Account</h2> */}
                    <form>
                        <div class="flex justify-center gap-x-4 mb-2">
                            <label for="student" class="shadow border rounded">
                                <input
                                    id="student"
                                    type="radio"
                                    value="student"
                                    name="usertype"
                                    class="peer hidden"
                                    onChange={(e) => handleChange(e)}
                                />
                                <span class="peer-checked:bg-teal-900 peer-checked:text-white px-12 py-1 block rounded">
                                    Student
                                </span>
                            </label>
                            <label for="teacher" class="shadow border rounded">
                                <input
                                    id="teacher"
                                    type="radio"
                                    value="teacher"
                                    name="usertype"
                                    class="peer hidden"
                                    onChange={(e) => handleChange(e)}
                                />
                                <span class="peer-checked:bg-teal-900 peer-checked:text-white px-12 py-1 block rounded">
                                    Teacher
                                </span>
                            </label>
                        </div>

                        <div className="flex gap-x-4 mb-2">
                            <div>
                                <label
                                    class="block text-gray-700 font-bold mb-2"
                                    for="firstname"
                                >
                                    First Name*
                                </label>
                                <input
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="firstname"
                                    name="firstname"
                                    type="text"
                                    placeholder="First Name"
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <div>
                                <label
                                    class="block text-gray-700 font-bold mb-2"
                                    for="lastname"
                                >
                                    Last Name*
                                </label>
                                <input
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>
                        <div class="mb-2">
                            <label class="block text-gray-700 font-bold mb-2" for="email">
                                Email*
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                                Password*
                            </label>
                            <div className="relative">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={(e) => handleChange(e)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={(e) => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="confirmpassword">
                                Password*
                            </label>
                            <div className="relative">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    name="confirmpassword"
                                    type={showCPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    onChange={(e) => handleChange(e)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={(e) => setShowCPassword(!showCPassword)}
                                >
                                    {showCPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <button
                            class="bg-teal-900 hover:bg-teal-700 text-white font-bold py-2 mt-3 w-full rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => handleFormSubmition()}
                        >
                            Sign Up
                        </button>
                        <div className="flex flex-col items-center mt-2">
                            <Link
                                class="inline-block align-baseline font-bold text-sm text-teal-800 hover:text-teal-600"
                                to="/"
                            >
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};