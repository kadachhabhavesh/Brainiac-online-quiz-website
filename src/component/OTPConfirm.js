import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";

export default () => {
    const { id } = useParams();
    
    const navigate = useNavigate()
    const [OTP, setOTP] = useState();
    const [errorMsg, setErrorMsg] = useState({ msg: null, iserr: true });
    const [userData, setuserData] = useState();


    useEffect(() => {
        // fetch(`http://localhost:4000/user/${id}`, 
        //     { 
        //         credentials: "include"
        //     })
        //   .then((res) => res.json())
        //   .then((res) => {
        //     setuserData(res);
        //     console.log(res,22);
        //   })
        //   .catch((res) => console.log(res));


        fetch(`http://localhost:4000/user/sendotp/${id}`, 
            { 
                method:"PUT",
                credentials: "include"
            })
          .then((res) => res.json())
          .then((res) => {
            setuserData(res);
            console.log(res,34);
          })
          .catch((res) => console.log(res));

      }, []);
  
    const handleFormSubmition = (e) => {

        console.log(userData,28);
        

        if (!OTP) {
            setErrorMsg({ ["msg"]: "Please Enter OTP", ["iserr"]: true });
            return;
        }
        if (OTP.length < 6) {
            setErrorMsg({ ["msg"]: "Enter valid OTP", ["iserr"]: true });
            return;
        }
        if(OTP && userData.user.OTP.OTP==OTP){
            setErrorMsg({ ["msg"]: "Email confirmed", ["iserr"]: false });
            setuserData((prevData) => ({
                ...prevData,   // Spread the previous data to preserve other fields
                "Emailverified": true // Update the specific field
            }));
            console.log(userData);
              
              fetch(`http://localhost:4000/user/${id}`, 
               { 
                    method: "PUT", 
                    credentials: "include", 
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({"otp":OTP})
               })
              .then((res) => {
                  return res.json()
              })
              .then((res) => {
                  console.log(res);
                  setTimeout(()=>{
                    navigate('/');
                },1000)
              })
              .catch((res) => console.log(res));
            return;
        }else{
            setErrorMsg({ ["msg"]: "Enter valid OTP", ["iserr"]: true });
            return;
        }
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
            <div className="max-w-sm h-fit w-96 bg-white rounded-lg overflow-hidden shadow-lg mx-auto">
                <img className="w-36 mx-auto mt-3" src={logo} alt="logo" />
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Email verification
                    </h2>
                    {/* <p className="text-gray-700 mb-6">Please sign in to your account</p> */}
                    <form>
                        <div className="">
                            <label
                                className="block text-gray-700 font-bold mb-2"
                                htmlFor="OTP"
                            >
                                OTP*
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="OTP"
                                name="OTP"
                                type="number"
                                placeholder="Enter OTP"
                                onChange={(e) => {
                                    setOTP(e.target.value)
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-teal-900 font-bold flex float-end my-2 cursor-pointer hover:underline hover:text-teal-700">Resend OTP</label>
                        </div>

                        <button
                            className="bg-teal-900 hover:bg-teal-700 text-white font-bold py-2 w-full rounded focus:outline-none focus:shadow-outline my-4"
                            type="button"
                            maxlength="6"
                            onClick={() => handleFormSubmition()}
                        >
                            Verify
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
