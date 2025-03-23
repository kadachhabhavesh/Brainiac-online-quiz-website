import { useEffect, useState } from "react"
import { json, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from "react-hot-toast"
export default ({ editUserId, editUserData, onClose, loadUser }) => {

    const navigate = useNavigate()
    const[ editData,setEditData] = useState(editUserData)
    const alert = withReactContent(Swal);

    const handleInputChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }

    const saveEditData = () => {
        fetch(`http://localhost:4000/user/updateUser/${editUserId}`, { 
            credentials: 'include', 
            method: "PUT", 
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(editData)
        })
            .then(res => {
                if (res.status === 401){
                    navigate('/')
                }
                onClose()
                toast.success("User details update successfully");
                loadUser();
                return res.json()
            })
            .then(res=>{
                console.log(res);
                
            })
    }

    return <div className="z-10 absolute w-screen h-screen bg-black bg-opacity-75 top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
    {console.log(editData)}
    <div className=" z-20 w-1/3 bg-white rounded shadow-2xl px-4 py-6 flex flex-col gap-y-2">
        <h1 className="w-fit font-bold self-center text-xl mb-4">Edit User</h1>
        <div className="w-full flex gap-x-2">
            <div className="w-full">
                <h1 className="font-semibold text-gray-600">first name*</h1>
                <input type="text" placeholder="First Name" value={editData.firstname} name="firstname" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
            </div>
            <div className="w-full">
                <h1 className="font-semibold text-gray-600">Last name*</h1>
                <input type="text" placeholder="Last Name" value={editData.lastname} name="lastname" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
            </div>
        </div>
        <div className="w-full">
            <h1 className="font-semibold text-gray-600">Email*</h1>
            <input type="text" placeholder="Email" value={editData.email} name="email" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
        </div>
        <div className="w-full">
            <h1 className="font-semibold text-gray-600">password*</h1>
            <input type="text" placeholder="Password" value={editData.password} name="password" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
        </div>
        <div className="w-full">
            <h1 className="font-semibold text-gray-600">User type*</h1>
            <select className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200"
                name="usertype"
                value={editData.usertype}
                onChange={(e) => handleInputChange(e)}
            >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
            </select>
        </div>
        <div className="w-full">
            <h1 className="font-semibold text-gray-600">verified*</h1>
            <select className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200"
                name="Emailverified"
                value={editData.Emailverified}
                onChange={(e) => handleInputChange(e)}
            >
                <option value={true}>verified</option>
                <option value={false}>not verified</option>
            </select>
        </div>
        <div className="flex justify-end gap-x-4 my-4">
            <button onClick={() => onClose()} className="cursor-pointer font-bold bg-orange-500 text-white px-4 py-1 rounded">Close</button>
            <button onClick={() => saveEditData()} className="cursor-pointer font-bold bg-teal-800 text-white px-4 py-1 rounded">Save</button>
        </div>
    </div>
</div>
}