import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useState } from "react";

export default () => {
    const navigate = useNavigate()
    const [loginDetails, setloginDetails] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState({ msg: null, iserr: true });

    const handleChange = (e) => {
        setloginDetails({ ...loginDetails, [e.target.name]: e.target.value });
    };


    const handleFormSubmition = (e) => {
        console.log(loginDetails);
        if (!loginDetails.email || !loginDetails.password || !loginDetails.confirmpassword) {
            setErrorMsg({["msg"]:"Please fill all data",["iserr"]:true});
            return;
        }
        const regexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regexp.test(String(loginDetails.email).toLowerCase())){
            setErrorMsg({["msg"]:"Enter valid email",["iserr"]:true})
            return;
        }
        if (loginDetails.password.length <= 0) {
            setErrorMsg({["msg"]:"password grater then 8 latters",["iserr"]:true});
            return;
        }
        if (loginDetails.password.length !== loginDetails.confirmpassword.length) {
            setErrorMsg({["msg"]:"password and confirm password must be same",["iserr"]:true});
            return;
        }
        
        fetch('http://localhost:4000/user/forgotpass',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(loginDetails),
            credentials: 'include'
        }).then((res)=>{
            if(res.status===400){
                setErrorMsg({"msg":"incorrect email","iserr":true})
            }else{
                setErrorMsg({"msg":"Password Change successfuly","iserr":false})
            }
            return res.json()
        })
        .catch((err)=>{
            setErrorMsg({["msg"]:"server error",["iserr"]:true})
            console.log(err);
        })

        console.log(loginDetails);
    };

    return (
        <div className="h-screen bg-gray-200 flex items-center">
            {errorMsg.msg && (
                <div className="absolute top-2 flex justify-center items-center w-full">
                    <div
                        className={`min-w-96 rounded py-1 px-3 flex justify-between items-center ${errorMsg.iserr
                                ? "border-red-700 bg-red-300 text-red-700"
                                : "border-green-700 text-green-700 bg-green-300"
                            }`}
                    >
                        <h1 className="font-bold">{errorMsg.msg}</h1>
                        <svg
                            onClick={() => setErrorMsg({ ...errorMsg, ["msg"]: null })}
                            className="h-4 cursor-pointer"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <line
                                className={`stroke-current ${errorMsg.iserr?"text-red-700":"text-green-700"}`}
                                x1="10"
                                y1="10"
                                x2="90"
                                y2="90"
                                stroke="black"
                                stroke-width="10"
                                stroke-linecap="round"
                            />
                            <line
                                className={`stroke-current ${errorMsg.iserr?"text-red-700":"text-green-700"}`}
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
            <div className="max-w-sm h-fit w-96 bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
                <img className="w-36 mx-auto mt-3" src={logo} alt="logo" />
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Forgot Password
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="email"
                            >
                                Email*
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="password"
                            >
                                New Password*
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
                                    onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="password"
                            >
                                Confirm Password*
                            </label>
                            <div className="relative">
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    name="confirmpassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    onChange={(e) => handleChange(e)}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                    onClick={()=>setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        <button
                            className="bg-teal-900 hover:bg-teal-700 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => handleFormSubmition()}
                        >
                            Log In
                        </button>
                        <div className="flex flex-col items-center mt-5">
                            <Link
                                className="inline-block align-baseline font-bold text-sm text-teal-800 hover:text-teal-600"
                                to="/"
                            >
                                login
                            </Link>
                            <Link
                                className="inline-block align-baseline font-bold text-sm text-teal-800 hover:text-teal-600"
                                to="/signup"
                            >
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
