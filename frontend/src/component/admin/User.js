import { useEffect, useState } from "react"
import { json, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default () => {
    const navigate = useNavigate()
    const [users, setUsers] = useState();
    const alert = withReactContent(Swal);
    const [editUserId, setEditUserId] = useState(-1)
    const [editUserData, setEditUserData] = useState();
    const loadUser = () => {
        fetch(`http://localhost:4000/user/admin`, { credentials: "include" })
            .then(res => {
                if (res.status === 401)
                    navigate("/")
                return res.json();
            }).then(res => { setUsers(res); console.log(res); })
            .catch((res) => console.log(res));
    }

    const deleteUser = (userId) => {
        const delAlert = alert.mixin({
            customClass: {
                confirmButton: 'bg-green-500 hover:bg-teal-600 text-white font-bold py-1 px-6 rounded mx-2',
                cancelButton: 'bg-red-500 hover:bg-orange-600 text-white font-bold py-1 px-6 rounded mx-2'
            },
            buttonsStyling: false
        })
        delAlert.fire({
            title: "Are you sure?",
            text: `You want to delete User`,
            icons: "error",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(res => {
            if (res.isConfirmed) {
                fetch(`http://localhost:4000/user/${userId}`, { method: "DELETE", credentials: 'include' })
                    .then(res => {
                        if (res.status === 401)
                            navigate('/')
                        delAlert.fire({
                            title: "Deleted",
                            icon: "success"
                        })
                        loadUser();
                    })
            }
        })
    }

    const handleInputChange = (e) => {
        setEditUserData({ ...editUserData, [e.target.name]: e.target.value })
        console.log(editUserData);
    }

    const saveEditData = () => {
        fetch(`http://localhost:4000/user/${editUserId}`, { 
            credentials: 'include', 
            method: "PUT", 
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(editUserData)
        })
            .then(res => {
                if (res.status === 401)
                    navigate('/')
                setEditUserId(-1)
                alert.fire("User details update successfully");
                loadUser();
            })
    }

    useEffect(() => {
        loadUser()
    }, [])

    return <>
        <div className={`flex gap-y-4 flex-col mt-4`}>
            {/* student data */}
            <div className="w-full max-h-[96vh] rounded flex flex-col gap-x-2 bg-white shadow-lg px-2 overflow-x-scroll no-scrollbar">
                <h1 className="font-bold p-3">Students</h1>
                {users && users.student.length <= 0 && <h1 className="p-2 mx-auto font-bold text-gray-500 mb-2">Students Not Found</h1>}
                {users && users.student.length > 0 && <table class="w-full h-fit text-sm text-left rtl:text-right text-gray-500 rounded">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 rounded">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                password
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Total Quiz Played
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Total Marks
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Accuracy
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>

                        </tr>
                    </thead>
                    <tbody>


                        {users && users.student.map((student) => <tr class="bg-white border-b hover:bg-gray-50">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                1
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {`${student.firstname} ${student.lastname}`}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {student.email}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {student.password}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {student.totalquiz}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {student.totalmarks}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {student.totalquiz > 0 ? `${((student.correctmarks / student.totalmarks) * 100).toFixed(2)}%` : "none"}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center" >
                                <svg className="h-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(`/admin/userprofile/${student._id}`)}>
                                    <path className="stroke-green-900 " d="M18 6 C16.8954 6 16 6.8954 16 8 L16 50 C16 51.1046 16.8954 52 18 52 L46 52 C47.1046 52 48 51.1046 48 50 L48 8 C48 6.8954 47.1046 6 46 6 L18 6 Z M18 54 L32 58 L46 54" fill="none" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900 " d="M20 10 H22 M24 10 H26 M28 10 H30 M32 10 H34 M36 10 H38 M40 10 H42 M44 10 H46" stroke="black" stroke-width="2" stroke-dasharray="0,2" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 20 A1.5 1.5 0 1 0 22 23 A1.5 1.5 0 1 0 22 20 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 28 A1.5 1.5 0 1 0 22 31 A1.5 1.5 0 1 0 22 28 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 36 A1.5 1.5 0 1 0 22 39 A1.5 1.5 0 1 0 22 36 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 44 A1.5 1.5 0 1 0 22 47 A1.5 1.5 0 1 0 22 44 Z" fill="black" />
                                    <path className="stroke-green-900" d="M26 20 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 28 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 36 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 44 H42" stroke="black" stroke-width="2" />
                                </svg>
                                <svg onClick={() => deleteUser(student._id)} className="h-7 hover:bg-gray-300 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                </svg>
                                <svg onClick={() => { setEditUserId(student._id); setEditUserData(student) }} className="h-7 hover:bg-gray-300 rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                                </svg>
                            </th>

                        </tr>)}



                    </tbody>
                </table>}
            </div>

            {/* teacher data */}
            <div className="w-full max-h-[96vh] rounded flex flex-col gap-x-2 bg-white shadow-lg px-2 overflow-x-scroll no-scrollbar">
                <h1 className="font-bold p-3">Teachers</h1>
                {users && users.teacher.length <= 0 && <h1 className="p-2 mx-auto font-bold text-gray-500 mb-2">Teachers Not Found</h1>}
                {users && users.teacher.length > 0 && <table class="w-full h-fit text-sm text-left rtl:text-right text-gray-500 rounded">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-100 rounded">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                #
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" class="px-6 py-3">
                                password
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Total Created Quiz
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Total Plays
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>

                        </tr>
                    </thead>
                    <tbody>



                        {users.teacher.map((teacher) => <tr class="bg-white border-b hover:bg-gray-50" >
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                1
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {`${teacher.firstname} ${teacher.lastname}`}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {teacher.email}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {teacher.password}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {teacher.totalquizcreated}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {teacher.totalplays}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">

                                <svg className="h-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(`/admin/userprofile/${teacher._id}`)}>

                                    <path className="stroke-green-900 " d="M18 6 C16.8954 6 16 6.8954 16 8 L16 50 C16 51.1046 16.8954 52 18 52 L46 52 C47.1046 52 48 51.1046 48 50 L48 8 C48 6.8954 47.1046 6 46 6 L18 6 Z M18 54 L32 58 L46 54" fill="none" stroke="black" stroke-width="2" />


                                    <path className="stroke-green-900 " d="M20 10 H22 M24 10 H26 M28 10 H30 M32 10 H34 M36 10 H38 M40 10 H42 M44 10 H46" stroke="black" stroke-width="2" stroke-dasharray="0,2" />


                                    <path className="stroke-green-900 fill-green-900" d="M22 20 A1.5 1.5 0 1 0 22 23 A1.5 1.5 0 1 0 22 20 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 28 A1.5 1.5 0 1 0 22 31 A1.5 1.5 0 1 0 22 28 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 36 A1.5 1.5 0 1 0 22 39 A1.5 1.5 0 1 0 22 36 Z" fill="black" />
                                    <path className="stroke-green-900 fill-green-900" d="M22 44 A1.5 1.5 0 1 0 22 47 A1.5 1.5 0 1 0 22 44 Z" fill="black" />


                                    <path className="stroke-green-900" d="M26 20 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 28 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 36 H42" stroke="black" stroke-width="2" />
                                    <path className="stroke-green-900" d="M26 44 H42" stroke="black" stroke-width="2" />
                                </svg>


                                <svg onClick={() => deleteUser(teacher._id)} className="h-7 hover:bg-gray-200 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                </svg>
                                <svg onClick={() => { setEditUserId(teacher._id); setEditUserData(teacher) }} className="h-7 hover:bg-gray-200 rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                                </svg>
                            </th>

                        </tr>)}



                    </tbody>
                </table>}
            </div>
        </div>
        {editUserId !== -1 && <div className="z-10 absolute w-screen h-screen bg-transparent top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center bg-gray-900 bg-opacity-70">
            {console.log(editUserData)}
            <div className=" z-20 w-1/3 bg-white rounded shadow-2xl opacity-90 px-4 py-6 flex flex-col gap-y-2">
                <h1 className="w-fit font-bold self-center text-xl mb-4">Edit User</h1>
                <div className="w-full flex gap-x-2">
                    <div className="w-full">
                        <h1 className="font-semibold text-gray-600">first name*</h1>
                        <input type="text" placeholder="First Name" value={editUserData.firstname} name="firstname" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
                    </div>
                    <div className="w-full">
                        <h1 className="font-semibold text-gray-600">Last name*</h1>
                        <input type="text" placeholder="Last Name" value={editUserData.lastname} name="lastname" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
                    </div>
                </div>
                <div className="w-full">
                    <h1 className="font-semibold text-gray-600">Email*</h1>
                    <input type="text" placeholder="Email" value={editUserData.email} name="email" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
                </div>
                <div className="w-full">
                    <h1 className="font-semibold text-gray-600">password*</h1>
                    <input type="text" placeholder="Password" value={editUserData.password} name="email" onChange={(e) => handleInputChange(e)} className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200" />
                </div>
                <div className="w-full">
                    <h1 className="font-semibold text-gray-600">User type*</h1>
                    <select className="w-full border-2 rounded py-2 px-3 border-gray-400 outline-none hover:outline-teal-700 hover:border-gray-200"
                        name="usertype"
                        value={editUserData.usertype}
                        onChange={(e) => handleInputChange(e)}
                    >
                        <option selected hidden>User Type</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="flex justify-end gap-x-4 my-4">
                    <button onClick={() => setEditUserId(-1)} className="cursor-pointer font-bold bg-orange-500 text-white px-4 py-1 rounded">Close</button>
                    <button onClick={() => saveEditData()} className="cursor-pointer font-bold bg-teal-800 text-white px-4 py-1 rounded">Save</button>
                </div>
            </div>
        </div>}
    </>
}