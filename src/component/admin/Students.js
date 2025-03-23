import { useEffect, useState } from "react"
import { json, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import toast from "react-hot-toast"
import AddEditUser from "./AddEditUser"

export default () => {
    const navigate = useNavigate()
    const [students, setStudents] = useState();
    const alert = withReactContent(Swal);
    const [editUserId, setEditUserId] = useState(-1)
    const [editUserData, setEditUserData] = useState();
    const [searchText, setSearchText] = useState("")

    const loadUser = () => {
        fetch(`http://localhost:4000/user/admin/students`, { credentials: "include" })
            .then(res => {
                if (res.status === 401)
                    navigate("/")
                return res.json();
            }).then(res => { setStudents(res); console.log(res); })
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
                        toast.success("students deleted successfully")
                        loadUser();
                    })
                    .catch(error => {
                        console.error(error);
                        toast.error("Could not load students");
                    });
            }
        })
    }

    const openEditModel = (students) => {
        setEditUserId(students._id)
        setEditUserData(students)
    }

    const closeEditModel = () => {
        setEditUserId(-1)
        setEditUserData(null)
    }

    const handleSearchChange = (event) => {
        setSearchText(event.target.value)
    }

    useEffect(() => {
        loadUser()
    }, [])


    const filteredStudents = students && students.filter((student) => `${student.firstname} ${student.lastnamename}`.toLowerCase().includes(searchText.toLowerCase()) || student.email.toLowerCase().includes(searchText.toLowerCase()))

    return <>
        <div className={`flex gap-y-4 flex-col mt-4`}>
            <div className="w-full max-h-[96vh] rounded flex flex-col gap-x-2 bg-white shadow-lg px-2 overflow-x-scroll no-scrollbar">
                <div className="flex items-center justify-between">
                    <h1 className="font-bold p-3">Students</h1>
                    <input type="text" placeholder="Search by name or email" value={searchText} onChange={(event) => handleSearchChange(event)} className="h-min w-72 px-3 py-1 border-2 border-gray-400 outline-none rounded-md hover:outline-teal-600 hover:border-gray-200" />
                </div>
                {filteredStudents && filteredStudents.length <= 0 && <h1 className="p-2 mx-auto font-bold text-gray-500 mb-2">Students Not Found</h1>}
                {filteredStudents && filteredStudents.length > 0 && <table class="w-full h-fit text-sm text-left rtl:text-right text-gray-500 rounded">
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
                                Email verified
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


                        {filteredStudents && filteredStudents.map((stu, index) => <tr class="bg-white border-b hover:bg-gray-50">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {index + 1}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {`${stu.firstname} ${stu.lastname}`}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.email}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.Emailverified ? <label className="bg-sky-400 px-2 py-0.5 rounded-full text-xs text-white">verified</label> : <label className="bg-red-400 px-2 py-0.5 rounded-full text-xs text-white">not verified</label>}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.password}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.totalquiz}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.totalmarks}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {stu.totalquiz > 0 ? `${((stu.correctmarks / stu.totalmarks) * 100).toFixed(2)}%` : "none"}
                            </th>
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center" >
                                <svg className="h-6" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" onClick={() => navigate(`/admin/userprofile/${stu._id}`)}>
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
                                <svg onClick={() => deleteUser(stu._id)} className="h-7 hover:bg-gray-300 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30">
                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                                </svg>
                                <svg onClick={() => openEditModel(stu)} className="h-7 hover:bg-gray-300 rounded p-1 stroke-teal-500 fill-teal-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24">
                                    <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                                </svg>
                            </th>

                        </tr>)}
                    </tbody>
                </table>}
            </div>
            {editUserId !== -1 && <AddEditUser editUserId={editUserId} editUserData={editUserData} onClose={closeEditModel} loadUser={loadUser} />}
        </div>

    </>
}