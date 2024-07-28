import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default () => {
    const navigate = useNavigate()
    const alert = withReactContent(Swal)
    const [subjects, setSubjects] = useState()
    const [EditSubId, setEditSubId] = useState(-1)
    const [newSubject,setNewSubject] = useState("")

    const loadSubject = () => {
        fetch("http://localhost:4000/subject", { credentials: 'include' })
            .then(res => res.json())
            .then(res => setSubjects(res))
    }
    useEffect(() => {
        loadSubject()
    }, [])

    const handleChange = (e, index) => {
        const newSubjects = [...subjects]
        newSubjects[index].subject = e.target.value
        setSubjects(newSubjects)
    }

    const addSubject = ()=>{
        setNewSubject("")
        fetch(`http://localhost:4000/subject/add`, {
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({subject:newSubject})
        }).then(res => {
            if (res.status === 401)
                navigate('/')
            loadSubject()
        })
    }

    const updateSubject = (index) => {
        console.log(subjects[index]);
        fetch(`http://localhost:4000/subject/${EditSubId}`, {
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(subjects[index])
        }).then(res => {
            if (res.status === 401)
                navigate('/')
            setEditSubId(-1)
            loadSubject()
        })
    }

    const deleteSubject = (delId) => {
        const delAlert = alert.mixin({
            customClass: {
                confirmButton: 'bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-6 rounded mx-2',
                cancelButton: 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-6 rounded mx-2'
            },
            buttonsStyling: false
        })

        delAlert.fire({
            title: "Are you sure?",
            text: `You want to delete subject`,
            icons: "error",
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(res => {
            if (res.isConfirmed) {
                fetch(`http://localhost:4000/subject/${delId}`, { method: "DELETE", credentials: 'include' })
                    .then(res => {
                        if (res.status === 401)
                            navigate('/')
                        delAlert.fire({
                            title: "Deleted",
                            icon: "success"
                        })
                        loadSubject();
                    })
            }
        })
    }

    
    return <div className="w-full my-4">
        <div className="flex gap-x-2">
            <input type="text" value={newSubject} onChange={(e)=>setNewSubject(e.target.value)} placeholder="Enter subject here" className="h-8 w-64 rounded px-3 outline-none focus:outline-teal-700 placeholder:font-semibold placeholder:text-gray-400" />
            <button onClick={()=>addSubject()} className="py-1 px-5 rounded bg-white font-semibold hover:font-bold hover:shadow-lg hover:text-orange-600">Add Subject</button>
        </div>
        <div className=" w-full h-[88vh] mt-2 flex flex-col gap-y-2 overflow-y-scroll no-scrollbar">
            {subjects && subjects.length <= 0 && <h1>Subject Not Found</h1>}
            {subjects && subjects.length > 0 && subjects.map((subject, index) => <div className="w-1/2 h-10 bg-white rounded flex items-center justify-between p-4 hover:shadow-lg">
                {subject._id !== EditSubId && <h1 className="font-semibold">{subject.subject}</h1>}
                {subject._id === EditSubId && <input type="text" value={subject.subject} onChange={(e) => handleChange(e, index)} className="border-b-2 outline-none h-7 px-2" />}
                <div className="flex gap-x-2">
                    <svg className="h-7 hover:bg-gray-300 rounded p-1 stroke-red-500 fill-red-500" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 30 30" onClick={() => deleteSubject(subject._id)}>
                        <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z"></path>
                    </svg>
                    {EditSubId !== subject._id && <svg className="h-7 hover:bg-gray-300 rounded p-1 stroke-teal-900 fill-teal-900" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24" onClick={() => setEditSubId(subject._id)}>
                        <path d="M 18 2 L 15.585938 4.4140625 L 19.585938 8.4140625 L 22 6 L 18 2 z M 14.076172 5.9238281 L 3 17 L 3 21 L 7 21 L 18.076172 9.9238281 L 14.076172 5.9238281 z"></path>
                    </svg>}
                    {EditSubId === subject._id && <button onClick={() => updateSubject(index)} className="text-teal-900 font-bold py-0.5 px-2 rounded hover:bg-slate-200">save</button>}
                </div>
            </div>)}
        </div>
    </div>
}